// GET /api/inside-photo?f=<name>&t=<token>
// Streams one photo from the private Blob store, but only with a valid
// "see inside" link. The store itself can't be read without Vercel's token.
const { Readable } = require("stream");
const { verify } = require("./_inside");

const NAME = /^[0-2][0-9]-[a-z-]{2,40}$/;

module.exports = async (req, res) => {
  const url = new URL(req.url, "http://x");
  const f = url.searchParams.get("f") || "";
  if (!NAME.test(f) || !verify(url.searchParams.get("t"))) {
    res.statusCode = 403; return res.end("Not allowed");
  }
  // On Vercel the Blob SDK signs in with the project's OIDC token.
  const oidc = req.headers["x-vercel-oidc-token"];
  if (oidc && !process.env.VERCEL_OIDC_TOKEN) process.env.VERCEL_OIDC_TOKEN = oidc;
  try {
    const { get } = await import("@vercel/blob");
    const result = await get("inside/" + f + ".jpg", {
      access: "private",
      ifNoneMatch: req.headers["if-none-match"] || undefined,
    });
    if (!result) { res.statusCode = 404; return res.end("Not found"); }
    if (result.statusCode === 304) {
      res.statusCode = 304; res.setHeader("ETag", result.blob.etag); res.setHeader("Cache-Control", "private, no-cache"); return res.end();
    }
    if (result.statusCode !== 200) { res.statusCode = 404; return res.end("Not found"); }
    res.setHeader("Content-Type", result.blob.contentType || "image/jpeg");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Robots-Tag", "noindex");
    if (result.blob.etag) res.setHeader("ETag", result.blob.etag);
    res.setHeader("Cache-Control", "private, no-cache");
    Readable.fromWeb(result.stream).pipe(res);
  } catch (e) {
    console.error("inside-photo failed:", e.message);
    res.statusCode = 502; res.end("Photo unavailable");
  }
};
