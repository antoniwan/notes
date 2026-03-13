import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';
import { categories } from './data/categories';
import type { Category } from './data/categories';

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
  loader: glob({ base: './src/content/p', pattern: '**/*.{md,mdx}' }),
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
    category: z.array(z.enum(validCategoryIds as [string, ...string[]])).optional(),
    subcategory: z.string().optional(),
    tags: z.array(z.string()).optional(),
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
    highlight: z.boolean().optional().default(false),

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

export const collections = { blog };
