import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const commonFields = {
  title: z.string(),
  description: z.string(),
  meta_title: z.string().optional(),
  // z.coerce.date() handles both Date objects and ISO string dates from frontmatter (Zod 4)
  date: z.coerce.date().optional(),
  image: z.string().optional(),
  draft: z.boolean(),
};

// Post collection schema
const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    meta_title: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    image: z.string().optional(),
    author: z.string().default("Admin"),
    // Use factory functions for mutable array defaults (Zod 4 best practice)
    categories: z.array(z.string()).default(() => ["others"]),
    tags: z.array(z.string()).default(() => ["others"]),
    draft: z.boolean().optional(),
  }),
});

// Author collection schema
const authorsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/authors" }),
  schema: z.object({
    ...commonFields,
    email: z.email().optional(),
    social: z
      .array(
        z
          .object({
            name: z.string().optional(),
            icon: z.string().optional(),
            link: z.string().optional(),
          })
          .optional(),
      )
      .optional(),
    draft: z.boolean().optional(),
  }),
});

// Pages collection schema
const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    ...commonFields,
  }),
});

// about collection schema
const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    ...commonFields,
  }),
});

// contact collection schema
const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    ...commonFields,
  }),
});

// Homepage collection schema
const homepageButton = z.object({
  enable: z.boolean(),
  label: z.string(),
  link: z.string(),
  variant: z.enum(["primary", "outline"]).default("primary"),
});

const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string(),
    image: z.string().optional(),
    banner: z.object({
      eyebrow: z.string(),
      title: z.string(),
      content: z.string(),
      image: z.string(),
      image_alt: z.string(),
      image_note: z.string(),
      buttons: z.array(homepageButton),
    }),
    intro: z.object({
      title: z.string(),
      content: z.string(),
      closing: z.string(),
    }),
    featured_articles: z.object({
      title: z.string(),
      content: z.string(),
      button: homepageButton,
      articles: z.array(
        z.object({
          category: z.string(),
          title: z.string(),
          subtitle: z.string().optional(),
          excerpt: z.string(),
          link: z.string(),
          image: z.string(),
          image_alt: z.string(),
        }),
      ),
    }),
    newsletter: z.object({
      title: z.string(),
      content: z.string(),
      submit_label: z.string(),
      helper_text: z.string(),
      success_message: z.string(),
    }),
    approach: z.object({
      title: z.string(),
      content: z.string(),
      pillars: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
        }),
      ),
    }),
    pathways: z.object({
      title: z.string(),
      content: z.string(),
      items: z.array(
        z.object({
          eyebrow: z.string(),
          title: z.string(),
          content: z.string(),
          link: z.string(),
          label: z.string(),
        }),
      ),
    }),
    about_panel: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string(),
      image_alt: z.string(),
      button: homepageButton,
    }),
    final_cta: z.object({
      eyebrow: z.string(),
      title: z.string(),
      content: z.string(),
      button: homepageButton,
      note: z.string(),
    }),
    features: z
      .array(
        z.object({
          title: z.string(),
          image: z.string(),
          content: z.string(),
          bulletpoints: z.array(z.string()),
          button: homepageButton,
        }),
      )
      .optional(),
    categories: z
      .array(
        z.object({
          title: z.string(),
          content: z.string(),
          link: z.string(),
          label: z.string(),
          image: z.string(),
          image_position: z.string().default("center"),
        }),
      )
      .optional(),
    topics: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
        }),
      )
      .optional(),
  }),
});

// Call to Action collection schema
const ctaSectionCollection = defineCollection({
  loader: glob({
    pattern: "call-to-action.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
  }),
});

// Testimonials Section collection schema
const testimonialSectionCollection = defineCollection({
  loader: glob({
    pattern: "testimonial.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    testimonials: z.array(
      z.object({
        name: z.string(),
        avatar: z.string(),
        designation: z.string(),
        content: z.string(),
      }),
    ),
  }),
});

// Export collections
export const collections = {
  // Pages
  homepage: homepageCollection,
  blog: blogCollection,
  authors: authorsCollection,
  pages: pagesCollection,
  about: aboutCollection,
  contact: contactCollection,

  // sections
  ctaSection: ctaSectionCollection,
  testimonialSection: testimonialSectionCollection,
};
