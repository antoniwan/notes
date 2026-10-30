/**
 * Correctness-only CSS rules, like the ESLint set: each one catches a real
 * mistake (a typo'd property, a duplicate, an unknown unit), none of them is
 * about style. Prettier owns formatting and `lint:tokens` owns spacing and widths.
 *
 * Covers src/styles/*.css and the <style> blocks in .astro files.
 */
/** @type {import('stylelint').Config} */
export default {
  ignoreFiles: ['dist/**', 'node_modules/**', 'public/**', 'coverage/**'],
  overrides: [{ files: ['**/*.astro'], customSyntax: 'postcss-html' }],
  rules: {
    'at-rule-no-unknown': [
      true,
      // Tailwind v4 directives.
      {
        ignoreAtRules: [
          'apply',
          'config',
          'custom-variant',
          'layer',
          'plugin',
          'reference',
          'source',
          'theme',
          'utility',
          'variant',
        ],
      },
    ],
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [
      true,
      // A repeated property with a different value is a deliberate fallback.
      { ignore: ['consecutive-duplicates-with-different-syntaxes'] },
    ],
    'declaration-block-no-shorthand-property-overrides': true,
    'font-family-no-duplicate-names': true,
    'function-calc-no-unspaced-operator': true,
    'function-linear-gradient-no-nonstandard-direction': true,
    'keyframe-block-no-duplicate-selectors': true,
    'keyframe-declaration-no-important': true,
    'media-feature-name-no-unknown': true,
    'named-grid-areas-no-invalid': true,
    'no-duplicate-at-import-rules': true,
    'no-invalid-double-slash-comments': true,
    'no-invalid-position-at-import-rule': true,
    'property-no-unknown': true,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
    'selector-pseudo-element-no-unknown': true,
    'selector-type-no-unknown': [true, { ignore: ['custom-elements'] }],
    'string-no-newline': true,
    'unit-no-unknown': true,
  },
};
