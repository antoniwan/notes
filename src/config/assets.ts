// Asset Configuration
// This file contains the configuration for all static assets used in the site

export const assetConfig = {
  // Default images
  images: {
    // Default hero image for blog posts without a specific hero image
    defaultHero: '/images/default.avif',

    // Default OG/Twitter card (1200×630 JPEG from generate-social-images)
    defaultSocial: '/social/images/default-social.jpg',

    // Site logo
    logo: '/sh-sh-logo.svg',

    // Favicon (ICO takes priority for better browser compatibility)
    faviconIco: '/favicon.ico',
    favicon: '/favicon.svg',
    appleTouchIcon: '/apple-touch-icon.png',
    favicon192: '/favicon-192x192.png',
    favicon512: '/favicon-512x512.png',
  },

  // Symbol images (for special content)
  symbols: {
    lightsaber: '/symbols/lightsaber.avif',
  },

  // Site manifest
  manifest: '/site.webmanifest',

  // Robots file
  robots: '/robots.txt',
};

// Type for asset configuration
export type AssetConfig = typeof assetConfig;
