#!/usr/bin/env node
/* ==========================================================
   FamCo house sites — builder
   ----------------------------------------------------------
     node famco/build.mjs                 every house in famco/houses.json
     node famco/build.mjs magazine-mews   just that house folder

   For each house it copies the shared files from famco/template,
   copies famco/agency.js, and renders index.html and favicon.svg
   from the house's content.js. The house's own files — content.js,
   photos/, og-image.jpg, README.md — are never touched.
   No dependencies; needs Node 18 or later.
   ========================================================== */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const FAMCO = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(FAMCO);
const TEMPLATE = path.join(FAMCO, "template");

// Copied as-is into every house (with a "generated" note on top).
const SHARED = ["site.js", "style.css", "vercel.json", "api/robots.js", "api/sitemap.js"];

const DEFAULT_FONTS = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Work+Sans:wght@400;500;600&display=swap";
const DEFAULT_COLOURS = { dark: "#17291F", accent: "#B8935A", accentLight: "#D9BE8C" };
// content.js theme key -> CSS variable in style.css
const THEME_VARS = {
  dark: "--green-900", darker: "--green-950", mid: "--green-800", midLight: "--green-700",
  accent: "--brass", accentLight: "--brass-light", warm: "--brick", warmDark: "--brick-dark",
  paper: "--paper", cream: "--cream", ink: "--ink",
  // the pale fill behind a photo while it loads, the mortar between the
  // bricks, and the hairlines on light sections — still green and beige
  // under any other colour scheme until a house could set them
  tint: "--green-100", mortar: "--mortar", line: "--line",
};

const has = (v) => (typeof v === "string" ? v.trim() !== "" : !!v);
const trim = (v) => (typeof v === "string" ? v.trim() : "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rel = (p) => path.relative(ROOT, p) || ".";

// Run a browser-style content file and return what it put on window.
function load(file, name) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: rel(file) });
  const value = sandbox.window[name];
  if (!value || typeof value !== "object") throw new Error(`${rel(file)} didn't set window.${name}`);
  return value;
}

// {{NAME}} is HTML-escaped, {{{NAME}}} goes in as-is. A placeholder with
// no value is an error, so a typo in the template can't ship silently.
function render(template, values, label) {
  const pick = (key, wrap) => {
    if (!(key in values)) throw new Error(`${label}: nothing to fill ${wrap(key)}`);
    return values[key];
  };
  // One pass, so text that came from content.js is never re-scanned.
  return template.replace(/\{\{\{(\w+)\}\}\}|\{\{(\w+)\}\}/g, (_, raw, plain) =>
    raw ? pick(raw, (x) => `{{{${x}}}}`) : esc(pick(plain, (x) => `{{${x}}}`)));
}

