// POST /api/see-inside  { name, email, phone, position?, _gotcha? }
// Emails the buyer a link that opens the inside photos once they've
// confirmed their address. Nothing is stored: the link carries the details,
// signed so they can't be altered.
const { SITE, DAYS, sign, sendEmail, esc, clean, isEmail, readBody, json, wrap } = require("./_inside");

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "POST only" });
  if (!process.env.RESEND_API_KEY) return json(res, 503, { ok: false, error: "not ready" });
  const b = await readBody(req);
  if (clean(b._gotcha, 100)) return json(res, 200, { ok: true }); // spam trap: pretend it worked
  const name = clean(b.name, 80);
  const email = clean(b.email, 200).toLowerCase();
  const phone = clean(b.phone, 40);
  const position = clean(b.position, 80);
  if (!name || !isEmail(email)) return json(res, 400, { ok: false, error: "Please add your name and a valid email address." });
  // Phone is required (the family's wish, 11 Oct 2026): 10–15 digits.
  const digits = phone.replace(/\D/g, "").length;
  if (digits < 10 || digits > 15) return json(res, 400, { ok: false, error: "Please add your phone number so the family can arrange a viewing." });

  const token = sign({ n: name, e: email, p: phone, s: position, x: Date.now() + DAYS * 864e5 });
  const link = SITE + "/inside?t=" + encodeURIComponent(token);
  const first = name.split(/\s+/)[0];
  try {
    await sendEmail({
      to: email,
      subject: "Your link to see inside Magazine Mews",
      text: `Hi ${first},\n\nThanks for your interest in Magazine Mews. Open this link to confirm your email and see all the photos of the inside:\n\n${link}\n\nThe link works for ${DAYS} days. To arrange a viewing, just reply to this email.\n\nMagazine Mews, Shoeburyness\n${SITE}/`,
      html: wrap("See inside", `<p style="margin:0 0 14px;font-size:16px;line-height:1.5">Hi ${esc(first)},</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5">Thanks for your interest in Magazine Mews. Press the button to confirm your email and see all the photos of the inside.</p>
<p style="margin:0 0 22px"><a href="${esc(link)}" style="display:inline-block;background:#A83D6C;color:#fff;text-decoration:none;font-weight:bold;padding:13px 24px;border-radius:999px">See inside</a></p>
<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#5A3A50">The link works for ${DAYS} days. To arrange a viewing, just reply to this email.</p>`),
    });
  } catch (e) {
    console.error("see-inside send failed:", e.message);
    return json(res, 502, { ok: false, error: "Sorry, that didn't send. Please try again in a moment." });
  }
  return json(res, 200, { ok: true });
};
