// sitemap.xml for whichever domain the site is live on, so it stays right
// when a custom domain is added later. vercel.json routes /sitemap.xml here.
module.exports = (req, res) => {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || req.headers["x-forwarded-host"] || req.headers.host;
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "  <url><loc>https://" + host + "/</loc></url>\n" +
    "</urlset>\n";
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.end(xml);
};
