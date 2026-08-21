/* ==========================================================
   Site content
   ----------------------------------------------------------
   THIS IS THE FILE YOU EDIT PER CLIENT. Nothing below needs
   HTML or CSS changes — just replace the example text, photos
   and rows. site.js reads these arrays and builds the page.
   ========================================================== */

/* About section — short reassurance bullets under the story.
   3-5 is plenty. Delete/add lines freely. */
window.REASSURANCES = [
  "Open to everyone in the community",
  "Fully insured and DBS-checked where relevant",
  "Easy to find, with parking nearby",
];

/* "What we offer" cards. `mark` is one or two characters shown
   in the little badge — initials, a number, whatever reads well. */
window.OFFERINGS = [
  { mark: "1", title: "[Replace: offering one]", body: "[Replace: a sentence or two describing it.]" },
  { mark: "2", title: "[Replace: offering two]", body: "[Replace: a sentence or two describing it.]" },
  { mark: "3", title: "[Replace: offering three]", body: "[Replace: a sentence or two describing it.]" },
];

/* Gallery photos. `src` is a filename inside assets/img/.
   A filename that doesn't exist yet is skipped quietly, so it's
   safe to write these before the photos are ready. */
window.GALLERY = [
  { src: "gallery-01.jpg", alt: "[Replace: describe the photo]", caption: "[Replace: short caption]" },
  { src: "gallery-02.jpg", alt: "[Replace: describe the photo]", caption: "[Replace: short caption]" },
  { src: "gallery-03.jpg", alt: "[Replace: describe the photo]", caption: "[Replace: short caption]" },
  { src: "gallery-04.jpg", alt: "[Replace: describe the photo]", caption: "[Replace: short caption]" },
];

/* The info table — opening times, hire rates, term dates,
   whatever fits. Just label/value pairs, any number of rows. */
window.INFO_ROWS = [
  { label: "Monday – Friday", value: "9:00am – 5:00pm" },
  { label: "Saturday", value: "10:00am – 2:00pm" },
  { label: "Sunday", value: "Closed" },
  { label: "Bank holidays", value: "Closed — see notice board" },
];

/* Testimonials. Keep these real — see the note in README.md
   about not inventing quotes for a live client site. */
window.QUOTES = [
  { text: "[Replace with a real quote from someone who'd be happy to be named.]", name: "— [Name]" },
  { text: "[Replace with a real quote from someone who'd be happy to be named.]", name: "— [Name]" },
];
