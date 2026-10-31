// GET /api/inside?t=<token>[&first=1]   or   GET /api/inside?k=<family key>
// Checks the signed link from the "see inside" email and, if it's good,
// returns the list of private photos (each served by /api/inside-photo). On the first open (first=1) it tells the
// family who has confirmed. The family's own key opens the same photos with
// no email sent, using a fresh one-day token for the photo links.
const { INBOX, sign, verify, familyOk, sendEmail, esc, json, wrap } = require("./_inside");
// Captions, descriptions and (where we have them) room sizes, keyed by
// file name in the private photo store. Sizes from Mom, 31 Oct 2026.
// Photo 15 (laundry room) and 22 (the mews) taken out at her request, 31 Oct;
// their files stay in the store (Vercel Blob magazine-mews-inside, inside/).
const PHOTOS = [
  ["01-garden", "Garden", "The back of the house, with the folding doors open onto the decking"],
  ["02-living-room", "Living room", "Open-plan living room and kitchen, with folding doors onto the garden", "Kitchen lounge diner: 6.4m × 5.33m"],
  ["09-living-room-windows", "Living room", "Living room, looking towards the sash windows", "Kitchen lounge diner: 6.4m × 5.33m"],
  ["03-kitchen", "Kitchen", "Pink fitted kitchen with grey worktops and a built-in oven", "Kitchen lounge diner: 6.4m × 5.33m"],
  ["04-bedroom", "Bedroom", "Bedroom with a bird and flower mural wall", "Main bedroom: 4.5m × 4.0m"],
  ["20-bedroom-mural", "Bedroom", "The bird and flower mural in the bedroom", "Main bedroom: 4.5m × 4.0m"],
  ["18-en-suite", "En suite", "En suite with a walk-in shower and gold fittings", "En suite dressing room: 2.92m × 1.85m"],
  ["19-en-suite-shower", "En suite", "Walk-in shower with a gold rainfall shower head", "En suite dressing room: 2.92m × 1.85m"],
  ["10-guest-bedroom", "Guest bedroom", "Guest bedroom with mirrored wardrobes and a door to the guest toilet"],
  ["11-guest-toilet", "Guest toilet", "Guest toilet with an illuminated mirror and a gold basin"],
  ["12-guest-toilet-detail", "Guest toilet", "Marble-effect shelf and patterned tiles in the guest toilet"],
  ["05-garden-studio", "Garden studio", "Timber garden studio on decking, next to the house"],
  ["14-garden-studio-doors", "Garden studio", "Garden studio with its doors open onto the decking"],
  ["15-garden-studio-inside", "Garden studio", "Inside the garden studio, with a door out to the garden"],
  ["17-garage-studio-shower", "Laundry", "The laundry, with palm-print walls"],
  ["13-garden-lawn", "Garden", "Garden lawn with planted borders and brick walls"],
  ["21-back-garden-seating", "Seating area", "Brick gable end with a door, and a seating area outside it"],
  ["22-back-garden", "Greenhouse and shed", "Greenhouse and garden shed"],
  ["06-front", "Front of the house", "Front of the house on the mews, with the planted front garden and lamp post"],
  ["07-front-door", "Front of the house", "Front door and front garden"],
];

// All the room sizes we have, for the list under the photos.
const ROOMS = [
  ["Kitchen lounge diner", "6.4m × 5.33m", "21'0\" × 17'6\""],
  ["Utility room", "2.03m × 1.85m", "6'8\" × 6'1\""],
  ["Main bedroom", "4.5m × 4.0m", "14'9\" × 13'1\""],
  ["En suite dressing room", "2.92m × 1.85m", "9'7\" × 6'1\""],
];

module.exports = async (req, res) => {
  const url = new URL(req.url, "http://x");
  res.setHeader("X-Robots-Tag", "noindex");

  if (url.searchParams.has("k")) {
    if (!familyOk(url.searchParams.get("k"))) return json(res, 403, { ok: false, error: "This family link isn't right. Please check you have the whole link." });
    let token;
    try { token = sign({ n: "Family", e: INBOX, p: "", s: "", fam: 1, x: Date.now() + 864e5 }); }
    catch (e) { return json(res, 503, { ok: false, error: "Not ready yet. Please try again shortly." }); }
    const ft = encodeURIComponent(token);
    const photos = PHOTOS.map(([f, caption, alt, size]) => ({ src: "/api/inside-photo?f=" + f + "&t=" + ft, caption, alt, size: size || "" }));
    return json(res, 200, { ok: true, name: "", family: true, photos, rooms: ROOMS });
  }

  const data = verify(url.searchParams.get("t"));
  if (!data) return json(res, 403, { ok: false, error: "This link has expired or isn't valid. Please ask for a new one on the website." });

  const t = encodeURIComponent(url.searchParams.get("t"));
  const photos = PHOTOS.map(([f, caption, alt, size]) => ({ src: "/api/inside-photo?f=" + f + "&t=" + t, caption, alt, size: size || "" }));

  if (url.searchParams.get("first") === "1" && !data.fam) {
    try {
      const rows = [["Name", data.n], ["Email", data.e], ["Phone", data.p || "—"], ["Position", data.s || "—"]];
      await sendEmail({
        to: INBOX,
        replyTo: data.e,
        subject: "Confirmed: " + data.n + " has seen inside Magazine Mews",
        text: rows.map((r) => r[0] + ": " + r[1]).join("\n") + "\n\nThey confirmed their email and opened the inside photos. Reply to this email to reach them.",
        html: wrap("Someone's seen inside", `<p style="margin:0 0 16px;font-size:16px;line-height:1.5">They confirmed their email and opened the inside photos. Reply to this email to reach them.</p>
<table style="border-collapse:collapse;font-size:15px">${rows.map((r) => `<tr><td style="padding:6px 18px 6px 0;color:#5A3A50">${r[0]}</td><td style="padding:6px 0"><strong>${esc(r[1])}</strong></td></tr>`).join("")}</table>`),
      });
    } catch (e) { console.error("inside notify failed:", e.message); }
  }
  return json(res, 200, { ok: true, name: data.n.split(/\s+/)[0], photos, rooms: ROOMS });
};
