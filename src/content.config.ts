import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { categories } from './data/categories';
import type { Category } from './data/categories';
import { seriesIds } from './data/series';
import { canonicalizeTags } from './utils/tagVocabulary';

// Create a list of valid category IDs
const validCategoryIds = categories.map((cat: Category) => cat.id);

// Date validation and formatting
const dateSchema = z
  .union([
    z.string().transform((str) => new Date(str)),
    z.date(),
    z.number().transform((num) => new Date(num)),
  ])
  .refine((date) => !isNaN(date.getTime()), {
    message: 'Invalid date format',
  });

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/p/` directory.
  loader: glob({ base: './src/content/p', pattern: ['**/*.{md,mdx}', '!recipes/**'] }),
  // Type-check frontmatter using a schema
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string(),
    pubDate: dateSchema,
    language: z.array(z.enum(['en', 'es'])).default(['en']),

    // Optional fields
    updatedDate: dateSchema.optional(),
    heroImage: z.string().optional(),
    imageAlt: z.string().optional(),
    /** Photographer or source name shown under the hero. */
    imageCredit: z.string().optional(),
    /** Link to the source page (Wikimedia file page, Unsplash, etc.). */
    imageCreditUrl: z.url().optional(),
    /** Short license label, e.g. CC BY-SA 2.0 */
    imageLicense: z.string().optional(),
    category: z.array(z.enum(validCategoryIds as [string, ...string[]])).optional(),
    subcategory: z.string().optional(),
    // Canonicalize at parse so chips, indexes, and aliases share one vocabulary.
    tags: z.array(z.string()).transform(canonicalizeTags).optional(),
    draft: z
      .boolean()
      .optional()
      .default(false)
      .describe('Whether this post is a draft (not ready for publication)'),
    published: z
      .boolean()
      .optional()
      .default(true)
      .describe('Whether this post should be published on the site'),
    minutesRead: z.string().optional(), // automatically calculated reading time
    author: z.string().optional(),
    authorImage: z.string().optional(),
    authorBio: z.string().optional(),
    featured: z.boolean().optional().default(false),

    // A named series (src/data/series.ts); seriesOrder overrides date order.
    series: z.enum(seriesIds).optional(),
    seriesOrder: z.number().int().positive().optional(),

    // Translation group for multilingual posts
    translationGroup: z.string().optional(),

    // SEO fields (simplified)
    keywords: z.array(z.string()).optional(),

    // Comments
    showComments: z
      .boolean()
      .optional()
      .default(true)
      .describe('Whether to show comments on this post'),
  }),
});

// Field Guide entries (src/data/fieldGuide.ts). Hand-written, one file per
// language; twins share a translationGroup. `revised` replaces a publish date.
const fieldGuideBase = {
  title: z.string(),
  summary: z.string(),
  language: z.enum(['en', 'es']).default('en'),
  translationGroup: z.string().optional(),
  revised: dateSchema,
  draft: z.boolean().optional().default(false),
};

const fieldGuideLoader = (folder: string) =>
  glob({ base: `./src/content/${folder}`, pattern: '**/*.md' });

const concepts = defineCollection({
  loader: fieldGuideLoader('concepts'),
  schema: z.object({
    ...fieldGuideBase,
    /** Who named it, when it isn't Antonio's own: "Julian Rotter, 1950s". */
    origin: z.string().optional(),
  }),
});

const values = defineCollection({
  loader: fieldGuideLoader('values'),
  schema: z.object(fieldGuideBase),
});

const beliefs = defineCollection({
  loader: fieldGuideLoader('beliefs'),
  schema: z.object({
    ...fieldGuideBase,
    /** Groups beliefs on the index: "Beliefs on dignity". */
    topic: z.string(),
  }),
});

export const collections = { blog, concepts, values, beliefs };
