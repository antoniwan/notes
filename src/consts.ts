// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import { assetConfig } from './config/assets';

// TypeScript interfaces for better type safety
export interface Author {
  name: string;
  email: string;
  url: string;
  github: string;
  linkedin: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  bluesky: string;
  buildsSoftware: string;
  strongHands: string;
  twitter: string;
  threads: string;
}

export interface SEOConfig {
  defaultImage: string;
  defaultImageAlt: string;
  defaultHeroImage: string;
  defaultLocale: string;
  defaultRobots: string;
  googleSiteVerification: string;
  twitterHandle: string;
  organizationName: string;
  organizationLogo: string;
  organizationLogoWidth: number;
  organizationLogoHeight: number;
}

// Site Information
export const SITE_TITLE = 'Notes';
export const SHORT_SITE_TITLE = 'Notes';
export const SITE_DESCRIPTION =
  'Field notes from a life in progress: essays, household recipes, fatherhood, cooking, culture, and work.';
export const SITE_URL = 'https://notes.antoniwan.online';

// Author Information
export const AUTHOR: Author = {
  name: 'Antonio Rodriguez Martinez',
  email: 'antonio@builds.software',
  url: 'https://antoniwan.online',
  github: 'antoniwan',
  linkedin: 'antoniwan',
};

// Social Media Links
export const SOCIAL_LINKS: SocialLinks = {
  github: 'https://github.com/antoniwan',
  linkedin: 'https://linkedin.com/in/antoniwan',
  bluesky: 'https://bsky.app/profile/antoniwan.online',
  buildsSoftware: 'https://builds.software',
  strongHands: 'https://stronghandssoftheart.com',
  twitter: 'https://twitter.com/antoniwan',
  threads: 'https://www.threads.com/@_antoniwan',
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
  organizationName: 'Antonio Rodriguez Martinez',
  organizationLogo: assetConfig.images.logo,
  organizationLogoWidth: 512,
  organizationLogoHeight: 512,
};

// Disclaimer Text
export const DISCLAIMER_TEXT =
  'The wisdom, practices, and digital alchemy shared here flow from personal experience and creative exploration. None of this constitutes medical, legal, psychological, or professional advice. Please consult qualified professionals for such guidance.';
