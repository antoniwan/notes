#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import { parseFrontmatter } from './utils/frontmatter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to blog posts
const postsDir = path.join(__dirname, '../src/content/p');

// Official frontmatter specification
const OFFICIAL_FRONTMATTER = {
  // Required fields
  title: 'string',
  description: 'string',
  pubDate: 'date',
  language: 'array',

  // Optional fields (in order)
  updatedDate: 'date',
  heroImage: 'string',
  category: 'array',
  subcategory: 'string',
  tags: 'array',
  readingTime: 'number',
  draft: 'boolean',
  featured: 'boolean',
  published: 'boolean',
  showComments: 'boolean',
  author: 'string',
  authorImage: 'string',
  authorBio: 'string',
  translationGroup: 'string',
  keywords: 'array',
};

// Field order for consistent frontmatter
const FIELD_ORDER = [
  'title',
  'description',
  'pubDate',
  'language',
  'updatedDate',
  'heroImage',
  'category',
  'subcategory',
  'tags',
  'readingTime',
  'draft',
  'featured',
  'published',
  'showComments',
  'author',
  'authorImage',
  'authorBio',
  'translationGroup',
  'keywords',
];

// Legacy fields to remove
const LEGACY_FIELDS = ['canonicalUrl'];

function generateFrontmatter(frontmatter) {
  // Remove legacy fields
  const cleanedFrontmatter = { ...frontmatter };
  LEGACY_FIELDS.forEach((field) => {
    delete cleanedFrontmatter[field];
  });

  // Ensure required fields have defaults
  if (!cleanedFrontmatter.language) {
    cleanedFrontmatter.language = ['en'];
  }

  if (cleanedFrontmatter.draft === undefined) {
    cleanedFrontmatter.draft = false;
  }

  if (cleanedFrontmatter.featured === undefined) {
    cleanedFrontmatter.featured = false;
  }

  if (cleanedFrontmatter.published === undefined) {
    cleanedFrontmatter.published = true;
  }

  if (cleanedFrontmatter.showComments === undefined) {
    cleanedFrontmatter.showComments = true;
  }

  // Order fields according to specification
  const orderedFrontmatter = {};
  FIELD_ORDER.forEach((field) => {
    if (cleanedFrontmatter[field] !== undefined) {
      orderedFrontmatter[field] = cleanedFrontmatter[field];
    }
  });

  // Add any remaining fields that aren't in the official spec
  Object.keys(cleanedFrontmatter).forEach((field) => {
    if (!FIELD_ORDER.includes(field) && !LEGACY_FIELDS.includes(field)) {
      orderedFrontmatter[field] = cleanedFrontmatter[field];
    }
  });

  return orderedFrontmatter;
}

function formatYAML(obj) {
  return yaml.dump(obj, {
    indent: 2,
    lineWidth: 80,
    noRefs: true,
    sortKeys: false, // Keep our custom order
  });
}

function standardizePost(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    console.error(`❌ Could not parse frontmatter for ${path.basename(filePath)}`);
    return false;
  }

  // Generate standardized frontmatter
  const standardizedFrontmatter = generateFrontmatter(frontmatter);

  // Format the new frontmatter
  const newFrontmatterYAML = formatYAML(standardizedFrontmatter);

  // Replace the old frontmatter with the new one
  const newContent = content.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---\n${newFrontmatterYAML}---`);

  // Write the updated content back to the file
  fs.writeFileSync(filePath, newContent, 'utf8');

  return true;
}

async function main() {
  try {
    console.log('🔧 Standardizing blog post frontmatter...\n');

    const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));
    const results = [];

    for (const file of files) {
      const filePath = path.join(postsDir, file);
      console.log(`📄 Processing ${file}...`);

      const success = standardizePost(filePath);
      results.push({
        file,
        success,
      });

      if (success) {
        console.log(`   ✅ Standardized`);
      } else {
        console.log(`   ❌ Failed`);
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(`\n📊 Standardization Results:`);
    console.log(`✅ Successful: ${successful} posts`);
    console.log(`❌ Failed: ${failed} posts`);
    console.log(`📝 Total: ${results.length} posts`);

    if (failed > 0) {
      console.log('\n❌ Failed posts:');
      results
        .filter((r) => !r.success)
        .forEach((result) => {
          console.log(`   - ${result.file}`);
        });
    }

    console.log('\n🎉 Frontmatter standardization complete!');
  } catch (error) {
    console.error('Error during standardization:', error);
    process.exit(1);
  }
}

main();
