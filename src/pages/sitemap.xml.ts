import type { APIRoute } from "astro";
import { SITE } from "@/config";

// Serves a valid sitemapindex XML at /sitemap.xml that points to the
// @astrojs/sitemap-generated /sitemap-index.xml. GitHub Pages doesn't support
// server-side redirects, so the astro.config.ts redirect would produce an HTML
// file here instead of valid XML, which search engines can't parse.
export const GET: APIRoute = ({ site }) => {
  const siteUrl = (site ?? SITE.website).toString().replace(/\/$/, "");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-index.xml</loc>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
