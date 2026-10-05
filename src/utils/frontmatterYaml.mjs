import { CORE_SCHEMA, load, mergeTag, timestampTag } from 'js-yaml';

/**
 * js-yaml 5 loads with the bare YAML 1.2 core schema: an unquoted timestamp
 * stays a string and `<<` merge keys are not resolved. Astro's content layer
 * still parses with js-yaml 4, whose default schema had both. Everything here
 * that re-reads frontmatter from disk has to see the values the site was built
 * from, so both tags are added back.
 */
const FRONTMATTER_SCHEMA = CORE_SCHEMA.withTags(timestampTag, mergeTag);

/**
 * Parses one frontmatter block (the text between the `---` fences).
 * Throws on malformed YAML and on an empty block.
 *
 * @param {string} block
 * @returns {unknown}
 */
export function loadFrontmatterYaml(block) {
  return load(block, { schema: FRONTMATTER_SCHEMA });
}
