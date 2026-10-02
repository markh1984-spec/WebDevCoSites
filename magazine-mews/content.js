/* ==========================================================
   1 Magazine Mews — CONTENT FILE
   ----------------------------------------------------------
   This is the only file you need to edit to change what the
   website says. You never need to touch index.html, site.js
   or style.css.

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

   Sections marked DRAFT were written from public sources
   (Southend Council's conservation-area page, Historic
   England listings, c2c timetable). Please check them, and
   reword freely.
   ========================================================== */

window.HOUSE = {

  /* ── The basics ─────────────────────────────────────────── */

  address: {
    line1: "1 Magazine Mews",
    area: "Shoebury Garrison",
    town: "Shoeburyness, Essex",
    postcode: "SS3 9QB",
  },

  // "For sale", "Under offer" or "Sold subject to contract".
  // Anything other than "For sale" shows a banner across the top.
  status: "For sale",

  // Short line under the address at the top of the page.
  // e.g. "A characterful two-bedroom home on the historic Garrison"
  headline: "",

  // Leave amount as "" to hide the price entirely.
  // label is usually "Guide price", "Offers over" or "Offers in the region of".
  price: {
    label: "Guide price",
    amount: "",            // e.g. "£550,000"
  },

  // The big photo at the top. Leave "" and the top of the page
  // shows the Garrison crest instead. Landscape or portrait both work.
  heroPhoto: "",           // e.g. "photos/front.jpg"


  /* ── Key facts (the strip near the top) ──────────────────
     Fill in the value. Empty ones are hidden. Feel free to
     delete rows or add more in the same format.            */

  keyFacts: [
    { label: "Property type", value: "" },   // e.g. "Semi-detached house"
    { label: "Bedrooms",      value: "" },   // e.g. "2"
    { label: "Bathrooms",     value: "" },
    { label: "Reception rooms", value: "" },
    { label: "Parking",       value: "" },   // e.g. "Garage + driveway"
    { label: "Garden",        value: "" },   // e.g. "Walled rear garden"
  ],


  /* ── About the home ───────────────────────────────────────
     A few paragraphs, each in its own "quotes", separated by
     commas. Write it how you'd describe it to a friend:
     what it's like to live there, the light, the neighbours,
     what Mum loves about it.                              */

  description: [
    // "First paragraph…",
    // "Second paragraph…",
  ],

  // Short bullet points: the things a buyer should remember.
  highlights: [
    // "Quiet cul-de-sac in the Garrison conservation area",
    // "Moments from East Beach",
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

  photos: [
    // { src: "photos/01-front.jpg",   alt: "Front of the house", caption: "" },
    // { src: "photos/02-living.jpg",  alt: "Living room",        caption: "Living room" },
  ],

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
    { label: "Tenure",            value: "" },   // "Freehold" or "Leasehold (xxx years remaining)"
    { label: "Council tax band",  value: "" },   // Southend-on-Sea City Council, e.g. "Band D"
    { label: "EPC rating",        value: "" },   // e.g. "C". Look it up at find-energy-certificate.service.gov.uk
    { label: "Estate / service charge", value: "" }, // any Garrison estate management charge, e.g. "£xxx per year"
    { label: "Heating",           value: "" },   // e.g. "Gas central heating"
    { label: "Broadband",         value: "" },   // e.g. "Full fibre available"
    { label: "Conservation area", value: "Yes, Shoebury Garrison Conservation Area" },
    { label: "Chain",             value: "" },   // e.g. "No onward chain"
  ],


  /* ── The area (DRAFT — please check) ──────────────────────── */

  area: {
    heading: "Living on the Garrison",
    paragraphs: [
      "Shoebury Garrison dates back to 1849, when the Board of Ordnance bought the land. During the Crimean War it became home to the Royal Artillery’s School of Gunnery, and for the next century it was where Britain trained its gunners and tested its guns.",
      "Its Victorian buildings, including the unique Horseshoe Barracks and two Grade II listed powder magazines from the 1850s on Magazine Road, now sit within a conservation area. After the army left, the Garrison was gradually turned into homes from 2004 onwards. Today it is a village of old and new buildings set around green space, just yards from East Beach.",
    ],
    // Things nearby. Fill in or delete "distance". Empty ones just show the name.
    nearby: [
      { name: "East Beach",               distance: "" },  // e.g. "5 min walk"
      { name: "Gunners Park nature reserve (Essex Wildlife Trust)", distance: "" },
      { name: "Garrison cricket green & pavilion", distance: "" },
      { name: "Shoeburyness station (c2c)", distance: "" },
      // { name: "Local primary school",   distance: "" },
      // { name: "Shops on the High Street", distance: "" },
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
    formspreeId: "",
    fallbackEmail: "",
    note: "Viewings are by appointment. We’ll reply as soon as we can, usually the same day.",
  },
};
