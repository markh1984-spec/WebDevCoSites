// Shared bits for the "See inside" sign-up and the enquiry form.
// Not a route: Vercel ignores files in api/ that start with "_".
const crypto = require("crypto");

const SITE = "https://magazinemews.co.uk";
const FROM = "Magazine Mews <viewings@magazinemews.co.uk>";
const INBOX = "viewings@magazinemews.co.uk";
const DAYS = 30; // how long a "see inside" link keeps working

// The signing key is derived from the Resend key the Vercel integration
// puts in the project, so no extra secret has to be typed in anywhere.
function key() {
  const k = process.env.RESEND_API_KEY;
  if (!k) return null;
  return crypto.createHash("sha256").update("magazine-mews-inside-v1|" + k).digest();
}

const b64 = (buf) => Buffer.from(buf).toString("base64url");

// The family's own shortcut into the inside photos (31 Oct 2026), so they
// don't have to sign up each time: magazinemews.co.uk/inside?k=<family key>.
// Only this fingerprint of the key is kept here (the repo is public); the
// key itself lives in the family's link. To change the link, make a new key
// and put the sha256 of "magazine-mews-family-v1|<key>" here.
const FAMILY_KEY_SHA256 = "a1a0f7a9d86ba802286e6573d0a71eb54fd77c5635c6487533f9c7f88f787202";
// Mom's contacts page (magazinemews.co.uk/admin?k=<admin key>, 2 Nov 2026).
// Same idea as the family key: only the fingerprint is kept here.
const ADMIN_KEY_SHA256 = "f7a3d8aab85b034d96aecc19f2ba10319ffff6aaa0db4f242ba73c7777d0177b";
function adminOk(k) {
  if (typeof k !== "string" || k.length < 16 || k.length > 64) return false;
  const got = crypto.createHash("sha256").update("magazine-mews-admin-v1|" + k).digest();
  return crypto.timingSafeEqual(got, Buffer.from(ADMIN_KEY_SHA256, "hex"));
}

function familyOk(k) {
  if (typeof k !== "string" || k.length < 16 || k.length > 64) return false;
  const got = crypto.createHash("sha256").update("magazine-mews-family-v1|" + k).digest();
  return crypto.timingSafeEqual(got, Buffer.from(FAMILY_KEY_SHA256, "hex"));
}

function sign(data) {
  const k = key();
  if (!k) throw new Error("not configured");
  const body = b64(JSON.stringify(data));
  const mac = b64(crypto.createHmac("sha256", k).update(body).digest()).slice(0, 32);
  return body + "." + mac;
}

function verify(token) {
  const k = key();
  if (!k || typeof token !== "string" || token.length > 2000) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const want = b64(crypto.createHmac("sha256", k).update(body).digest()).slice(0, 32);
  const a = Buffer.from(mac), b = Buffer.from(want);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let data;
  try { data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); } catch (e) { return null; }
  if (!data || typeof data.x !== "number" || Date.now() > data.x) return null;
  return data;
}

async function sendEmail({ to, subject, text, html, replyTo }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, text, html, reply_to: replyTo || INBOX }),
  });
  if (!res.ok) throw new Error("Resend " + res.status + " " + (await res.text()).slice(0, 300));
  return res.json();
}

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clean = (s, max) => String(s == null ? "" : s).replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 200;

// Body as an object, whether it arrived as JSON or a form post.
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let raw = typeof req.body === "string" ? req.body : "";
  if (!raw) {
    raw = await new Promise((resolve) => {
      let d = ""; req.on("data", (c) => { d += c; if (d.length > 20000) req.destroy(); });
      req.on("end", () => resolve(d)); req.on("error", () => resolve(""));
    });
  }
  try { return JSON.parse(raw); } catch (e) { return Object.fromEntries(new URLSearchParams(raw)); }
}

function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

// Simple branded email wrapper.
function wrap(title, inner) {
  return `<!doctype html><html><body style="margin:0;background:#FBF4F6;font-family:Helvetica,Arial,sans-serif;color:#2E1428">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8E2F5A;font-weight:bold">Magazine Mews · Shoeburyness</p>
<h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:26px;color:#4A1F3D">${title}</h1>
${inner}
<p style="margin:28px 0 0;font-size:12px;color:#5A3A50">Magazine Mews, Shoeburyness · <a href="${SITE}/" style="color:#8E2F5A">magazinemews.co.uk</a></p>
</div></body></html>`;
}

// The private Blob store, signed in with the project's OIDC token. The token
// comes fresh on every request, so always take the latest one.
async function blobSdk(req) {
  const oidc = req && req.headers && req.headers["x-vercel-oidc-token"];
  if (oidc) process.env.VERCEL_OIDC_TOKEN = oidc;
  return import("@vercel/blob");
}

// Keep one contact event (signup, opened, enquiry, or a status/notes change
// from the contacts page) in the private store under leads/. Each event is
// its own file, named from its time, type and email, so nothing is ever
// overwritten by something else and saving the same event twice is harmless.
// Never throws: a storage hiccup mustn't stop the email going.
async function saveLead(req, ev) {
  try {
    const { put } = await blobSdk(req);
    const at = ev.at || new Date().toISOString();
    const id = crypto.createHash("sha256").update([ev.type, String(ev.email || "").toLowerCase(), at].join("|")).digest("hex").slice(0, 12);
    const name = "leads/" + at.replace(/[^0-9]/g, "").slice(0, 14) + "-" + ev.type + "-" + id + ".json";
    await put(name, JSON.stringify(Object.assign({}, ev, { at })), {
      access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true,
    });
    return true;
  } catch (e) {
    console.error("saveLead failed:", e.message);
    return false;
  }
}

// The number buyers can call or text (the family's, from 31 Oct 2026).
const PHONE = "07984 111375";

module.exports = { SITE, FROM, INBOX, DAYS, PHONE, sign, verify, familyOk, adminOk, blobSdk, saveLead, sendEmail, esc, clean, isEmail, readBody, json, wrap };
