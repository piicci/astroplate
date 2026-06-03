import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig, fontProviders } from "astro/config";
import * as nodeFs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sharp from "sharp";
import config from "./src/config/config.json";
import theme from "./src/config/theme.json";
import { slug as slugify } from "github-slugger";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const contentFilePath = (...parts) => path.join(projectRoot, ...parts);
const toRoute = (route) => route.replace(/\/$/, "") || "/";
const routeLastmods = new Map();
let fallbackLastmod = new Date(0);

const maxDate = (current, next) => (next > current ? next : current);

const setRouteLastmod = (route, date) => {
  if (!(date instanceof Date) || Number.isNaN(date.valueOf())) return;

  const normalizedRoute = toRoute(route);
  const currentDate = routeLastmods.get(normalizedRoute);
  routeLastmods.set(
    normalizedRoute,
    currentDate ? maxDate(currentDate, date) : date,
  );
  fallbackLastmod = maxDate(fallbackLastmod, date);
};

const getMarkdownFiles = (directory) => {
  if (!nodeFs.existsSync(directory)) return [];

  return nodeFs
    .readdirSync(directory)
    .filter((file) => /\.(md|mdx)$/.test(file))
    .map((file) => path.join(directory, file));
};

const getFrontmatter = (source) => {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  return match?.[1] ?? "";
};

const getFrontmatterDate = (frontmatter) => {
  const match = frontmatter.match(/^date:\s*['"]?([^'"\n]+)['"]?\s*$/m);
  return match ? new Date(match[1]) : undefined;
};

const getFrontmatterList = (frontmatter, fieldName) => {
  const match = frontmatter.match(
    new RegExp(`^${fieldName}:\\s*\\n((?:\\s+-\\s+.+\\n?)+)`, "m"),
  );

  if (!match) return [];

  return match[1]
    .split("\n")
    .map((line) => line.match(/^\s*-\s+(.+?)\s*$/)?.[1])
    .filter(Boolean)
    .map((value) => value.replace(/^['"]|['"]$/g, ""));
};

const getContentDate = (filePath, frontmatter) => {
  return getFrontmatterDate(frontmatter) ?? nodeFs.statSync(filePath).mtime;
};

const addContentLastmods = () => {
  const journalFiles = getMarkdownFiles(contentFilePath("src/content/journal"));
  let latestJournalDate;

  for (const filePath of journalFiles) {
    const id = path.basename(filePath, path.extname(filePath));
    const source = nodeFs.readFileSync(filePath, "utf8");
    const frontmatter = getFrontmatter(source);
    const date = getContentDate(filePath, frontmatter);

    if (id === "-index") {
      setRouteLastmod("/journal", date);
      continue;
    }

    setRouteLastmod(`/journal/${id}`, date);
    latestJournalDate = latestJournalDate
      ? maxDate(latestJournalDate, date)
      : date;

    for (const category of getFrontmatterList(frontmatter, "categories")) {
      setRouteLastmod(`/journal/categories/${slugify(category)}`, date);
    }
  }

  if (latestJournalDate) {
    setRouteLastmod("/journal", latestJournalDate);
    setRouteLastmod("/journal/categories", latestJournalDate);
  }

  for (const filePath of getMarkdownFiles(contentFilePath("src/content/pages"))) {
    const id = path.basename(filePath, path.extname(filePath));
    const source = nodeFs.readFileSync(filePath, "utf8");
    const date = getContentDate(filePath, getFrontmatter(source));
    setRouteLastmod(`/${id}`, date);
  }

  const staticContentRoutes = [
    ["/", "src/content/homepage/-index.md", "src/pages/index.astro"],
    ["/about", "src/content/about/-index.md", "src/pages/about.astro"],
    ["/contact", "src/content/contact/-index.md", "src/pages/contact.astro"],
    ["/breakfast-guide", "src/pages/breakfast-guide.astro"],
    ["/newsletter", "src/pages/newsletter.astro"],
    ["/start-here", "src/pages/start-here.astro"],
  ];

  for (const [route, ...files] of staticContentRoutes) {
    for (const file of files) {
      const filePath = contentFilePath(file);
      if (nodeFs.existsSync(filePath)) {
        setRouteLastmod(route, nodeFs.statSync(filePath).mtime);
      }
    }
  }
};

addContentLastmods();

const getRouteLastmod = (page) => {
  const pathname = toRoute(new URL(page).pathname);
  return (routeLastmods.get(pathname) ?? fallbackLastmod).toISOString();
};

// Helper to parse font string format: "FontName:wght@400;500;600;700"
function parseFontString(fontStr) {
  const [name, weightPart] = fontStr.split(":");
  let weights = [400]; // default weight

  if (weightPart) {
    // Extract weights from wght@400;500;600 format
    const weightMatch = weightPart.match(/wght@?([\d;]+)/);
    if (weightMatch) {
      weights = weightMatch[1].split(";").map((w) => parseInt(w, 10));
    }
  }

  // remove + from font name and add space
  const cleanName = name.replace(/\+/g, " ");
  return { name: cleanName, weights };
}

// Build fonts configuration from theme.json
const fontsConfig = Object.entries(theme.fonts.font_family)
  .filter(([key]) => !key.includes("_type")) // Filter out type entries
  .map(([key, fontStr]) => {
    const { name, weights } = parseFontString(fontStr);
    const typeKey = `${key}_type`;
    const fallback = theme.fonts.font_family[typeKey] || "sans-serif";

    return {
      name,
      cssVariable: `--font-${key}`,
      provider: fontProviders.google(),
      weights,
      display: "swap",
      fallbacks: [fallback],
    };
  });

// https://astro.build/config
export default defineConfig({
  site: config.site.base_url ? config.site.base_url : "http://examplesite.com",
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  image: { service: sharp() },
  vite: { plugins: [tailwindcss()] },
  fonts: fontsConfig,
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const { pathname } = new URL(page);
        return !/^\/(?:authors|tags)(?:\/|$)/.test(pathname) &&
          !/^\/journal\/page\//.test(pathname);
      },
      serialize: (item) => ({
        ...item,
        lastmod: getRouteLastmod(item.url),
      }),
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: { theme: "one-dark-pro", wrap: true },
  },
});
