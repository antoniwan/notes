# Multilingual Content Setup

This guide explains how to create and manage bilingual content using the automatic translation discovery system.

## Overview

The multilingual system allows you to:

- Publish content in multiple languages (currently English and Spanish)
- Link related translations via shared IDs
- Keep secondary-language translations out of **feeds, archives, category/tag indexes, Guided Path, and search** (they stay reachable via direct URL + language toggle)
- Display language toggles for easy switching between versions

## Quick Setup

### 1. Create Translation Pairs

Use the same `translationGroup` value in both language versions:

```yaml
# English version - featured in main listings
---
title: 'My Article'
language: ['en']
featured: true
translationGroup: 'my-unique-article-id'
---
# Spanish version - hidden from main listings
---
title: 'Mi Artículo'
language: ['es']
featured: false
translationGroup: 'my-unique-article-id'
---
```

### 2. Language Settings

- **Primary language**: Set `featured: true` (appears in listings)
- **Secondary language**: Set `featured: false` (discoverable via language toggle only)
- **Language array**: Use `["en"]` for English, `["es"]` for Spanish

### 3. Translation Group IDs

Choose descriptive, unique IDs for `translationGroup`:

- `recovery-progress-report`
- `toddler-internet-safety`
- `cooking-fundamentals`

## User Experience

### Language Toggle Display

When readers view a post with translations, they see:

```
🌐 Read in other languages:
🇺🇸 English | 🇪🇸 Español
```

The current language is automatically hidden from the toggle.

### Main Listings Behavior

- **Featured posts** (`featured: true`) appear in:
  - Homepage highlight masonry
  - Category pages (as featured cards)
  - Tag pages
- **Non-featured English posts** (`featured: false`, `language: ["en"]`) remain in:
  - Category / tag / everything listings
  - RSS/JSON feeds (primary-language feed content)
  - Search
- **Secondary-language translations** (`featured: false`, usually `language: ["es"]`) are:
  - Accessible via direct URL
  - Discoverable via language toggle when `translationGroup` is set
  - Excluded from RSS/JSON feeds, `/everything`, category/tag indexes, Guided Path, and search (via `isListingEligiblePost` / `isFeedEligiblePost`)

Spanish-only orphans without an English pair stay indexable with correct `lang="es"` metadata; add a `translationGroup` only when a real pair exists. If a Spanish post should appear in listings/feeds, set `featured: true`.

## Technical Implementation

### Components

- **LanguageToggle.astro**: Displays available translations
- **translationUtils.ts**: Core translation discovery logic
- **BlogLayout.astro**: Integrates language toggle into post layout

### Translation Discovery

The system:

1. Finds all posts with matching `translationGroup`
2. Filters out drafts and unpublished posts
3. Generates language links with appropriate flags
4. Displays toggle only when translations exist

### Type Safety

All translation functionality is fully typed with TypeScript:

```typescript
interface Translation {
  id: string;
  title: string;
  language: string[];
  path: string;
}

interface TranslationData {
  translations: Translation[];
  currentLanguage: string;
  currentPath: string;
  hasTranslations: boolean;
}
```

## Best Practices

### Content Strategy

1. **Choose primary language**: Usually English for wider reach
2. **Consistent translation groups**: Use descriptive, permanent IDs
3. **Complete translations**: Ensure both versions are substantively equivalent
4. **Synchronized publishing**: Publish translations together when possible

### SEO Considerations

- Each language version has its own URL
- Proper `lang` attributes are set automatically
- Search engines index both versions separately
- No duplicate content issues (different languages)

### Writing Guidelines

- **Titles**: Translate meaningfully, not literally
- **Descriptions**: Adapt for cultural context
- **Tags**: Use language-appropriate tags
- **Images**: Can be shared between versions

## Troubleshooting

### Translation Not Appearing

1. Check `translationGroup` values match exactly
2. Verify both posts have `published: true`
3. Ensure neither post has `draft: true`
4. Confirm `language` arrays are correctly set

### Multiple Featured Versions

- Only one version per translation group should have `featured: true`
- Secondary languages should always use `featured: false`

### Missing Language Toggle

- Translation toggle only appears when 2+ translations exist
- Check that posts share the same `translationGroup`
- Verify posts are published and not drafts

## Future Enhancements

Planned features:

- Additional language support
- Language-specific RSS feeds
- Automatic translation status indicators
- Content synchronization tools

## Support

For issues or questions about multilingual content:

1. Check this documentation
2. Review example translation pairs in `/src/content/p/`
3. Submit issues via GitHub
