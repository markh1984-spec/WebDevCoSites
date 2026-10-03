/* ==========================================================
   1 Magazine Mews — behaviour
   Renders everything from content.js, hides whatever isn't
   filled in yet, and runs the nav, gallery, map and form.
   No dependencies. Don't put words in here; they belong in
   content.js.
   ========================================================== */
(function () {
  "use strict";

  var H = window.HOUSE;
  if (!H || typeof H !== "object") {
    document.getElementById("typo-bar").hidden = false;
    return;
  }

  /* ── Helpers ─────────────────────────────────────────── */
  var $ = function (id) { return document.getElementById(id); };
  var has = function (v) { return typeof v === "string" ? v.trim() !== "" : !!v; };
  var list = function (v) { return Array.isArray(v) ? v : []; };
  var filled = function (rows, key) { return list(rows).filter(function (r) { return r && has(r[key]); }); };

  // Build an element. Text is always set as text, never as HTML,
  // so nothing typed into content.js can break the page markup.
  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function show(id, on) { var n = $(id); if (n) n.hidden = !on; }

  // Resolve once an image has loaded (true) or failed (false), so a
  // mistyped filename is dropped quietly instead of showing broken.
  function probe(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(true); };
      img.onerror = function () {
        console.warn("[content.js] Couldn't load photo: " + src + ". Check the filename and that it's in the photos folder.");
        resolve(false);
      };
      img.src = src;
    });
  }

  $("year").textContent = new Date().getFullYear();

  /* ── Header: sticky shadow + mobile nav ──────────────── */
  var header = document.querySelector(".site-header");
  var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var toggle = document.querySelector(".nav-toggle");
  var nav = $("site-nav");
  var closeNav = function () { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") closeNav(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });

  /* ── Hero ────────────────────────────────────────────── */
  var A = H.address || {};
  var addressBits = [A.area, A.town, A.postcode].filter(has);
  if (has(A.line1)) $("hero-title").textContent = A.line1;
  if (addressBits.length) $("hero-address").textContent = addressBits.join(" · ");

  $("hero-lede").textContent = has(H.headline)
    ? H.headline
    : "A home on the historic Shoebury Garrison, moments from the sea.";

  var status = has(H.status) ? H.status.trim() : "For sale";
  var forSale = /^for sale$/i.test(status);
  if (!forSale) {
    $("status-banner").textContent = status;
    show("status-banner", true);
    $("arch-ribbon").textContent = status;
    show("arch-ribbon", true);
    $("hero-eyebrow").textContent = status;
    document.title = status + " · " + document.title.replace(/\s+—\s+For sale$/, "");
  }

  if (H.price && has(H.price.amount)) {
    $("hero-price-label").textContent = H.price.label || "";
    $("hero-price-amount").textContent = H.price.amount;
    show("hero-price", true);
  }

  if (has(H.heroPhoto)) {
    probe(H.heroPhoto).then(function (ok) {
      if (!ok) return;
      var img = $("hero-photo");
      img.src = H.heroPhoto;
      img.alt = "1 Magazine Mews";
      img.hidden = false;
      $("hero-crest").hidden = true;
      $("hero-arch").classList.add("has-photo");
    });
  }

  // Share: native share sheet on phones, copy-link everywhere else.
  var shareBtn = $("share-btn");
  var shareLabel = $("share-label");
  shareBtn.addEventListener("click", function () {
    var data = { title: document.title, text: (A.line1 || "1 Magazine Mews") + " is for sale", url: location.href.split("#")[0] };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
      return;
    }
    var done = function (msg) {
      shareLabel.textContent = msg;
      setTimeout(function () { shareLabel.textContent = "Share"; }, 2200);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data.url).then(function () { done("Link copied"); }, function () { done("Copy the address bar"); });
    } else {
      done("Copy the address bar");
    }
  });

  /* ── Key facts ───────────────────────────────────────── */
  var facts = filled(H.keyFacts, "value");
  if (facts.length) {
    var factsList = $("facts-list");
    facts.forEach(function (f) {
      var row = el("div", "fact");
      row.appendChild(el("dt", null, f.label));
      row.appendChild(el("dd", null, f.value));
      factsList.appendChild(row);
    });
    show("facts", true);
  }

  /* ── About the home ──────────────────────────────────── */
  var description = list(H.description).filter(has);
  var highlights = list(H.highlights).filter(has);
  var rooms = filled(H.rooms, "name");

  description.forEach(function (p) { $("home-description").appendChild(el("p", null, p)); });
  highlights.forEach(function (h) { $("home-highlights").appendChild(el("li", null, h)); });
  show("home-aside", highlights.length > 0);

  rooms.forEach(function (r) {
    var card = el("article", "room");
    var head = el("div", "room-head");
    head.appendChild(el("h4", "room-name", r.name));
    if (has(r.size)) head.appendChild(el("span", "room-size", r.size));
    card.appendChild(head);
    if (has(r.text)) card.appendChild(el("p", null, r.text));
    $("rooms-list").appendChild(card);
  });
  show("rooms", rooms.length > 0);
  show("home", description.length || highlights.length || rooms.length);
  if (!description.length && !highlights.length && !rooms.length) {
    // Nothing to point "See the details" at yet. Send it to the area instead.
    $("hero-details-link").href = "#area";
    $("hero-details-link").textContent = "About the Garrison";
  }

  /* ── Photos + lightbox ───────────────────────────────── */
  var gallery = [];          // only photos that actually loaded
  var MOSAIC_COUNT = 5;

  var photos = filled(H.photos, "src");
  Promise.all(photos.map(function (p) { return probe(p.src); })).then(function (results) {
    gallery = photos.filter(function (_, i) { return results[i]; });
    if (!gallery.length) return;

    var mosaic = $("mosaic");
    mosaic.classList.add("mosaic-" + Math.min(gallery.length, MOSAIC_COUNT));
    gallery.slice(0, MOSAIC_COUNT).forEach(function (p, i) {
      var btn = el("button", "mosaic-item");
      btn.type = "button";
      btn.setAttribute("aria-label", "Open photo: " + (p.caption || p.alt || "photo " + (i + 1)));
      var img = el("img");
      img.src = p.src;
      img.alt = p.alt || "";
      img.loading = i === 0 ? "eager" : "lazy";
      btn.appendChild(img);
      if (has(p.caption)) btn.appendChild(el("span", "mosaic-caption", p.caption));
      btn.addEventListener("click", function () { openLightbox(i); });
      mosaic.appendChild(btn);
    });

    var allBtn = $("all-photos-btn");
    if (gallery.length > MOSAIC_COUNT) {
      allBtn.textContent = "See all " + gallery.length + " photos";
      allBtn.hidden = false;
    }
    allBtn.addEventListener("click", function () { openLightbox(0); });
    show("photos", true);
  });

  /* ── Walkthrough video ───────────────────────────────── */
  // Takes a normal YouTube or Vimeo link and turns it into an embed.
  function embedUrl(link) {
    var m = link.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/);
    if (m) return { src: "https://www.youtube-nocookie.com/embed/" + m[1] + "?autoplay=1&rel=0", from: "YouTube" };
    m = link.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
    if (m) return { src: "https://player.vimeo.com/video/" + m[1] + "?autoplay=1" + (m[2] ? "&h=" + m[2] : ""), from: "Vimeo" };
    console.warn("[content.js] video should be a YouTube or Vimeo link: " + link);
    return null;
  }
  var video = has(H.video) ? embedUrl(H.video.trim()) : null;
  if (video) {
    $("video-note").textContent = "Plays from " + video.from + " when you press play.";
    // Like the map: nothing loads from YouTube/Vimeo until asked.
    $("video-play").addEventListener("click", function () {
      var frame = el("iframe", "video-frame");
      frame.title = "Walkthrough video of 1 Magazine Mews";
      frame.src = video.src;
      frame.allow = "autoplay; fullscreen; picture-in-picture";
      $("video").replaceChildren(frame);
    });
    show("video", true);
    show("photos", true);
  }

  var box = $("lightbox");
  var boxImg = $("lightbox-img");
  var boxCap = $("lightbox-caption");
  var current = 0;
  var lastFocused = null;

  function showPhoto(i) {
    current = (i + gallery.length) % gallery.length;
    var p = gallery[current];
    boxImg.src = p.src;
    boxImg.alt = p.alt || "";
    boxCap.textContent = (p.caption ? p.caption + " · " : "") + (current + 1) + " of " + gallery.length;
  }
  function openLightbox(i) {
    lastFocused = document.activeElement;
    showPhoto(i);
    box.hidden = false;
    document.body.classList.add("no-scroll");
    box.querySelector(".lightbox-close").focus();
  }
  function closeLightbox() {
    box.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastFocused) lastFocused.focus();
  }
  box.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  box.querySelector(".lightbox-prev").addEventListener("click", function () { showPhoto(current - 1); });
  box.querySelector(".lightbox-next").addEventListener("click", function () { showPhoto(current + 1); });
  box.addEventListener("click", function (e) { if (e.target === box) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPhoto(current - 1);
    if (e.key === "ArrowRight") showPhoto(current + 1);
    if (e.key === "Tab") {
      // keep focus inside the lightbox while it's open
      var focusable = box.querySelectorAll("button");
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // swipe on phones
  var touchX = null;
  box.addEventListener("touchstart", function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) showPhoto(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  /* ── Floorplan ───────────────────────────────────────── */
  var plan = H.floorplan || {};
  var planJobs = [];
  if (has(plan.image)) {
    planJobs.push(probe(plan.image).then(function (ok) {
      if (!ok) return false;
      $("floorplan-img").src = plan.image;
      show("floorplan-figure", true);
      return true;
    }));
  }
  if (has(plan.pdf)) {
    $("floorplan-pdf").href = plan.pdf;
    show("floorplan-download", true);
    planJobs.push(Promise.resolve(true));
  }
  Promise.all(planJobs).then(function (r) { show("floorplan", r.some(Boolean)); });

  /* ── The area ────────────────────────────────────────── */
  var area = H.area || {};
  if (has(area.heading)) $("area-heading").textContent = area.heading;
  list(area.paragraphs).filter(has).forEach(function (p) {
    $("area-paragraphs").appendChild(el("p", null, p));
  });

  var nearby = filled(area.nearby, "name");
  nearby.forEach(function (n) {
    var li = el("li");
    li.appendChild(el("span", "nearby-name", n.name));
    if (has(n.distance)) li.appendChild(el("span", "nearby-distance", n.distance));
    $("nearby-list").appendChild(li);
  });
  show("nearby-block", nearby.length > 0);

  var travel = filled(area.travel, "to").filter(function (t) { return has(t.time); });
  travel.forEach(function (t) {
    var li = el("li");
    var where = el("span", "travel-to", t.to);
    if (has(t.how)) where.appendChild(el("small", null, t.how));
    li.appendChild(where);
    li.appendChild(el("span", "travel-time", t.time));
    $("travel-list").appendChild(li);
  });
  show("travel-block", travel.length > 0);

  // Map loads only on request, so Google isn't contacted (and sets no
  // cookies) unless the visitor asks for it.
  var mapQuery = encodeURIComponent([A.line1, A.town, A.postcode].filter(has).join(", "));
  $("map-load").addEventListener("click", function () {
    var frame = el("iframe", "map-frame");
    frame.title = "Map showing Magazine Mews, Shoeburyness";
    frame.src = "https://maps.google.com/maps?q=" + mapQuery + "&z=16&output=embed";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    $("map").replaceChildren(frame);
    $("map").classList.add("is-loaded");
  });

  /* ── Good to know ────────────────────────────────────── */
  var details = filled(H.details, "value");
  details.forEach(function (d) {
    var row = el("div");
    row.appendChild(el("dt", null, d.label));
    row.appendChild(el("dd", null, d.value));
    $("details-list").appendChild(row);
  });
  show("details", details.length > 0);

  /* ── Viewings ────────────────────────────────────────── */
  var E = H.enquiries || {};
  $("enquire-note").textContent = has(E.note) ? E.note : "Viewings are by appointment. Send a message and we'll get back to you.";

  var openDays = list(H.openDays).filter(has);
  openDays.forEach(function (d) { $("open-days-list").appendChild(el("li", null, d)); });
  show("open-days", openDays.length > 0);

  /* ── Enquiry form ────────────────────────────────────── */
  var form = $("enquiry-form");
  var statusEl = $("form-status");
  var submit = $("form-submit");
  var formspree = has(E.formspreeId) ? E.formspreeId.trim().replace(/^.*\/f\//, "") : "";
  var fallback = has(E.fallbackEmail) ? E.fallbackEmail.trim() : "";

  if (!formspree && !fallback) {
    // No way to deliver messages yet. Say so rather than eat them.
    Array.prototype.forEach.call(form.elements, function (f) { f.disabled = true; });
    form.classList.add("is-disabled");
    statusEl.textContent = "The enquiry form opens very soon. Please check back shortly.";
  }

  function setStatus(msg, kind) {
    statusEl.textContent = msg;
    statusEl.className = "form-status" + (kind ? " is-" + kind : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please add your name and a valid email address so we can reply.", "error");
      (!name ? form.elements.name : form.elements.email).focus();
      return;
    }

    if (formspree) {
      submit.disabled = true;
      setStatus("Sending…");
      fetch("https://formspree.io/f/" + encodeURIComponent(formspree), {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      }).then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        form.reset();
        setStatus("Thank you, your message has been sent. We'll be in touch soon.", "ok");
      }).catch(function () {
        setStatus("Sorry, that didn't send. Please try again in a moment.", "error");
      }).then(function () { submit.disabled = false; });
      return;
    }

    // Fallback: hand the message to the visitor's own email app.
    var body = [
      "Name: " + name,
      "Email: " + email,
      "Phone: " + form.elements.phone.value.trim(),
      "Position: " + form.elements.position.value,
      "Heard about it via: " + form.elements.heard_via.value,
      "",
      form.elements.message.value.trim(),
    ].join("\n");
    location.href = "mailto:" + fallback + "?subject=" + encodeURIComponent("Enquiry: " + (A.line1 || "1 Magazine Mews")) + "&body=" + encodeURIComponent(body);
    setStatus("Your email app should open with the message ready to send.", "ok");
  });

  /* ── Structured data for search engines ─────────────── */
  // Fills in the JSON-LD block in index.html with whatever content.js
  // has so far. Google reads the page after this runs.
  (function () {
    var tag = $("listing-data");
    var data;
    try { data = JSON.parse(tag.textContent); } catch (e) { return; }
    var home = data.about || (data.about = {});
    var fact = function (label) {
      var row = facts.filter(function (f) { return f.label.toLowerCase() === label; })[0];
      var n = row && parseInt(String(row.value).replace(/[^\d]/g, ""), 10);
      return n > 0 ? n : null;
    };
    if (fact("bedrooms")) home.numberOfBedrooms = fact("bedrooms");
    if (fact("bathrooms")) home.numberOfBathroomsTotal = fact("bathrooms");
    var lead = [H.headline].concat(description).filter(has)[0];
    if (lead) data.description = lead;
    var price = H.price && parseInt(String(H.price.amount).replace(/[^\d]/g, ""), 10);
    if (price > 0) data.offers = { "@type": "Offer", price: price, priceCurrency: "GBP" };
    var images = photos.map(function (p) { return new URL(p.src, location.href).href; });
    if (images.length) data.image = images.slice(0, 10);
    tag.textContent = JSON.stringify(data, null, 2);
  })();

  /* ── Hide nav links for sections that aren't showing ─── */
  function syncNav() {
    document.querySelectorAll("[data-section]").forEach(function (a) {
      var target = $(a.getAttribute("data-section"));
      a.hidden = !target || target.hidden;
    });
  }
  syncNav();
  // photos and floorplan appear once their images have loaded, so re-sync then
  var sectionObserver = new MutationObserver(syncNav);
  ["photos", "floorplan"].forEach(function (id) { sectionObserver.observe($(id), { attributes: true, attributeFilter: ["hidden"] }); });

  /* ── Gentle reveal on scroll ─────────────────────────── */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".section-head, .home-copy, .home-aside, .room, .area-copy, .area-block, .details, .enquire-copy, .enquire-form, .floorplan");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-in"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (t) { t.classList.add("reveal"); io.observe(t); });
  }
})();
