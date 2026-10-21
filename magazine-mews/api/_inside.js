// Shared bits for the "See inside" sign-up and the enquiry form.
// Not a route: Vercel ignores files in api/ that start with "_".
const crypto = require("crypto");

const SITE = "https://magazinemews.co.uk";
const FROM = "Magazine Mews <viewings@magazinemews.co.uk>";
const INBOX = "viewings@magazinemews.co.uk";
const DAYS = 30; // how long a "see inside" link keeps working

// The signing key is derived from the Resend key the Vercel integration
// puts in the project, so no extra secret has to be typed in anywhere.
function key() {
  const k = process.env.RESEND_API_KEY;
  if (!k) return null;
  return crypto.createHash("sha256").update("magazine-mews-inside-v1|" + k).digest();
}

const b64 = (buf) => Buffer.from(buf).toString("base64url");

function sign(data) {
  const k = key();
  if (!k) throw new Error("not configured");
  const body = b64(JSON.stringify(data));
  const mac = b64(crypto.createHmac("sha256", k).update(body).digest()).slice(0, 32);
  return body + "." + mac;
}

function verify(token) {
  const k = key();
  if (!k || typeof token !== "string" || token.length > 2000) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const want = b64(crypto.createHmac("sha256", k).update(body).digest()).slice(0, 32);
  const a = Buffer.from(mac), b = Buffer.from(want);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let data;
  try { data = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); } catch (e) { return null; }
  if (!data || typeof data.x !== "number" || Date.now() > data.x) return null;
  return data;
}

async function sendEmail({ to, subject, text, html, replyTo }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to: [to], subject, text, html, reply_to: replyTo || INBOX }),
  });
  if (!res.ok) throw new Error("Resend " + res.status + " " + (await res.text()).slice(0, 300));
  return res.json();
}

const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clean = (s, max) => String(s == null ? "" : s).replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 200;

// Body as an object, whether it arrived as JSON or a form post.
async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  let raw = typeof req.body === "string" ? req.body : "";
  if (!raw) {
    raw = await new Promise((resolve) => {
      let d = ""; req.on("data", (c) => { d += c; if (d.length > 20000) req.destroy(); });
      req.on("end", () => resolve(d)); req.on("error", () => resolve(""));
    });
  }
  try { return JSON.parse(raw); } catch (e) { return Object.fromEntries(new URLSearchParams(raw)); }
}

function json(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(obj));
}

// Simple branded email wrapper.
function wrap(title, inner) {
  return `<!doctype html><html><body style="margin:0;background:#FBF4F6;font-family:Helvetica,Arial,sans-serif;color:#2E1428">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<p style="margin:0 0 6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#8E2F5A;font-weight:bold">Magazine Mews · Shoeburyness</p>
<h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:26px;color:#4A1F3D">${title}</h1>
${inner}
<p style="margin:28px 0 0;font-size:12px;color:#5A3A50">Magazine Mews, Shoeburyness · <a href="${SITE}/" style="color:#8E2F5A">magazinemews.co.uk</a></p>
</div></body></html>`;
}

module.exports = { SITE, FROM, INBOX, DAYS, sign, verify, sendEmail, esc, clean, isEmail, readBody, json, wrap };
