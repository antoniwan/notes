# Multilingual Content Setup

This guide explains how to create and manage bilingual content using the automatic translation discovery system.

## Overview

The multilingual system is how field notes exist in English and Spanish:

- Publish content in multiple languages (currently English and Spanish)
- Link related translations via shared IDs
- Keep Spanish out of English browse surfaces (Everything, category, tags, homepage, Guided Path, RSS/JSON feeds, Continue reading)
- Let readers reach Spanish from the language toggle on the English note, from title search, from SEO, or via a direct URL
- Display language toggles for easy switching between versions

A Spanish-only site (or subdomain) is later roadmap work. Do not build it here.

## Quick Setup

### 1. Create Translation Pairs

Use the same `translationGroup` value in both language versions:

```yaml
# English version - listed on the English site
---
title: 'My Article'
language: ['en']
featured: true
translationGroup: 'my-unique-article-id'
---
# Spanish version - not listed; reach it from the toggle, search, SEO, or URL
---
title: 'Mi Artículo'
language: ['es']
featured: false
translationGroup: 'my-unique-article-id'
---
```

### 2. Language Settings

- **English**: `language: ["en"]`. `featured: true` puts it on homepage Highlights. Non-featured English still appears in Everything, category, tags, and feeds.
- **Spanish**: `language: ["es"]`. Never listed on English browse surfaces, even if `featured: true`. Both sides of a pair should use `featured: false` unless the English note is a Highlight.
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
Also available in:
🇵🇷 Español
```

That toggle is the in-site browse path to Spanish. Listing cards do not link to Spanish.

### Listing cards

English cards whose `translationGroup` has a public Spanish sibling show an **ES** marker. The card still opens the English note. Spanish is one toggle away.

### Main Listings Behavior

- **English posts** appear in:
  - Homepage highlight masonry (when `featured: true`)
  - Category / tag / everything listings
  - RSS/JSON feeds
  - Guided Path (when eligible)
  - Search
- **Spanish posts** (`language: ["es"]`) are:
  - Accessible via direct URL
  - Discoverable via the language toggle when `translationGroup` is set
  - Discoverable via search (title, description, tags)
  - Indexable for SEO (sitemap, hreflang)
  - Excluded from RSS/JSON feeds, `/everything`, category/tag indexes, homepage Highlights, Guided Path, and Continue reading (via `isListingEligiblePost` / `isFeedEligiblePost`)

**Guided Path** always excludes Spanish posts. Read Spanish via the language toggle on the English note.

Spanish-only notes without an English pair stay indexable with `lang="es"` metadata. They do not appear as listing cards. Add a `translationGroup` only when a real pair exists.

## Technical Implementation

### Components

- **LanguageToggle.astro**: Displays available translations on the post
- **PostCard.astro**: Shows a non-link ES marker when a Spanish twin exists
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

1. **English is the listing language** for this site
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

### Spanish showing in Everything / category / tags

- Spanish is excluded by language, not by `featured`
- Local `astro dev` uses the same listing rule as production for Spanish
- Search can still return Spanish by title

### Missing Language Toggle

- Translation toggle only appears when 2+ translations exist
- Check that posts share the same `translationGroup`
- Verify posts are published and not drafts

## Future Enhancements

Planned features:

- Additional language support
- Language-specific RSS feeds
- A Spanish-only site or subdomain (the inverse of this site). See [roadmap.md](./roadmap.md)
- Content synchronization tools

## Support

For issues or questions about multilingual content:

1. Check this documentation
2. Review example translation pairs in `/src/content/p/`
3. Submit issues via GitHub
