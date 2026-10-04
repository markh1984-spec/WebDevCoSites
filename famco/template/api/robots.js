// robots.txt: let every search engine in, and point them at the sitemap.
// vercel.json routes /robots.txt here.
module.exports = (req, res) => {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || req.headers["x-forwarded-host"] || req.headers.host;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end("User-agent: *\nAllow: /\n\nSitemap: https://" + host + "/sitemap.xml\n");
};
