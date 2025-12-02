#!/usr/bin/env node

import yaml from 'js-yaml';

/**
 * Parse YAML frontmatter from markdown content
 * @param {string} content - The markdown content with frontmatter
 * @returns {object|null} - Parsed frontmatter object or null if parsing fails
 */
export function parseFrontmatter(content) {
  // More robust regex to match YAML frontmatter
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) return null;

  try {
    const frontmatterText = frontmatterMatch[1];
    const frontmatter = yaml.load(frontmatterText);
    return frontmatter || {};
  } catch (error) {
    console.error('Error parsing YAML frontmatter:', error.message);
    return null;
  }
}

