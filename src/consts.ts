// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import { assetConfig } from './config/assets';

// TypeScript interfaces for better type safety
export interface Author {
  /** The one ID for Antonio in structured data, defined on antoniwan.online. */
  id: string;
  name: string;
  alternateName: string[];
  email: string;
  url: string;
  github: string;
  linkedin: string;
}

export interface SEOConfig {
  defaultImage: string;
  defaultImageAlt: string;
  defaultHeroImage: string;
  defaultLocale: string;
  defaultRobots: string;
  googleSiteVerification: string;
  twitterHandle: string;
}

// Site Information
export const SITE_TITLE = 'Notes';
export const SHORT_SITE_TITLE = 'Notes';
export const SITE_DESCRIPTION =
  'Field notes from a life in progress: essays, household recipes, fatherhood, cooking, culture, and work.';
export const SITE_URL = 'https://notes.antoniwan.online';

// Author Information
export const AUTHOR: Author = {
  id: 'https://antoniwan.online/#person',
  name: 'Antonio Rodriguez Martinez',
  alternateName: ['Antonio Rodríguez Martínez', 'antoniwan'],
  email: 'antonio@builds.software',
  url: 'https://antoniwan.online',
  github: 'antoniwan',
  linkedin: 'antoniwan',
};

// SEO Configuration
export const SEO_CONFIG: SEOConfig = {
  defaultImage: assetConfig.images.defaultSocial,
  defaultImageAlt:
    'Illustration of a person sitting cross-legged on a rock, wearing a dark hoodie and red pants, with swirling blue, teal, and purple smoke rising from the collar in place of a head, set against a starry night sky and pink-blossomed trees.',
  defaultHeroImage: assetConfig.images.defaultHero,
  defaultLocale: 'en_US',
  defaultRobots: 'index, follow',
  googleSiteVerification: 'gUubXvBv6tFsaZTQd5vS1VUGHlaMTOyf110X3yn7jiY',
  twitterHandle: '@antoniwan',
};
