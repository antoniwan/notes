#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
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

  // Legacy fields to remove
  canonicalUrl: 'legacy',
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

function auditPost(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter) {
    return {
      file: path.basename(filePath),
      status: 'ERROR',
      issues: ['No frontmatter found or invalid YAML'],
    };
  }

  const issues = [];
  const missingFields = [];
  const extraFields = [];
  const legacyFields = [];

  // Check for missing required fields
  const requiredFields = ['title', 'description', 'pubDate', 'language'];
  for (const field of requiredFields) {
    if (!frontmatter[field]) {
      missingFields.push(field);
    }
  }

  // Check for extra/unknown fields
  for (const field of Object.keys(frontmatter)) {
    if (!OFFICIAL_FRONTMATTER[field]) {
      extraFields.push(field);
    } else if (OFFICIAL_FRONTMATTER[field] === 'legacy') {
      legacyFields.push(field);
    }
  }

  // Check field order
  const currentOrder = Object.keys(frontmatter);
  const expectedOrder = FIELD_ORDER.filter((field) => frontmatter[field] !== undefined);

  let orderIssues = [];
  for (let i = 0; i < Math.min(currentOrder.length, expectedOrder.length); i++) {
    if (currentOrder[i] !== expectedOrder[i]) {
      orderIssues.push(`Field "${currentOrder[i]}" should be after "${expectedOrder[i]}"`);
    }
  }

  if (missingFields.length > 0) {
    issues.push(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (extraFields.length > 0) {
    issues.push(`Unknown fields: ${extraFields.join(', ')}`);
  }

  if (legacyFields.length > 0) {
    issues.push(`Legacy fields to remove: ${legacyFields.join(', ')}`);
  }

  if (orderIssues.length > 0) {
    issues.push(`Field order issues: ${orderIssues.join('; ')}`);
  }

  return {
    file: path.basename(filePath),
    status: issues.length > 0 ? 'ISSUES' : 'OK',
    issues,
    frontmatter: Object.keys(frontmatter),
  };
}

async function main() {
  try {
    console.log('🔍 Auditing blog post frontmatter...\n');

    const files = fs.readdirSync(postsDir).filter((file) => file.endsWith('.md'));
    const results = [];

    for (const file of files) {
      const filePath = path.join(postsDir, file);
      const result = auditPost(filePath);
      results.push(result);
    }

    // Group results by status
    const ok = results.filter((r) => r.status === 'OK');
    const issues = results.filter((r) => r.status === 'ISSUES');
    const errors = results.filter((r) => r.status === 'ERROR');

    console.log(`📊 Audit Results:`);
    console.log(`✅ OK: ${ok.length} posts`);
    console.log(`⚠️  Issues: ${issues.length} posts`);
    console.log(`❌ Errors: ${errors.length} posts`);
    console.log(`📝 Total: ${results.length} posts\n`);

    if (issues.length > 0) {
      console.log('⚠️  Posts with issues:');
      for (const result of issues) {
        console.log(`\n📄 ${result.file}:`);
        for (const issue of result.issues) {
          console.log(`   - ${issue}`);
        }
      }
    }

    if (errors.length > 0) {
      console.log('\n❌ Posts with errors:');
      for (const result of errors) {
        console.log(`\n📄 ${result.file}:`);
        for (const issue of result.issues) {
          console.log(`   - ${issue}`);
        }
      }
    }

    // Generate summary
    const allFields = new Set();
    results.forEach((result) => {
      if (result.frontmatter) {
        result.frontmatter.forEach((field) => allFields.add(field));
      }
    });

    console.log('\n📋 Field Usage Summary:');
    const sortedFields = Array.from(allFields).sort();
    for (const field of sortedFields) {
      const count = results.filter((r) => r.frontmatter && r.frontmatter.includes(field)).length;
      const percentage = ((count / results.length) * 100).toFixed(1);
      console.log(`   ${field}: ${count}/${results.length} (${percentage}%)`);
    }

    // Save detailed report
    const report = {
      summary: {
        total: results.length,
        ok: ok.length,
        issues: issues.length,
        errors: errors.length,
      },
      results,
      fieldUsage: Object.fromEntries(
        sortedFields.map((field) => [
          field,
          results.filter((r) => r.frontmatter && r.frontmatter.includes(field)).length,
        ]),
      ),
    };

    fs.writeFileSync(
      path.join(__dirname, '../docs/frontmatter-audit-report.json'),
      JSON.stringify(report, null, 2),
    );

    console.log('\n📄 Detailed report saved to: docs/frontmatter-audit-report.json');
  } catch (error) {
    console.error('Error during audit:', error);
    process.exit(1);
  }
}

main();
