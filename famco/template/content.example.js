/* ==========================================================
   HOUSE CONTENT FILE
   ----------------------------------------------------------
   Everything this house's website says lives here. You never
   need to touch index.html, site.js or style.css — they're
   generated from famco/template by famco/build.mjs.

   HOW IT WORKS
   • Anything left as "" (empty quotes) is simply hidden on
     the site. So nothing half-finished ever shows. Fill a
     field in and it appears.
   • Text goes between the "double quotes". If your text needs
     a double quote inside it, use ’ or “ ” instead, or put a
     backslash before it: \"
   • Every item in a list ends with a comma. A missing comma
     or quote is the #1 way to break the page. If the site
     shows a red "content.js has a typo" bar, check the last
     thing you changed.
   • Photos go in the  photos/  folder. Then list them below
     by filename, e.g. "photos/kitchen.jpg".
   • After changing the address, site, seo, crest or theme
     sections, run  node famco/build.mjs  so the page's
     Google and link-preview details update too. Everything
     else updates as soon as this file is saved.
   ========================================================== */

window.HOUSE = {

  /* ── The basics ─────────────────────────────────────────── */

  address: {
    line1: "{{LINE1}}",
    area: "",              // estate, village or neighbourhood, e.g. "Shoebury Garrison"
    town: "",              // e.g. "Shoeburyness, Essex"
    postcode: "",
  },

  // The live web address. Used for Google, the sitemap and link previews.
  site: {
    url: "",               // e.g. "https://12acaciaavenue.vercel.app/"
    googleVerification: "",// the content="…" part of Google Search Console's HTML tag
  },

  // How the house appears in Google results and link previews.
  seo: {
    title: "",             // leave "" for "<full address> — For sale"
    summary: "",           // one sentence, e.g. "A Victorian villa a short walk from Leigh Broadway and the station."
  },

  // "For sale", "Under offer" or "Sold subject to contract".
  // Anything other than "For sale" shows a banner across the top.
  status: "For sale",

  // Short line under the address at the top of the page.
  headline: "",            // e.g. "A light-filled four-bedroom home on a quiet tree-lined road"
  tagline: "",             // shown instead while headline is empty; leave "" to show nothing

  // Leave amount as "" to hide the price entirely.
  // label is usually "Guide price", "Offers over" or "Offers in the region of".
  price: {
    label: "Guide price",
    amount: "",            // e.g. "£650,000"
  },

  // The big photo at the top. Leave "" and the top of the page
  // shows the crest instead. Landscape or portrait both work.
  heroPhoto: "",           // e.g. "photos/01-front.jpg"
  // The frame is taller than a landscape photo, so the sides get cropped.
  // Set this to keep a different part in view: "50% 50%" is the middle,
  // "70% 50%" shifts it towards the right of the photo.
  heroFocus: "",

  // The round crest shown until there's a hero photo, and the small
  // badge in the header. Leave any of these "" to work it out from
  // the address (house number, street name, area and town).
  crest: {
    ring: "",              // text around the edge, e.g. "LEIGH-ON-SEA · ESSEX · EST. 1898 ·"
    numeral: "",           // the big number or initials, e.g. "12"
    name: "",              // under the number, e.g. "ACACIA AVENUE"
  },

  // Colours and fonts. Leave {} for the standard FamCo look (deep green,
  // brass and brick). Any of these can be set on their own:
  //   dark, darker      main dark background and footer, e.g. "#1F2A44"
  //   mid, midLight     buttons and hover
  //   accent, accentLight   brass trim, highlights and the crest
  //   warm, warmDark    small headings, drop caps and the brick edging
  //   paper, cream, ink page backgrounds and text
  //   displayFont, bodyFont, fontsUrl   fonts; fontsUrl is the embed link
  //                     from fonts.google.com for those two fonts
  //   brickEdges        false hides the brick strips between sections
  theme: {},


  /* ── Key facts (the strip near the top) ──────────────────
     Fill in the value. Empty ones are hidden. Feel free to
     delete rows or add more in the same format.            */

  keyFacts: [
    { label: "Property type", value: "" },   // e.g. "Detached house"
    { label: "Bedrooms",      value: "" },   // e.g. "4"
    { label: "Bathrooms",     value: "" },
    { label: "Reception rooms", value: "" },
    { label: "Parking",       value: "" },   // e.g. "Garage + driveway"
    { label: "Garden",        value: "" },   // e.g. "South-facing rear garden"
  ],


  /* ── About the home ───────────────────────────────────────
     A few paragraphs, each in its own "quotes", separated by
     commas: what it's like to live there, the light, the
     neighbours, what the owners love about it.             */

  description: [
    // "First paragraph…",
    // "Second paragraph…",
  ],

  // Short bullet points: the things a buyer should remember.
  highlights: [
    // "Quiet cul-de-sac",
    // "Ten minutes' walk from the station",
  ],


  /* ── Room by room (optional) ──────────────────────────────
     Copy a line for each room. size can be "" if you don't
     have measurements.                                     */

  rooms: [
    // { name: "Living room", size: "5.2m × 3.9m", text: "Bay window, open fire…" },
  ],


  /* ── Photos ───────────────────────────────────────────────
     Put the files in the photos/ folder and list them here
     in the order you want them shown. The first 5 make up
     the big grid; the rest appear when someone taps
     "See all photos".

     alt = a short description for people using screen
     readers ("Kitchen with oak worktops"). caption is optional.

     Resize photos before adding them. Around 2000px on the
     longest side and under 1MB each keeps the site fast.   */

  photos: [
    // { src: "photos/01-front.jpg",   alt: "Front of the house", caption: "" },
  ],

  // Walkthrough video: upload to YouTube as "Unlisted" (or to Vimeo) and
  // paste the normal link here. It appears under the photos.
  video: "",

  // Floorplan: an image (shown on the page) and/or a PDF (download link).
  floorplan: {
    image: "",             // e.g. "photos/floorplan.png"
    pdf: "",               // e.g. "photos/floorplan.pdf"
  },


  /* ── Viewings & open days ─────────────────────────────────
     List any open-house dates. Remove them once they've passed. */

  openDays: [
    // "Saturday 17 October · 11am–2pm",
  ],


  /* ── Good to know ─────────────────────────────────────────
     The practical details buyers and their solicitors will
     ask for. Agents are expected to show tenure, council tax
     band, price and EPC rating on every listing. Empty ones
     are hidden.                                            */

  details: [
    { label: "Tenure",            value: "" },   // "Freehold" or "Leasehold (xxx years remaining)"
    { label: "Council tax band",  value: "" },   // e.g. "Band E"
    { label: "EPC rating",        value: "" },   // e.g. "C"
    { label: "Service / estate charge", value: "" },
    { label: "Heating",           value: "" },
    { label: "Broadband",         value: "" },
    { label: "Chain",             value: "" },   // e.g. "No onward chain"
  ],


  /* ── The area ────────────────────────────────────────────── */

  area: {
    navLabel: "The area",  // menu label, e.g. "Leigh-on-Sea"
    heading: "The area",   // e.g. "Living in Leigh-on-Sea"
    paragraphs: [
      // "A paragraph about the neighbourhood…",
    ],
    nearby: [
      // { name: "Leigh Broadway", distance: "5 min walk" },
    ],
    travel: [
      // { to: "London Fenchurch Street", how: "c2c train from Leigh-on-Sea", time: "about 50 min" },
    ],
  },


  /* ── Enquiries ────────────────────────────────────────────
     Leave formspreeId "" to use FamCo's own enquiry form
     (set in famco/agency.js). Only set it here if this house
     needs its enquiries to go somewhere different.         */

  enquiries: {
    formspreeId: "",
    fallbackEmail: "",
    note: "Viewings are by appointment. We’ll reply as soon as we can, usually the same day.",
  },
};