function values(H, AG, dir) {
  const A = H.address || {};
  const line1 = trim(A.line1);
  if (!line1 || line1 === "{{LINE1}}") throw new Error(`${rel(dir)}/content.js: address.line1 is empty`);
  const area = trim(A.area);
  const town = trim(A.town);
  const [townName, county] = town.split(",").map((s) => s.trim());
  const postcode = trim(A.postcode);
  const pc = postcode.replace(/\s+/g, "\u00a0");   // never split a postcode across lines
  const place = [area, town, postcode].filter(has);
  const fullAddress = [line1, ...place].join(", ");

  const live = AG.live === true;
  const saleWith = live ? `with ${AG.name}` : "privately";

  const site = H.site || {};
  const url = has(site.url) ? site.url.trim().replace(/\/?$/, "/") : "";
  const seo = H.seo || {};
  const summary = trim(seo.summary);

  // "12 Acacia Avenue" -> badge "12", street "Acacia Avenue"
  const m = line1.match(/^(\d+[A-Za-z]?)\s+(.+)$/);
  const street = m ? m[2] : line1;
  const crest = H.crest || {};
  const initials = street.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const numeral = trim(crest.numeral) || (m ? m[1] : initials);
  const crestName = trim(crest.name) || street.toUpperCase();
  const ring = trim(crest.ring) || [area, townName, county].filter(has).join(" · ").toUpperCase() + " ·";

  const theme = H.theme || {};
  const colour = (k) => trim(theme[k]) || DEFAULT_COLOURS[k];
  const vars = Object.entries(THEME_VARS)
    .filter(([k]) => has(theme[k]))
    .map(([k, v]) => `${v}: ${theme[k].trim()};`);
  if (has(theme.displayFont)) vars.push(`--font-display: "${theme.displayFont.trim()}", Georgia, serif;`);
  if (has(theme.bodyFont)) vars.push(`--font-body: "${theme.bodyFont.trim()}", system-ui, sans-serif;`);

  // Link previews: a made-for-sharing og-image.jpg wins, then the hero photo.
  const ogFile = fs.existsSync(path.join(dir, "og-image.jpg")) ? "og-image.jpg" : trim(H.heroPhoto);
  const ogImageTags = !ogFile ? "" : ogFile === "og-image.jpg"
    ? `<meta property="og:image" content="${esc(url + ogFile)}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">`
    : `<meta property="og:image" content="${esc(url + ogFile)}">`;
  const urlTags = !url ? "" :
    `<meta property="og:url" content="${esc(url)}">\n` +
    `<!-- The one address search engines should list, so preview links and other\n     copies of the site don't compete with it. -->\n` +
    `<link rel="canonical" href="${esc(url)}">`;
  const verification = has(site.googleVerification)
    ? `<meta name="google-site-verification" content="${esc(site.googleVerification.trim())}">`
    : "<!-- Google Search Console: put its verification code in site.googleVerification in content.js -->";

  const ld = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    ...(url && { url }),
    name: `${fullAddress} for sale`,
    description: summary || `A home for sale in ${townName || area || line1}.`,
    about: {
      "@type": "Accommodation",
      name: line1,
      address: {
        "@type": "PostalAddress",
        streetAddress: line1,
        ...(townName && { addressLocality: townName }),
        ...(county && { addressRegion: county }),
        ...(postcode && { postalCode: postcode }),
        addressCountry: "GB",
      },
      ...(area && { containedInPlace: { "@type": "Place", name: [area, townName].filter(has).join(", ") } }),
    },
    ...(live && { provider: { "@type": "RealEstateAgent", name: AG.name, ...(has(AG.url) && { url: AG.url.trim() }) } }),
  };

  // While FamCo isn't live, don't offer "FamCo Properties website" as an answer.
  const heard = (AG.heardVia || []).filter((o) => live || !String(o).includes(AG.name));
  const heardOptions = (heard.length ? heard : ["Other"]).map((o) => `            <option>${esc(o)}</option>`).join("\n");

  const contact = [
    has(AG.phone) && `<a href="tel:${esc(AG.phone.replace(/[^\d+]/g, ""))}">${esc(AG.phone.trim())}</a>`,
    has(AG.email) && `<a href="mailto:${esc(AG.email.trim())}">${esc(AG.email.trim())}</a>`,
  ].filter(Boolean).join(" · ");
  const sellerBlock = live
    ? `<p class="private-sale">\n          <strong>Marketed by ${esc(AG.name)}.</strong> ${esc(trim(AG.blurb))}\n        </p>` +
      (contact ? `\n        <p class="private-sale agency-contact">${contact}</p>` : "")
    : `<p class="private-sale">\n          <strong>A private sale.</strong> There's no estate agent in the\n          middle, so you'll be dealing directly with the family.\n        </p>`;

  const company = AG.company || {};
  const companyLine = [
    trim(company.legalName),
    has(company.number) && `Company no. ${company.number.trim()}`,
    has(company.registeredOffice) && `Registered office: ${company.registeredOffice.trim()}`,
  ].filter(Boolean).join(" · ");
  const footerLegal = live
    ? [
        `    <p>Marketed by ${esc(AG.name)}. ${esc(trim(AG.disclaimer))}</p>`,
        has(AG.redress) && `    <p>${esc(AG.redress.trim())}</p>`,
        companyLine && `    <p>${esc(companyLine)}</p>`,
      ].filter(Boolean).join("\n")
    : "    <p>\n      For sale privately by the owner. These details are given in good faith\n      as a general guide. They don't form part of any offer or contract.\n      Measurements are approximate, and no services or appliances have been\n      tested. Please check anything that matters to you before committing.\n    </p>";

  const mapQuery = encodeURIComponent([line1, townName, postcode].filter(has).join(", ")).replace(/%20/g, "+");

  return {
    GENERATED_NOTE: "Generated by famco/build.mjs from famco/template/index.html and this folder's content.js. Edit those and rebuild, not this file.",
    TITLE: trim(seo.title) || `${fullAddress} — For sale`,
    DESCRIPTION: `${line1} is for sale ${saleWith}.${summary ? " " + summary : ""} See photos and details, or arrange a viewing.`,
    THEME_COLOR: colour("dark"),
    OG_TITLE: `${line1}${area ? ", " + area : ""} — for sale`,
    OG_DESCRIPTION: `${summary ? summary + " " : ""}For sale ${saleWith}. Viewings by appointment.`,
    OG_IMAGE_TAGS: ogImageTags,
    URL_TAGS: urlTags,
    VERIFICATION_TAG: verification,
    JSON_LD: JSON.stringify(ld, null, 2).replace(/</g, "\\u003c"),
    FONTS_URL: trim(theme.fontsUrl) || DEFAULT_FONTS,
    THEME_STYLE: vars.length ? `<style>\n  /* This house's theme, from content.js */\n  :root {\n    ${vars.join("\n    ")}\n  }\n</style>` : "",
    BODY_CLASS: theme.brickEdges === false ? "no-brick" : "",
    LINE1: line1,
    BRAND_MARK: numeral,
    BRAND_NAME: street,
    BRAND_SUB: area || townName || "",
    EYEBROW: `For sale ${saleWith}`,
    ADDRESS_LINE: [area, town, pc].filter(has).join(" · "),
    CREST_RING: ring,
    CREST_NUMERAL: numeral,
    CREST_NAME: crestName,
    AREA_NAV: trim((H.area || {}).navLabel) || "The area",
    AREA_HEADING: trim((H.area || {}).heading) || "The area",
    MAP_ADDRESS: [street, [townName, pc].filter(has).join(" ")].filter(has).join(", "),
    MAP_LINK: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    HEARD_OPTIONS: heardOptions,
    SELLER_BLOCK: sellerBlock,
    FOOTER_ADDRESS: esc(`${line1}${area ? ", " + area : ""},`) + "<br>" + esc([town, pc].filter(has).join(" ")),
    FOOTER_LEGAL: footerLegal,
    // favicon.svg
    DARK: colour("dark"),
    ACCENT: colour("accent"),
    ACCENT_LIGHT: colour("accentLight"),
    MARK_SIZE: numeral.length <= 2 ? "34" : numeral.length === 3 ? "26" : "20",
    _warnings: [!url && "site.url is empty, so link previews and Google won't have the full address"].filter(Boolean),
  };
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function banner(file, source) {
  const note = `Generated by famco/build.mjs from ${source}. Edit that file and rebuild, not this one.`;
  return file.endsWith(".css") || file.endsWith(".js") ? `/* ${note} */\n` : "";
}

