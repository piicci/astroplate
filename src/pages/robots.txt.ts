import config from "@/config/config.json";

const siteUrl = config.site.base_url.replace(/\/$/, "");

export const GET = () =>
  new Response(
    [
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /__forms.html",
      "Disallow: /brevo-",
      `Sitemap: ${siteUrl}/sitemap-index.xml`,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
