// GET /api/inside?t=<token>[&first=1]
// Checks the signed link from the "see inside" email and, if it's good,
// returns the list of private photos (each served by /api/inside-photo). On the first open (first=1) it tells the
// family who has confirmed.
const { INBOX, verify, sendEmail, esc, json, wrap } = require("./_inside");
// Captions and descriptions, keyed by file name in the private photo store
// (Vercel Blob store magazine-mews-inside, folder inside/).
const PHOTOS = [
  ["01-garden", "Garden", "The back of the house, with the folding doors open onto the decking"],
  ["02-living-room", "Living room", "Open-plan living room and kitchen, with folding doors onto the garden"],
  ["09-living-room-windows", "Living room", "Living room, looking towards the sash windows"],
  ["03-kitchen", "Kitchen", "Pink fitted kitchen with grey worktops and a built-in oven"],
  ["04-bedroom", "Bedroom", "Bedroom with a bird and flower mural wall"],
  ["20-bedroom-mural", "Bedroom", "The bird and flower mural in the bedroom"],
  ["18-en-suite", "En suite", "En suite with a walk-in shower and gold fittings"],
  ["19-en-suite-shower", "En suite", "Walk-in shower with a gold rainfall shower head"],
  ["10-guest-bedroom", "Guest bedroom", "Guest bedroom with mirrored wardrobes and a door to the guest toilet"],
  ["11-guest-toilet", "Guest toilet", "Guest toilet with an illuminated mirror and a gold basin"],
  ["12-guest-toilet-detail", "Guest toilet", "Marble-effect shelf and patterned tiles in the guest toilet"],
  ["05-garden-studio", "Garden studio", "Timber garden studio on decking, next to the house"],
  ["14-garden-studio-doors", "Garden studio", "Garden studio with its doors open onto the decking"],
  ["15-garden-studio-inside", "Garden studio", "Inside the garden studio, with a door out to the garden"],
  ["16-garage-studio", "Laundry room", "Laundry room with French doors and a climbing creeper"],
  ["17-garage-studio-shower", "Laundry room shower", "Shower in the laundry room, with palm-print walls"],
  ["13-garden-lawn", "Garden", "Garden lawn with planted borders and brick walls"],
  ["21-back-garden-seating", "Seating area", "Brick gable end with a door, and a seating area outside it"],
  ["22-back-garden", "Greenhouse and shed", "Greenhouse and garden shed"],
  ["06-front", "Front of the house", "Front of the house on the mews, with the planted front garden and lamp post"],
  ["07-front-door", "Front of the house", "Front door and front garden"],
  ["08-the-mews", "The mews", "The mews courtyard and neighbouring Garrison houses"],
];

module.exports = async (req, res) => {
  const url = new URL(req.url, "http://x");
  const data = verify(url.searchParams.get("t"));
  if (!data) return json(res, 403, { ok: false, error: "This link has expired or isn't valid. Please ask for a new one on the website." });

  const t = encodeURIComponent(url.searchParams.get("t"));
  const photos = PHOTOS.map(([f, caption, alt]) => ({ src: "/api/inside-photo?f=" + f + "&t=" + t, caption, alt }));

  if (url.searchParams.get("first") === "1") {
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
  res.setHeader("X-Robots-Tag", "noindex");
  return json(res, 200, { ok: true, name: data.n.split(/\s+/)[0], photos });
};
