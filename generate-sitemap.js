const fs = require("fs");
const path = require("path");

// ---- CONFIG ----
const siteUrl = "https://dazcfutboltv.me"; // <-- apna domain daalna

// yahan apne pages manually daal do
const pages = [
  "/",              // homepage
  "/about/",
  "/contact/",
  "/privacy/",
  "/dmca/"
];

// posts ko array me daalo (later ye DB ya folder se auto fetch bhi ho sakta hai)
const posts = [
  "/match-today-watch/",
  "/futbol-en-vivo-online/",
  "/partidos-hd-streaming/"
];

// sitemap XML generate
function generateSitemap() {
  const urls = [];

  // homepage (highest priority)
  urls.push(`
    <url>
      <loc>${siteUrl}/</loc>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>`);

  // pages (lower priority)
  pages.forEach(p => {
    if (p !== "/") {
      urls.push(`
        <url>
          <loc>${siteUrl}${p}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>`);
    }
  });

  // posts (medium priority)
  posts.forEach(post => {
    urls.push(`
      <url>
        <loc>${siteUrl}${post}</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>`);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join("\n")}
  </urlset>`;

  fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemap.trim());
  console.log("✅ sitemap.xml generated successfully!");
}

generateSitemap();
