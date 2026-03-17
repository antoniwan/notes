// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import { SITE_URL } from './src/consts';
import { remarkReadingTime } from './remark-reading-time.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  experimental: {
    queuedRendering: {
      enabled: true,
    },
  },
  fonts: [
    {
      name: 'DM Sans',
      cssVariable: '--font-sans',
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700, 800],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    {
      name: 'Fraunces',
      cssVariable: '--font-heading',
      provider: fontProviders.fontsource(),
      weights: [400, 500, 600, 700, 800, 900],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    {
      name: 'Literata',
      cssVariable: '--font-serif',
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700, 800],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
    },
    {
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      provider: fontProviders.fontsource(),
      weights: [300, 400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
  ],
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      applyBaseStyles: true,
    }),
  ],
  adapter: vercel(),
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    smartypants: true,
    gfm: true,
    remarkPlugins: [remarkReadingTime],
  },
  // Enable built-in prefetch with optimized settings
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  // Enhanced image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: ['notes.antoniwan.online'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'notes.antoniwan.online',
        pathname: '/images/**',
      },
    ],
  },
  // Build optimizations
  build: {
    inlineStylesheets: 'auto', // Inline small stylesheets
  },
  // Vite optimizations for better performance
  vite: {
    server: {
      watch: {
        // Polling can break HMR on macOS; use native events for hot-reload
        usePolling: false,
      },
      hmr: true,
      // Optimize dev server performance
      fs: {
        // Limit file system access for faster startup
        strict: false,
      },
    },
    build: {
      cssMinify: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split vendor chunks for better caching
            if (id.includes('node_modules')) {
              // Core Astro dependencies
              if (id.includes('astro') || id.includes('@astrojs')) {
                return 'vendor-astro';
              }
              // Date utilities
              if (id.includes('date-fns')) {
                return 'vendor-date';
              }
              // NLP and analysis libraries
              if (id.includes('sentiment')) {
                return 'vendor-nlp';
              }
              // Other vendor dependencies
              return 'vendor';
            }
            // Split brain-science utilities into separate chunk
            if (id.includes('brainScience') || id.includes('brain-science')) {
              return 'brain-science';
            }
          },
        },
      },
    },
    css: {
      devSourcemap: true, // Enable sourcemaps in dev for better HMR
    },
    optimizeDeps: {
      include: ['@astrojs/mdx', 'date-fns', 'reading-time', 'sentiment'],
      // Exclude heavy dependencies from pre-bundling in dev
      exclude: [],
    },
    // Improve dev server performance
    esbuild: {
      // Only process changed files in dev
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    // Reduce dev server overhead
    ssr: {
      // Don't externalize these in dev for faster HMR
      noExternal: [],
    },
  },
});
