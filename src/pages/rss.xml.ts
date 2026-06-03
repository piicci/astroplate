import config from "@/config/config.json";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { getCollection } from "astro:content";

const siteUrl = config.site.base_url.replace(/\/$/, "");

const escapeXml = (value = "") =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET = async () => {
  const posts = await getCollection(
    "journal",
    ({ data, id }) => !data.draft && !id.startsWith("-"),
  );
  const sortedPosts = sortByDate(posts);
  const latestDate = sortedPosts[0]?.data.date ?? new Date();
  const items = sortedPosts
    .map((post) => {
      const postUrl = `${siteUrl}/journal/${post.id}`;
      const pubDate = post.data.date?.toUTCString() ?? latestDate.toUTCString();

      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <link>${postUrl}</link>
          <guid isPermaLink="true">${postUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <description>${escapeXml(post.data.description ?? "")}</description>
        </item>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(config.site.title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(config.metadata.meta_description)}</description>
    <language>en</language>
    <lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
      },
    },
  );
};
