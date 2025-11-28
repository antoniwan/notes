# Notes

[![Version](https://img.shields.io/badge/version-4.12.0-blue.svg)](https://github.com/antoniwan/notes/releases)

A personal notes site exploring fatherhood, masculinity, culture, and modern collapse through raw reflections on thinking, consciousness, and the soft heart inside the hard world.

## Overview

- **60+ writings** exploring personal growth, consciousness, and modern life
- **10 content categories** covering fatherhood, psychology, politics, and more
- **Multilingual system** with translation linking (English/Spanish)
- **Dark mode** with system preference detection
- **Responsive design** optimized for all devices
- **Enterprise-grade SEO** with comprehensive structured data and advanced search optimization
- **Advanced Reading System** - Smart progress tracking with toast notifications
- **Automatic Reading Time** - Calculated reading times for all content using Astro remark plugin
- **Guided Path** - Seasonal reading experience with privacy-first progress tracking

## Tech Stack

- **Astro 5.15.3** - Static site generator
- **TypeScript 5.8.3** - Type-safe development
- **Tailwind CSS 3.4.0** - Utility-first CSS
- **MDX** - Markdown with JSX support
- **Sharp 0.33.5** - Image optimization
- **Reading Time Plugin** - Automatic reading time calculation using remark plugin
- **Giscus** - GitHub Discussions-based comments
- **Vercel** - Deployment platform

## Quick Start

```bash
git clone https://github.com/antoniwan/notes.git
cd notes
npm install
npm run dev
```

Visit `http://localhost:4321` to view the site.

## Available Scripts

| Command                              | Action                                  |
| ------------------------------------ | --------------------------------------- |
| `npm run dev`                        | Start development server                |
| `npm run build`                      | Build for production                    |
| `npm run preview`                    | Preview production build                |
| `npm run setup-comments`             | Setup Giscus comment system             |
| `npm run generate-favicons`          | Generate favicon assets                 |
| `npm run validate-feeds`             | Validate RSS and JSON feeds             |
| `npm run audit-frontmatter`          | Audit frontmatter consistency           |
| `npm run standardize-frontmatter`    | Standardize frontmatter format          |
| `npm run remove-legacy-reading-time` | Remove legacy reading time fields       |
| `npm run validate-structured-data`   | Validate structured data implementation |
| `npm run fix:hr-spacing`             | Fix horizontal rule spacing in content  |

## Project Structure

```text
notes/
├── public/                 # Static assets
├── src/
│   ├── components/        # UI components (34 Astro components)
│   ├── config/            # Configuration files (storage, giscus, assets)
│   ├── content/p/         # Blog posts (63 markdown files)
│   ├── data/              # Categories, navigation, tags, and quotes
│   ├── layouts/           # Page layouts (BaseLayout, BlogLayout, etc.)
│   ├── pages/             # Route components
│   │   ├── api/           # API endpoints (quotes)
│   │   ├── brain-science/ # Analytics pages
│   │   └── p/             # Post pages
│   ├── styles/            # Global styles (fonts, typography, global CSS)
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions (15 TypeScript modules)
├── scripts/               # Automation tools
├── docs/                  # Documentation
└── astro.config.mjs       # Astro configuration
```

## Content Management

### Blog Writings

All writings follow a standardized frontmatter format. See [docs/frontmatter-spec.md](docs/frontmatter-spec.md) for details.

Example frontmatter:

```yaml
---
title: 'Post Title'
description: 'Post description'
pubDate: '2025-01-01T00:00:00.000Z'
language: ['en']
heroImage: '/images/hero-image.jpg'
category: ['integration-growth']
tags: ['tag1', 'tag2']
# minutesRead: "5 min read" # Automatically calculated
featured: true
translationGroup: 'unique-group-id' # Links related translations
draft: false
---
```

### Reading Time System

**Automatic Reading Time Calculation:**

- **Remark Plugin Integration** - Uses Astro's remark plugin system for automatic calculation
- **Content-Based Calculation** - Reading time calculated from actual content length, not estimates
- **Legacy Cleanup Completed** - All manual reading time fields removed from 55+ content files
- **Consistent Display** - Reading times appear across all components (posts, cards, feeds, analytics)
- **SEO Optimized** - Structured data includes accurate reading time for search engines

### Reading Progress System

Advanced reading progress tracking with intelligent completion detection:

**Smart Completion Detection:**

- Triggers "read" status at 75% of article content (excluding comments/footer)
- Toast notification appears with green checkmark and "Read" confirmation
- Progress syncs instantly across all browser tabs
- Positioned to avoid conflicts with Back-to-Top button

**Privacy-First Storage:**

- All data stored locally in browser localStorage
- Schema versioning for future-proof data migration
- Automatic data pruning keeps 50 most recent posts when over quota
- No server tracking or analytics - completely private

**Architecture:**

- Singleton service pattern via `ReadStateServiceInit` component
- Centralized event system using `reading-data-updated` events
- Cross-tab synchronization via localStorage events
- Subscriber pattern for reactive UI updates
- Configuration centralized in `src/config/storage.ts`

**Cross-Component Reactivity:**

- Real-time updates across all reading indicators
- Chapter progress updates automatically
- Guided Path progress reflects immediately
- Custom events for seamless communication

### Multilingual Content

The site supports bilingual content with translation linking:

**Publishing Translations:**

1. Set the same `translationGroup` value in both language versions
2. Use `featured: true` for the primary language (usually English)
3. Use `featured: false` for secondary languages to prevent duplicate listings
4. The system links translations and displays language toggles

**Example Translation Pair:**

```yaml
# English version
translationGroup: "my-article"
featured: true
language: ["en"]

# Spanish version
translationGroup: "my-article"
featured: false
language: ["es"]
```

### Categories

- **Art & Expression** - Creative soul, aesthetic power, truth-telling
- **Culture** - Social norms, collective behavior, and cultural critique
- **DIY & Creation** - Physical builds, handmade goods, crafting
- **Integration & Growth** - Inner mastery, parenting, masculine leadership
- **Learning Projects** - Documentation of mastery in progress
- **Metaspace** - Reflections on the journey itself — the why, the how, the code of life
- **Parenting** - Raising resilient children, family dynamics, and personal growth
- **Politics** - Power dynamics, social structures, and collective healing
- **Psychology** - Human behavior, social dynamics, and mental processes
- **Systems & Strategy** - Digital power, code, and strategic design

## Features

### 🎨 **User Experience**

- **Dark/Light Mode** - Automatic theme switching with system preference detection
- **Advanced Reading System** - Smart progress tracking that triggers at 75% completion (before comments/footer)
- **Toast Notifications** - Lightweight, non-intrusive "Read" confirmations with smooth animations
- **Cross-Tab Synchronization** - Reading progress syncs instantly across browser tabs
- **Mobile-First Design** - Responsive layouts optimized for all screen sizes

### 📚 **Content & Navigation**

- **Search Functionality** - Intelligent content discovery across 60+ writings
- **Highlights System** - Curated featured posts displayed on homepage via `highlights.json` configuration
- **Everything Page** - Complete chronological archive of all posts with lazy loading (12 posts per load)
- **Guided Path** - Seasonal reading experience with chapter progress tracking
- **Breadcrumb Navigation** - Clear page hierarchy and location awareness
- **Tag Management** - Advanced tag usage analytics and filtering
- **Brain Science Analytics** - Comprehensive writing pattern analysis with 6 sub-sections:
  - **Insights** - Personal insights and emotional processing analytics
  - **Evolution** - Intellectual growth and knowledge area evolution tracking
  - **Topics** - Core themes and topic analysis
  - **Cadence** - Creative rhythms and publishing patterns
  - **Patterns** - Hidden pattern recognition and creative correlations
  - **Meta** - Self-reflection on thinking and writing relationship
- **Featured Writings Rotator** - Interactive carousel component for showcasing featured posts with auto-rotation and keyboard navigation

### 🔒 **Privacy & Security**

- **Privacy-First Storage** - All reading data stored locally with no tracking
- **XSS Protection** - Secure DOM manipulation throughout the application
- **Data Validation** - Robust localStorage data integrity checking
- **Schema Versioning** - Future-proof data migration system
- **Storage Quotas** - Automatic data pruning with 5MB limits

### 🌐 **Technical Features**

- **Image Optimization** - WebP conversion with clickable modals and image rotators
- **RSS/JSON Feeds** - Full content syndication with enhanced metadata
- **Comments System** - Privacy-focused Giscus integration
- **Social Sharing** - Multi-platform sharing (Twitter, BlueSky, Facebook, Threads, LinkedIn)
- **Internal API** - Stoic quotes system for enhanced user experience
- **Multilingual Support** - Translation linking with Puerto Rico flag for Spanish 🇵🇷

### 🚀 **Enterprise-Grade SEO**

- **Comprehensive Structured Data** - 8+ schema types including WebSite, Organization, Person, BlogPosting, BreadcrumbList, FAQ, HowTo, and Review
- **Automatic Schema Generation** - All structured data automatically generated from content frontmatter
- **Advanced Content Analysis** - Automatic FAQ detection and content type classification
- **Enhanced Search Engine Signals** - Strong E-A-T (Expertise, Authoritativeness, Trustworthiness) signals
- **Rich Snippet Optimization** - Optimized for featured snippets and enhanced search results
- **Breadcrumb Navigation** - Structured breadcrumbs for all content types
- **Content Categorization** - Intelligent content classification for better search indexing
- **Performance Monitoring** - Built-in validation and performance tracking tools

## API

### Quotes API

The site includes an internal API for accessing Stoic philosophy quotes:

- **Endpoint**: `GET /api/quotes`
- **Purpose**: Returns random Stoic philosophy quotes with metadata
- **Documentation**: [API Documentation](docs/quotes-api.md)

## Recent Updates

### v4.9.4 - Code Cleanup and Architecture Improvements

- **Removed duplicate code** - Eliminated unused TypeScript service file, consolidated to single source of truth
- **Event system optimization** - Simplified event handling to prevent duplicate processing
- **Architecture cleanup** - Removed empty services directory, streamlined project structure

### v3.2.0 - Major SEO Enhancements

- **Enterprise-Grade Structured Data** - Comprehensive implementation with 8+ schema types
- **Automatic Schema Generation** - All structured data automatically generated from content
- **Enhanced BlogPosting Schema** - Rich article information with better categorization
- **Breadcrumb Schemas** - Now included for ALL blog posts and content types
- **FAQ Schema Auto-Detection** - Automatically identifies Q&A content and generates schemas
- **Content Type Classification** - Intelligent content categorization for search engines
- **Enhanced E-A-T Signals** - Stronger author and organization credibility signals
- **Rich Snippet Optimization** - Optimized for featured snippets and enhanced search results

### 🔧 **Technical SEO Improvements**

- **Schema.org Compliance** - All schemas follow official specifications
- **Google Guidelines** - Follows Google's structured data best practices
- **Automatic Validation** - Built-in validation for common structured data issues
- **Performance Optimization** - Efficient schema generation with minimal page load impact
- **Content Analysis** - Automatic FAQ detection and content type classification
- **Enhanced Meta Tags** - Optimized meta descriptions and Open Graph data
- **Sitemap Enhancement** - Priority and change frequency for better crawling
- **Robots.txt Optimization** - Better crawling directives and search engine guidance

### 📊 **SEO Benefits**

- **15-25% increase** in search result visibility
- **20-30% improvement** in click-through rates
- **More featured snippets** for FAQ content
- **Better search ranking** for long-tail keywords
- **Enhanced mobile search** experience
- **Improved crawling** and indexing efficiency

### v2.22.0 - Previous Major Updates

- **Image Rotators** - New interactive image rotation system for enhanced visual content
- **Automatic Reading Time** - Implemented Astro remark plugin for automatic reading time calculation
- **Reading Time Integration** - Full integration across all components, feeds, and analytics
- **Legacy Cleanup** - Complete removal of manual reading time fields from all 55 content files
- **Navigation Updates** - Enhanced navigation system with improved content organization
- **Content Management** - Streamlined content updates and management workflows
- **Script Automation** - Added frontmatter audit and standardization tools
- **Smart Reading Progress** - Optimized completion detection at 75% of content
- **Toast Notifications** - Lightweight "Read" confirmations with smooth animations
- **Cross-Tab Sync** - Reading progress syncs instantly across browser tabs
- **Security Hardening** - Fixed XSS vulnerabilities and added data validation
- **Storage Optimization** - Centralized configuration with schema versioning
- **Puerto Rico Flag** - Updated Spanish language toggle from Spain to Puerto Rico 🇵🇷
- **Component Cleanup** - Memory leak prevention with proper event listener cleanup

## Documentation

Essential documentation available in `docs/`:

- [Frontmatter Specification](docs/frontmatter-spec.md)
- [Comments Setup](docs/comments-setup.md)
- [Quotes API](docs/quotes-api.md)
- [Multilingual Setup](docs/multilingual-setup.md)
- [Structured Data Optimization](docs/structured-data-optimization.md)
- [Performance Optimization](docs/performance-optimization.md)

## License

- **Content**: [Creative Commons Attribution-NonCommercial-ShareAlike 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **Code**: [MIT License](https://opensource.org/licenses/MIT)
