import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  {
    // Ignore build output, dependencies, and complex brain-science pages
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      '**/*.min.js',
      'node_modules/**',
      'src/pages/brain-science/**',
    ],
  },
  // Astro + JavaScript/TypeScript recommended rules for .astro files and scripts
  ...eslintPluginAstro.configs.recommended,
];
