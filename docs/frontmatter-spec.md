# Frontmatter Specification

This document defines the frontmatter format for all blog posts in the Blog.

## Reading Time System

**Automatic Calculation**: Reading times are now automatically calculated using an Astro remark plugin that analyzes the actual content length. This provides accurate, consistent reading time estimates across all posts.

**Legacy Cleanup**: All manual `readingTime` fields have been removed from existing content. Reading times are now exclusively calculated automatically.

**Field Priority**: The system uses `minutesRead` (automatic) for all reading time calculations.

## Required Fields

### `title` (string)

The main title of the blog post

```yaml
title: 'The Underrated Superfood: Why Beef Heart Should Be on Your Plate'
```

### `description` (string)

A concise summary of the post content (150-160 characters for SEO)

```yaml
description: 'Nutritional comparison of beef heart with common meats, showing its iron, B12, zinc, and CoQ10 content.'
```

### `pubDate` (date)

Publication date in ISO 8601 format

```yaml
pubDate: '2025-05-01T16:45:00.000Z'
```

### `language` (array)

Language(s) of the post content

```yaml
language: ['en'] # or ["es"] or ["en", "es"]
```

## Optional Fields

### `updatedDate` (date)

Last modification date in ISO 8601 format

```yaml
updatedDate: '2025-05-15T10:30:00.000Z'
```

### `heroImage` (string)

Primary image for social sharing and post display

```yaml
heroImage: '/images/beef-heart-comparison-chart.png'
```

### `category` (array)

Main categories for the post

```yaml
category: ['integration-growth', 'learning-projects']
```

For film and TV reviews, include **`media-reviews`** (see [Media review template](#media-review-template-media-review-posts)).

### `subcategory` (string)

Specific subcategory for the post

```yaml
subcategory: 'Nutrition'
```

### `tags` (array)

Keywords and topics for the post

```yaml
tags: ['nutrition', 'health', 'wellness', 'cooking']
```

### `readingTime` (removed)

This field has been removed. Reading times are now automatically calculated using the remark plugin.

### `minutesRead` (string, optional)

Automatically calculated reading time from the remark plugin. This field is generated during build time and should not be manually edited.

```yaml
minutesRead: '3 min read'
```

### `draft` (boolean)

Whether the post is a draft (not ready for publication)

```yaml
draft: false
```

### `featured` (boolean)

Whether the post should be featured on the homepage

```yaml
featured: false
```

### `published` (boolean)

Whether the post is published and should appear in production builds. Defaults to `true` if not specified.

```yaml
published: true
```

### `translationGroup` (string, optional)

Unique identifier for linking related translations across languages. Posts with the same `translationGroup` value are automatically linked and display language toggles.

```yaml
translationGroup: 'recovery-progress-report'
```

See [Multilingual Setup](multilingual-setup.md) for detailed information on creating translation pairs.

### `showComments` (boolean, optional)

Whether to display the comments section on the post. Defaults to `true` if not specified.

```yaml
showComments: true
```

To disable comments on a specific post:

```yaml
showComments: false
```

## Media review template (`media-review` posts)

Use these fields when `template: media-review` so the post renders with the media review layout (poster-led hero, optional trailer, optional Letterboxd activity). Omit `template` (or use any value other than `media-review`) for normal editorial posts.

### Required when `template: media-review`

| Field         | Type                   | Description                                            |
| ------------- | ---------------------- | ------------------------------------------------------ |
| `template`    | literal `media-review` | Selects the media review layout.                       |
| `mediaType`   | `film` or `tv`         | Drives the Film/TV label.                              |
| `workTitle`   | string                 | Title of the work reviewed (e.g. film or series name). |
| `releaseYear` | number (integer)       | Primary release year.                                  |

### Optional (media reviews)

| Field         | Type         | Description                                                             |
| ------------- | ------------ | ----------------------------------------------------------------------- |
| `seasonLabel` | string       | For TV, e.g. `Season 1`.                                                |
| `trailerUrl`  | string (URL) | Trailer link; YouTube URLs embed via youtube-nocookie with no autoplay. |
| `heroImage`   | string       | Poster image path or absolute URL (also used for social preview).       |
| `imageAlt`    | string       | Poster alt text.                                                        |

### Example (media review)

```yaml
---
title: 'Send Help — panic in plain sight'
description: 'Notes on Send Help (2026): tone, survival comedy, and the third act.'
pubDate: '2026-03-20T12:00:00.000Z'
language: ['en']
template: media-review
mediaType: film
workTitle: 'Send Help'
releaseYear: 2026
category: ['media-reviews', 'culture']
tags: ['film', 'review']
heroImage: '/images/2026/send-help-2026.avif'
imageAlt: 'Theatrical poster for Send Help (2026)'
# trailerUrl: 'https://www.youtube.com/watch?v=...'  # optional
---
```

## Complete Example

```yaml
---
title: 'The Underrated Superfood: Why Beef Heart Should Be on Your Plate'
description: 'Nutritional comparison of beef heart with common meats, showing its iron, B12, zinc, and CoQ10 content.'
pubDate: '2025-05-01T16:45:00.000Z'
language: ['en']
heroImage: '/images/beef-heart-comparison-chart.png'
category: ['integration-growth']
subcategory: 'Nutrition'
tags: ['nutrition', 'health', 'wellness', 'cooking', 'beef-heart']
# minutesRead: "3 min read"  # Automatically calculated
draft: false
featured: false
published: true
showComments: true
# translationGroup: 'unique-group-id'  # Optional: for multilingual content
---
```

## Available Categories

- **art-expression** - Creative content and aesthetic exploration
- **culture** - Social norms, collective behavior, and cultural critique
- **diy-creation** - Physical builds and handmade projects
- **integration-growth** - Personal development and consciousness
- **learning-projects** - Documentation of skill development
- **media-reviews** - Film and TV reviews (use with `template: media-review`)
- **metaspace** - Reflections on the journey itself
- **parenting** - Family dynamics and child development
- **politics** - Social structures and power dynamics
- **psychology** - Human behavior and mental processes
- **systems-strategy** - Technical and organizational systems
