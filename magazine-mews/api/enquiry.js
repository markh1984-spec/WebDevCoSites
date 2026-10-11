// POST /api/enquiry  { name, email, phone?, position?, heard_via?, message?, _gotcha? }
// Sends the enquiry to viewings@, with Reply-To set to the person asking.
const { INBOX, sendEmail, esc, clean, isEmail, readBody, json, wrap } = require("./_inside");

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { ok: false, error: "POST only" });
  if (!process.env.RESEND_API_KEY) return json(res, 503, { ok: false, error: "not ready" });
  const b = await readBody(req);
  if (clean(b._gotcha, 100)) return json(res, 200, { ok: true });
  const name = clean(b.name, 80);
  const email = clean(b.email, 200).toLowerCase();
  if (!name || !isEmail(email)) return json(res, 400, { ok: false, error: "Please add your name and a valid email address so we can reply." });
  const message = String(b.message || "").trim().slice(0, 4000);
  const rows = [["Name", name], ["Email", email], ["Phone", clean(b.phone, 40) || "—"],
    ["Position", clean(b.position, 80) || "—"], ["Heard about it via", clean(b.heard_via, 80) || "—"]];
  try {
    await sendEmail({
      to: INBOX,
      replyTo: email,
      subject: "Viewing enquiry from " + name,
      text: rows.map((r) => r[0] + ": " + r[1]).join("\n") + "\n\n" + (message || "(no message)") + "\n\nReply to this email to reach them.",
      html: wrap("New enquiry", `<table style="border-collapse:collapse;font-size:15px;margin:0 0 18px">${rows.map((r) => `<tr><td style="padding:6px 18px 6px 0;color:#5A3A50">${r[0]}</td><td style="padding:6px 0"><strong>${esc(r[1])}</strong></td></tr>`).join("")}</table>
<p style="margin:0 0 16px;font-size:16px;line-height:1.5;white-space:pre-wrap">${esc(message || "(no message)")}</p>
<p style="margin:0;font-size:14px;color:#5A3A50">Reply to this email to reach them.</p>`),
    });
  } catch (e) {
    console.error("enquiry send failed:", e.message);
    return json(res, 502, { ok: false, error: "Sorry, that didn't send. Please try again in a moment." });
  }
  return json(res, 200, { ok: true });
};
