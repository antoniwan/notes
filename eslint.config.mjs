import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

/**
 * Correctness-focused core rules. These are ESLint built-ins, so they need no
 * extra plugin package.
 *
 * Two rules are deliberately absent from this shared set:
 *
 * - `no-undef` needs a per-environment globals list to be accurate, and the
 *   `globals` package is not a direct dependency here. TypeScript already
 *   reports undefined identifiers across `.ts` and `.astro` via `astro check`.
 * - `no-unused-vars` is applied to plain JavaScript only, further down. The core
 *   rule cannot read TypeScript type positions, so it reports every parameter
 *   name in a function *type* — `warn: (message: string) => void` — as an unused
 *   argument: 45 false positives and no true ones in this repo. `noUnusedLocals`
 *   and `noUnusedParameters` in `tsconfig.json` cover TypeScript correctly and
 *   run in CI through `astro check`.
 */
const correctnessRules = {
  // Default 'except-parens' on purpose: it still catches an accidental
  // `if (a = b)` while permitting the parenthesized `while ((m = re.exec(s)))`
  // iteration idiom the social-image script uses.
  'no-cond-assign': 'error',
  'no-constant-binary-expression': 'error',
  'no-constant-condition': ['error', { checkLoops: false }],
  'no-dupe-args': 'error',
  'no-dupe-else-if': 'error',
  'no-dupe-keys': 'error',
  'no-duplicate-case': 'error',
  'no-empty': ['error', { allowEmptyCatch: true }],
  'no-fallthrough': 'error',
  'no-func-assign': 'error',
  'no-irregular-whitespace': 'error',
  'no-self-assign': 'error',
  'no-self-compare': 'error',
  'no-sparse-arrays': 'error',
  'no-template-curly-in-string': 'error',
  // 'no-unmodified-loop-condition' is left off: it cannot see a binding mutated
  // through a method, so `while (d <= end) { d.setMonth(...) }` in
  // brainScience/data.ts reads as an infinite loop to it. Not in ESLint's
  // recommended set for the same reason.
  'no-unreachable': 'error',
  'no-unsafe-finally': 'error',
  'no-unsafe-negation': 'error',
  'no-unsafe-optional-chaining': 'error',
  'no-async-promise-executor': 'error',
  'no-compare-neg-zero': 'error',
  'use-isnan': 'error',
  'valid-typeof': 'error',
};

export default [
  {
    // Build output and dependencies only. Source directories are not excluded:
    // an ignored directory makes a green lint run mean less than it appears to.
    ignores: ['dist/**', 'build/**', 'coverage/**', '.vercel/**', '**/*.min.js', 'node_modules/**'],
  },

  // Astro's own rules for .astro files.
  ...eslintPluginAstro.configs.recommended,

  // Plain JavaScript: scripts/, public/, and config files. TypeScript does not
  // check these (`checkJs` is off), so ESLint owns unused symbols here.
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      ...correctnessRules,
      'no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // TypeScript. Flat config lints no .ts file unless a config block claims it,
  // so without this entry every .ts file in src/ was silently skipped.
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: correctnessRules,
  },

  // The same rules inside .astro frontmatter and <script> blocks.
  {
    files: ['**/*.astro'],
    rules: correctnessRules,
  },
];