export function buildHouse(folder) {
  const dir = path.resolve(ROOT, folder);
  const contentFile = path.join(dir, "content.js");
  if (!fs.existsSync(contentFile)) throw new Error(`${rel(dir)} has no content.js`);

  const AG = load(path.join(FAMCO, "agency.js"), "AGENCY");
  const H = load(contentFile, "HOUSE");
  const v = values(H, AG, dir);

  for (const f of SHARED) {
    write(path.join(dir, f), banner(f, `famco/template/${f}`) + fs.readFileSync(path.join(TEMPLATE, f), "utf8"));
  }
  write(path.join(dir, "agency.js"), banner("agency.js", "famco/agency.js") + fs.readFileSync(path.join(FAMCO, "agency.js"), "utf8"));
  write(path.join(dir, "index.html"), render(fs.readFileSync(path.join(TEMPLATE, "index.html"), "utf8"), v, "index.html"));
  write(path.join(dir, "favicon.svg"), render(fs.readFileSync(path.join(TEMPLATE, "favicon.svg"), "utf8"), v, "favicon.svg"));
  const photosReadme = path.join(dir, "photos", "README.md");
  if (!fs.existsSync(photosReadme)) write(photosReadme, fs.readFileSync(path.join(TEMPLATE, "photos-README.md"), "utf8"));

  console.log(`✓ ${rel(dir)}  (${AG.live ? `marketed by ${AG.name}` : "private sale"})`);
  for (const w of v._warnings) console.log(`  ! ${w}`);
}

// Run directly (not imported by new-house.mjs)
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const houses = args.length ? args : JSON.parse(fs.readFileSync(path.join(FAMCO, "houses.json"), "utf8"));
  let failed = 0;
  for (const h of houses) {
    try { buildHouse(h); } catch (e) { failed++; console.error(`✗ ${h}: ${e.message}`); }
  }
  process.exit(failed ? 1 : 0);
}
