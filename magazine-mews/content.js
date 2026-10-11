/* ==========================================================
   Magazine Mews — CONTENT FILE
   ----------------------------------------------------------
   This is the only file you need to edit to change what the
   website says. You never need to touch index.html, site.js
   or style.css: they're generated from famco/template by
   famco/build.mjs, which FamCo uses for every house.

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

   Sections marked DRAFT were written from public sources
   (Southend Council's conservation-area page, Historic
   England listings, c2c timetable). Please check them, and
   reword freely.
   ========================================================== */

window.HOUSE = {

  /* ── The basics ─────────────────────────────────────────── */

  address: {
    line1: "Magazine Mews",
    area: "",
    town: "Shoeburyness",
    postcode: "",
  },

  // The live web address. Used for Google, the sitemap and link previews.
  site: {
    url: "https://www.magazinemews.co.uk/",   // live from 11 Oct 2026; 1magazinemews.vercel.app still works
    googleVerification: "zmd6ReFNTt3OxQNvTfdMj5IiZa0VN6V8VgRn3NjYvOA", // the content="…" part of Google Search Console's HTML tag
  },

  // How the house appears in Google results and link previews.
  seo: {
    title: "Magazine Mews, Shoeburyness — For sale",
    summary: "A home in the historic Shoebury Garrison conservation area in Shoeburyness, Essex, next to Gunners Park and a short walk from East Beach.",
  },

  // Replaces the standard "A private sale…" line by the enquiry form.
  privateSaleNote: "There's no estate agent in the middle, so you'll be dealing directly with the family. The legal side is handled by professionals.",

  // "For sale", "Under offer" or "Sold subject to contract".
  // Anything other than "For sale" shows a banner across the top.
  status: "For sale",

  // Short line under the address at the top of the page.
  // e.g. "A characterful two-bedroom home on the historic Garrison"
  headline: "",
  tagline: "A home on the historic Shoebury Garrison, moments from the sea.",  // shown while headline is empty

  // Leave amount as "" to hide the price entirely.
  // label is usually "Guide price", "Offers over" or "Offers in the region of".
  price: {
    label: "Offers in the region of",
    amount: "£675,000",
    note: "Cash buyers from £665,000",   // Mark, 11 Oct 2026
  },

  // The big photo at the top. Leave "" and the top of the page
  // shows the Garrison crest instead. Landscape or portrait both work.
  heroPhoto: "photos/hero-front.jpg",
  // The frame is taller than a landscape photo, so the sides get cropped.
  // "92% 50%" keeps the front door and the lamp post in view.
  heroFocus: "92% 50%",

  // The round crest shown until there's a hero photo. The number and
  // street name come from the address.
  crest: {
    numeral: "M",   // the badge in the header and the browser tab (was the house number)
    ring: "SHOEBURY GARRISON · EST. 1849 · SHOEBURYNESS · ESSEX ·",
  },

  // Colours and fonts: {} is the standard FamCo look (Garrison green,
  // brass and brick). See famco/template/content.example.js for options.
  // Plum and rose, Fraunces and DM Sans, pill-shaped buttons: the look Mum
  // liked on the September prototype — Mark, 10 October 2026.
  theme: {
    look: "soft",           // light header and hero, pill buttons, rounded photos
    brickEdges: false,
    dark: "#4A1F3D",        // plum: headings, the area section
    darker: "#2E1428",      // footer
    mid: "#4A1F3D",
    midLight: "#6B2350",
    accent: "#A83D6C",      // rose: the main buttons, trim
    accentLight: "#F1DCE6", // pale pink: small text on the plum section
    warm: "#8E2F5A",        // berry: links, small headings, drop caps
    warmDark: "#5E1F48",
    paper: "#FBF4F6",       // blush white: the page
    cream: "#F3DEE7",       // blush pink: alternate sections
    ink: "#2E1428",
    muted: "#5A3A50",
    tint: "#F3DEE7",
    mortar: "#EBD5DE",
    line: "#EBD5DE",
    displayFont: "Fraunces",
    bodyFont: "DM Sans",
    fontsUrl: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=DM+Sans:wght@400;500;600;700&display=swap",
  },


  /* ── Key facts (the strip near the top) ──────────────────
     Fill in the value. Empty ones are hidden. Feel free to
     delete rows or add more in the same format.            */

  keyFacts: [
    // From Hendricks' listing of the house (checked 11 Oct 2026).
    { label: "Property type", value: "Semi-detached bungalow" },
    { label: "Bedrooms",      value: "2" },
    { label: "Bathrooms",     value: "2" },
    { label: "Reception rooms", value: "" },
    { label: "Parking",       value: "Allocated off-street parking" },
    { label: "Garden",        value: "Gated garden, two outside spaces" },
  ],


  /* ── About the home ───────────────────────────────────────
     A few paragraphs, each in its own "quotes", separated by
     commas. Write it how you'd describe it to a friend:
     what it's like to live there, the light, the neighbours,
     what Mom loves about it.                              */

  // Facts from Hendricks' listing (11 Oct 2026); words our own.
  description: [
    "A beautifully renovated two-bedroom semi-detached bungalow in the heart of the historic Shoebury Garrison, with Gunners Park five minutes' walk away and East Beach about a quarter of an hour. Finished to a high standard throughout, with underfloor heating, it's ready to move straight into, and it's offered with no onward chain.",
    "An open-plan living room and kitchen opens through folding doors onto the decking. The main bedroom has an en suite and a dressing area, and there's a second bedroom and a family bathroom. The plot is unusually generous for a home of this kind: two separate outside spaces, a gated garden, a detached garden studio that makes an ideal home office, a laundry room with its own shower, and allocated off-street parking.",
  ],

  // Short bullet points: the things a buyer should remember.
  highlights: [
    "No onward chain",
    "Renovated throughout, with underfloor heating",
    "En suite and dressing area in the main bedroom",
    "Detached garden studio, ideal as a home office",
    "Gated garden, two outside spaces and allocated parking",
    "In the Shoebury Garrison conservation area, five minutes from Gunners Park",
  ],


  /* ── Room by room (optional) ──────────────────────────────
     Copy a line for each room. size can be "" if you don't
     have measurements.                                     */

  rooms: [
    // { name: "Living room", size: "5.2m × 3.9m", text: "Bay window, open fire…" },
    // { name: "Kitchen",     size: "",            text: "Fitted in 2021…" },
  ],


  /* ── Photos ───────────────────────────────────────────────
     Put the files in the photos/ folder and list them here
     in the order you want them shown. The first 5 make up
     the big grid; the rest appear when someone taps
     "See all photos".

     alt = a short description for people using screen
     readers ("Kitchen with oak worktops"). caption is optional.

     Resize photos before uploading. Around 2000px on the
     longest side and under 1MB each keeps the site fast.   */

  // Only the front photo (heroPhoto) is public. The rest are kept off the
  // public site and shown to buyers once they've confirmed their email
  // (Mum's wish, 11 Oct 2026). See insideGate below.
  photos: [],

  insideGate: {
    title: "See inside",
    text: "The photos of the inside are shared once you've left your details and confirmed your email address.",
    button: "",   // e.g. "Leave your details to see inside"
    // The form posts here (api/see-inside.js), which emails the buyer a
    // 30-day link to /inside. Empty = no form, just the text above.
    endpoint: "/api/see-inside",
    phoneRequired: true,
    note: "We'll only use your details about this house. The family sees your name and contact details when you open the photos.",
  },

  // Walkthrough video: upload to YouTube as "Unlisted" (or to Vimeo) and
  // paste the normal link here. It appears under the photos.
  video: "",               // e.g. "https://youtu.be/abc123XYZ00"

  // Floorplan: an image (shown on the page) and/or a PDF (download link).
  floorplan: {
    image: "",             // e.g. "photos/floorplan.png"
    pdf: "",               // e.g. "photos/floorplan.pdf"
  },


  /* ── Viewings & open days ─────────────────────────────────
     List any open-house dates. Remove them once they've passed.
     Leave the list empty and the site just says
     "viewings by appointment".                             */

  openDays: [
    // "Saturday 17 October · 11am–2pm",
  ],


  /* ── Good to know ─────────────────────────────────────────
     The practical details buyers and their solicitors will
     ask for. It's worth filling these in, because it saves
     a lot of back-and-forth. Empty ones are hidden.        */

  details: [
    { label: "Tenure",            value: "Freehold" },   // "Freehold" or "Leasehold (xxx years remaining)"
    { label: "Council tax band",  value: "Band C" },   // Southend-on-Sea City Council, e.g. "Band D"
    { label: "EPC rating",        value: "C" },   // GOV.UK EPC register, valid until 4 Sep 2033   // e.g. "C". Look it up at find-energy-certificate.service.gov.uk
    { label: "Estate / service charge", value: "" }, // any Garrison estate management charge, e.g. "£xxx per year"
    { label: "Heating",           value: "Underfloor heating throughout" },   // e.g. "Gas central heating"
    { label: "Broadband",         value: "" },   // e.g. "Full fibre available"
    { label: "Conservation area", value: "Yes, Shoebury Garrison Conservation Area" },
    { label: "Chain",             value: "No onward chain" },   // e.g. "No onward chain"
  ],


  /* ── The area (DRAFT — please check) ──────────────────────── */

  area: {
    navLabel: "The Garrison",
    heading: "Living on the Garrison",
    paragraphs: [
      "Shoebury Garrison dates back to 1849, when the Board of Ordnance bought the land. During the Crimean War it became home to the Royal Artillery’s School of Gunnery, and for the next century it was where Britain trained its gunners and tested its guns.",
      "Its Victorian buildings, including the unique Horseshoe Barracks and two Grade II listed powder magazines from the 1850s on Magazine Road, now sit within a conservation area. After the army left, the Garrison was gradually turned into homes from 2004 onwards. Today it is a village of old and new buildings set around green space, just yards from East Beach.",
    ],
    // Things nearby. Fill in or delete "distance". Empty ones just show the name.
    nearby: [
      // Walking times: Google Maps walking directions from Magazine Mews, 11 Oct 2026.
      { name: "East Beach",               distance: "16 min walk" },
      { name: "Gunners Park nature reserve (Essex Wildlife Trust)", distance: "5 min walk" },
      { name: "Garrison cricket green & pavilion", distance: "1 min walk" },
      { name: "Shoeburyness station (c2c)", distance: "14 min walk" },
      // { name: "Local primary school",   distance: "" },
      // { name: "Shops on the High Street", distance: "" },
    ],
    // Photos of the places above, from Wikimedia Commons (CC BY-SA 2.0,
    // credited on the page as the licence asks). Swap for Rory's own any time.
    gallery: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/East_Beach%2C_Shoeburyness_-_geograph.org.uk_-_7255870.jpg/960px-East_Beach%2C_Shoeburyness_-_geograph.org.uk_-_7255870.jpg",
        caption: "East Beach", walk: "16 min walk", alt: "East Beach, Shoeburyness, on a sunny day",
        credit: "Stephen McKay", creditUrl: "https://commons.wikimedia.org/wiki/File:East_Beach,_Shoeburyness_-_geograph.org.uk_-_7255870.jpg", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Gunners%27_Park_-_geograph.org.uk_-_7259903.jpg/960px-Gunners%27_Park_-_geograph.org.uk_-_7259903.jpg",
        caption: "Gunners Park nature reserve", walk: "5 min walk", alt: "Benches looking over the water at Gunners Park",
        credit: "Stephen McKay", creditUrl: "https://commons.wikimedia.org/wiki/File:Gunners%27_Park_-_geograph.org.uk_-_7259903.jpg", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Shoebury_Garrison_-_Cricket_Pavilion_%28geograph_5857487%29.jpg/960px-Shoebury_Garrison_-_Cricket_Pavilion_%28geograph_5857487%29.jpg",
        caption: "Garrison cricket pavilion", walk: "1 min walk", alt: "The Garrison cricket pavilion and green",
        credit: "Julian Osley", creditUrl: "https://commons.wikimedia.org/wiki/File:Shoebury_Garrison_-_Cricket_Pavilion_(geograph_5857487).jpg", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/3/38/Shoeburyness_Railway_Station_-_geograph.org.uk_-_7271255.jpg",
        caption: "Shoeburyness station", walk: "14 min walk", alt: "Shoeburyness railway station building",
        credit: "JThomas", creditUrl: "https://commons.wikimedia.org/wiki/File:Shoeburyness_Railway_Station_-_geograph.org.uk_-_7271255.jpg", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/" },
    ],
    // How far to the places people commute to.
    travel: [
      { to: "London Fenchurch Street", how: "c2c train from Shoeburyness", time: "about 1 hr 5 min" },
      // { to: "Southend seafront",     how: "by car",                     time: "" },
      // { to: "London Southend Airport", how: "by car",                   time: "" },
    ],
  },


  /* ── Enquiries ────────────────────────────────────────────
     formspreeId: sign up free at formspree.io, create a form,
     and paste the ID here. It's the bit after /f/ in the
     form's URL, e.g. "xyzabcde". Enquiries then arrive by
     email and nobody's address or number is on the website.

     fallbackEmail: only used if formspreeId is empty. The
     form then opens the visitor's email app instead. Leave
     both empty and the form says enquiries open soon.      */

  enquiries: {
    // Our own function (api/enquiry.js): sends the enquiry to
    // viewings@magazinemews.co.uk. When set, it wins over formspreeId.
    endpoint: "/api/enquiry",
    formspreeId: "",
    fallbackEmail: "",
    note: "Viewings are by appointment. We’ll reply as soon as we can, usually the same day.",
  },
};
