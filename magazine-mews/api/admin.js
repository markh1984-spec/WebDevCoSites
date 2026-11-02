// The contacts page's data (magazinemews.co.uk/admin), 2 Nov 2026.
// Every request needs the password (header x-admin-password), which is the
// ADMIN_PASSWORD environment variable in Vercel.
//   GET  /api/admin                 { ok, contacts, statuses }
//   GET  /api/admin?format=csv      a spreadsheet of the same
//   POST /api/admin  { action: "status", email, status, notes }
//   POST /api/admin  { action: "import", events: [...] }
//   POST /api/admin  { action: "remove", email }   deletes that person for good
// Everything comes from the private store's leads/ folder: one small file
// per sign-up, photo open, enquiry or status change. Contacts are those
// events grouped by email address, newest activity first.
const { adminPasswordOk, blobSdk, saveLead, clean, isEmail, readBody, json } = require("./_inside");

const STATUSES = ["New", "Contacted", "Viewing booked", "Viewed", "Offer made", "Not interested", "Test / ignore"];
const TYPES = ["signup", "opened", "enquiry"];

async function readAll(req, diag) {
  const { list, get } = await blobSdk(req);
  diag = diag || {};
  diag.errors = [];
  // The store's listing can very occasionally come back a file short just
  // after a write, so list twice and use everything either pass found.
  const seen = new Set();
  const urls = new Map();
  for (let pass = 0; pass < 2; pass++) {
    let cursor;
    do {
      const page = await list({ prefix: "leads/", limit: 1000, cursor });
      for (const b of page.blobs) if (b.pathname.endsWith(".json")) { seen.add(b.pathname); urls.set(b.pathname, b.url); }
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
  }
  const names = [...seen];
  const events = [];
  for (let i = 0; i < names.length; i += 16) {
    const batch = await Promise.all(names.slice(i, i + 16).map(async (n) => {
      try {
        let r = await get(n, { access: "private", useCache: false });
        if (!r || r.statusCode !== 200) r = await get(n, { access: "private", useCache: false }); // one retry
        if (!r || r.statusCode !== 200) { diag.errors.push(n + ": " + (r ? r.statusCode : "not found")); return null; }
        const ev = JSON.parse(await new Response(r.stream).text());
        Object.defineProperty(ev, "_file", { value: urls.get(n) || n, enumerable: false });
        return ev;
      } catch (e) { console.error("admin read failed:", n, e.message); diag.errors.push(n + ": " + e.message); return null; }
    }));
    for (const e of batch) if (e) events.push(e);
  }
  diag.listed = names.length;
  diag.read = events.length;
  diag.errors = diag.errors.slice(0, 5);
  return events;
}

function contactsFrom(events) {
  events.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
  const by = new Map();
  for (const e of events) {
    const key = String(e.email || "").trim().toLowerCase();
    if (!key) continue;
    let c = by.get(key);
    if (!c) {
      c = { email: key, name: "", phone: "", position: "", heardVia: "", firstSeen: e.at, lastSeen: e.at,
        signedUp: "", openedFirst: "", openedLast: "", opens: 0, enquiries: [], status: "New", notes: "", statusAt: "" };
      by.set(key, c);
    }
    if (e.type === "status") {
      if (STATUSES.includes(e.status)) c.status = e.status;
      if (typeof e.notes === "string") c.notes = e.notes;
      c.statusAt = e.at;
      continue;
    }
    c.lastSeen = e.at;
    if (e.name) c.name = e.name;
    if (e.phone) c.phone = e.phone;
    if (e.position) c.position = e.position;
    if (e.heard_via) c.heardVia = e.heard_via;
    if (e.type === "signup" && !c.signedUp) c.signedUp = e.at;
    if (e.type === "opened") { c.opens += 1; if (!c.openedFirst) c.openedFirst = e.at; c.openedLast = e.at; }
    if (e.type === "enquiry") c.enquiries.push({ at: e.at, message: e.message || "" });
  }
  return [...by.values()].sort((a, b) => (a.lastSeen < b.lastSeen ? 1 : a.lastSeen > b.lastSeen ? -1 : 0));
}

function csv(contacts) {
  const day = (s) => (s ? new Date(s).toLocaleString("en-GB", { timeZone: "Europe/London", dateStyle: "medium", timeStyle: "short" }) : "");
  const cell = (v) => {
    let s = String(v == null ? "" : v);
    if (/^[=+\-@]/.test(s)) s = "'" + s; // stop spreadsheets treating it as a formula
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  };
  const rows = [["Name", "Email", "Phone", "Position", "Heard about it via", "Status", "Notes", "Asked for the photos", "Opened the photos", "Viewing requests (Arrange a viewing form)", "Last activity"]];
  for (const c of contacts) {
    rows.push([c.name, c.email, c.phone, c.position, c.heardVia, c.status, c.notes, day(c.signedUp), day(c.openedFirst),
      c.enquiries.map((q) => day(q.at) + ": " + q.message).join("\n"), day(c.lastSeen)]);
  }
  return "﻿" + rows.map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}

// "2026-11-02 16:56:43" or ISO -> ISO, or "" if it isn't a date.
function isoTime(s) {
  const t = String(s || "").trim().replace(" ", "T");
  const d = new Date(/Z|[+-]\d\d:?\d\d$/.test(t) ? t : t + "Z");
  return isNaN(d) ? "" : d.toISOString();
}

module.exports = async (req, res) => {
  res.setHeader("X-Robots-Tag", "noindex");
  const url = new URL(req.url, "http://x");
  // The password travels in a header, never in the address.
  const pwOk = adminPasswordOk(String(req.headers["x-admin-password"] || ""));
  if (pwOk === null) return json(res, 503, { ok: false, error: "The contacts page isn't switched on yet." });
  if (!pwOk) {
    await new Promise((r) => setTimeout(r, 1000)); // slow down guessing
    return json(res, 401, { ok: false, needPassword: true, error: "That password isn't right." });
  }

  try {
    if (req.method === "GET") {
      const diag = {};
      const contacts = contactsFrom(await readAll(req, diag));
      if (url.searchParams.get("format") === "csv") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="magazine-mews-contacts.csv"');
        res.setHeader("Cache-Control", "no-store");
        return res.end(csv(contacts));
      }
      return json(res, 200, { ok: true, contacts, statuses: STATUSES, diag });
    }

    if (req.method === "POST") {
      const b = await readBody(req);
      if (b.action === "status") {
        const email = clean(b.email, 200).toLowerCase();
        if (!isEmail(email) || !STATUSES.includes(b.status)) return json(res, 400, { ok: false, error: "That didn't save. Please try again." });
        const ok = await saveLead(req, { type: "status", email, status: b.status, notes: String(b.notes || "").slice(0, 4000) });
        return ok ? json(res, 200, { ok: true }) : json(res, 502, { ok: false, error: "That didn't save. Please try again." });
      }
      if (b.action === "remove") {
        // Deletes everything kept about one person, for good.
        const email = clean(b.email, 200).toLowerCase();
        if (!isEmail(email)) return json(res, 400, { ok: false, error: "That didn't remove. Please try again." });
        const files = (await readAll(req)).filter((e) => String(e.email || "").trim().toLowerCase() === email).map((e) => e._file);
        if (files.length) { const { del } = await blobSdk(req); await del(files); }
        return json(res, 200, { ok: true, removed: files.length });
      }
            if (b.action === "import" && Array.isArray(b.events) && b.events.length <= 500) {
        let saved = 0;
        for (const e of b.events) {
          const at = isoTime(e.at), email = clean(e.email, 200).toLowerCase();
          if (!TYPES.includes(e.type) || !at || !isEmail(email)) continue;
          const ev = { type: e.type, at, name: clean(e.name, 80), email, phone: clean(e.phone, 40), position: clean(e.position, 80), imported: true };
          if (e.type === "enquiry") { ev.heard_via = clean(e.heard_via, 80); ev.message = String(e.message || "").slice(0, 4000); }
          if (await saveLead(req, ev)) saved += 1;
        }
        return json(res, 200, { ok: true, saved });
      }
      return json(res, 400, { ok: false, error: "Unknown request." });
    }
    return json(res, 405, { ok: false, error: "GET or POST only" });
  } catch (e) {
    console.error("admin failed:", e.message);
    return json(res, 502, { ok: false, error: "Couldn't load the contacts just now. Please try again in a minute." });
  }
};
