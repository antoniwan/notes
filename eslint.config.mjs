import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  {
    // Ignore build output, dependencies, and complex Writing Insights dashboards
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      '**/*.min.js',
      'node_modules/**',
      'src/pages/writing-insights/**',
    ],
  },
  // Astro + JavaScript/TypeScript recommended rules for .astro files and scripts
  ...eslintPluginAstro.configs.recommended,
];
