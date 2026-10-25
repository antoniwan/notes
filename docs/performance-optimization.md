# Performance Optimization Guide

## Overview

This document outlines the performance optimizations implemented for the Blog to improve First Contentful Paint (FCP) and Largest Contentful Paint (LCP) metrics, following Astro blog best practices.

> **Accuracy note — 2026-09-10.** Parts of this guide describe intended practice
> rather than verified current behavior, and no field Core Web Vitals data backs
> the targets below. The font, testing-command, and image sections were corrected
> against the code on this date. Treat the remaining sections as guidance to
> re-verify before citing, and measure before claiming an improvement.

## Core Web Vitals Targets

- **FCP (First Contentful Paint)**: < 1.8s (Good), < 3.0s (Needs Improvement)
- **LCP (Largest Contentful Paint)**: < 2.5s (Good), < 4.0s (Needs Improvement)
- **FID (First Input Delay)**: < 100ms (Good), < 300ms (Needs Improvement)
- **CLS (Cumulative Layout Shift)**: < 0.1 (Good), < 0.25 (Needs Improvement)

## Implemented Optimizations

### 1. Font Loading Optimization

#### Fonts actually in use

Fonts are configured through Astro's `fonts` integration in `astro.config.mjs`, not
hand-written `@font-face` rules. The four families are **DM Sans**, **Fraunces**,
**Source Serif 4**, and **JetBrains Mono**. (Earlier revisions of this document
named Open Sans and Source Serif Pro; neither is in the project.)

Astro emits the `@font-face` rules, fallback metrics, and preload hints for the
subsets it decides are needed. Do not add parallel `@font-face` declarations —
they would compete with what the integration generates.

A build copies 41 font files into the output. That is the number of files
generated across families, weights, and subsets; it is **not** the number any
single page downloads. Measure real font transfer per route before treating it as
a problem.

### 2. Critical CSS Inlining

#### Above-the-Fold CSS

- Inline critical CSS for immediate rendering
- Include essential styles for typography, layout, and theme
- Reduce render-blocking CSS requests

#### CSS Loading Strategy

- **Critical CSS**: Inlined in HTML head
- **Non-critical CSS**: Loaded asynchronously
- **CSS splitting**: Separate critical and non-critical styles

### 3. Image Optimization

#### Responsive hero art (implemented 2026-09-10)

Hero images live in `src/assets/images/` so Astro processes them, and render
through `src/components/HeroImage.astro`, which emits AVIF at 400/800/1200 with
a `sizes` hint per surface. `src/utils/heroImages.ts` holds the widths, the
quality, and the reasoning behind both.

Before this, nothing on the site had a `srcset` at all, so a 390px phone
downloaded the same bytes as a 1440px desktop. Images an arriving visitor
actually loads, mobile:

| Page                           | before    | after  |
| ------------------------------ | --------- | ------ |
| `/everything` (now `/archive`) | ~2,769 KB | 210 KB |
| Home                           | ~691 KB   | 198 KB |
| An article                     | ~347 KB   | 146 KB |

Two caveats worth keeping, because they were nearly reported wrong. A
scroll-to-bottom measurement of `/everything` showed 29 MB before and 1.2 MB
after; that is a real worst case but **not** what a visitor pays on arrival,
because 97 of 107 images are lazy. And Core Web Vitals never measured any of
this: LCP grades the first viewport, so the site scored well throughout. What
improved is data cost for people who scroll or pay per megabyte, plus the
article hero, which was the one eager oversized image on the critical path.

- Use `loading="eager"` for above-the-fold images
- Implement `fetchpriority="high"` for LCP images

#### Image Loading Strategy

- **Hero images**: Eager loading with high priority
- **Below-the-fold**: Lazy loading with intersection observer
- **Responsive images**: Multiple sizes for different viewports

### 4. Service Worker

Retired in 7.8.0. See "No service worker" in the README.

### 5. Performance Monitoring

#### Core Web Vitals Tracking

- Real-time FCP, LCP, FID, and CLS measurement
- Performance metrics reporting to analytics
- Development debugging panel (Ctrl+Shift+P)

#### Performance Marks

- Critical rendering path measurement
- User interaction timing

### 6. Build Optimizations

#### Astro Configuration

- Enable CSS minification and inlining
- Implement code splitting for vendor chunks
- Remove console logs in production
- Enable view transitions for better UX
- Enable experimental queued rendering (`experimental.queuedRendering.enabled = true`) to use Astro's newer queue-based renderer for more efficient builds on large content sets.

#### Vite Optimizations

- CSS source maps disabled in production
- Terser minification with aggressive options
- Manual chunk splitting for better caching
- Dependency pre-bundling optimization

### 7. Resource Hints

#### Preconnect and DNS Prefetch

- Preconnect to external domains (fonts, analytics)
- DNS prefetch for third-party resources
- Resource priority hints for critical assets

#### Preloading Strategy

- Preload critical fonts and images
- Preload above-the-fold resources
- Defer non-critical resource loading

## Performance Testing

### Development Tools

#### Lighthouse CI

```bash
pnpm run lighthouse
pnpm run audit-performance
```

`pnpm run lighthouse` writes an HTML report and `pnpm run audit-performance`
writes performance-only JSON, both under `reports/` (gitignored). Each starts and
stops its own `astro preview` server, so run `pnpm run build` first — they measure
`dist/` and fail if it is missing.

The former `analyze` and `performance` scripts were removed on 2026-09-10: they
shelled out to `@astrojs/vercel/static-build`, which the installed adapter does
not provide, and `performance` ran the full build twice.

### Monitoring in Development

#### Performance Debug Panel

- Press `Ctrl+Shift+P` to toggle
- Real-time Core Web Vitals display
- Color-coded performance status

## Best Practices Implementation

### 1. Astro Blog Best Practices

- **Static Generation**: All pages pre-rendered at build time
- **Image Optimization**: Sharp integration with AVIF/WebP support
- **CSS Strategy**: Critical CSS inlining with async loading
- **Font Strategy**: System font fallbacks with custom font loading

### 2. Performance-First Approach

- **Critical Path**: Minimize render-blocking resources
- **Resource Priority**: High priority for above-the-fold content
- **Caching Strategy**: Aggressive caching with intelligent invalidation
- **Progressive Enhancement**: Core functionality works without JavaScript

### 3. User Experience Optimization

- **Loading States**: Smooth transitions and animations
- **Accessibility**: Screen reader support and keyboard navigation

## Monitoring and Maintenance

### 1. Performance Metrics

#### Core Web Vitals

- Monitor FCP, LCP, FID, and CLS in production
- Set up alerts for performance regressions
- Track performance trends over time

#### User Experience Metrics

- Time to interactive
- First meaningful paint
- Cumulative layout shift
- Input responsiveness

### 2. Regular Audits

#### Monthly Performance Reviews

- Run Lighthouse audits on key pages
- Analyze Core Web Vitals trends
- Identify optimization opportunities
- Review caching effectiveness

#### Quarterly Optimization Updates

- Optimize image formats and sizes
- Review and update critical CSS
- Analyze font loading performance

### 3. Continuous Improvement

#### Performance Budgets

- Set targets for bundle sizes
- Monitor image file sizes
- Track CSS and JavaScript growth
- Maintain performance standards

#### A/B Testing

- Test different optimization strategies
- Measure impact on user engagement
- Validate performance improvements
- Iterate based on results

## Troubleshooting

### Common Issues

#### Font Loading Problems

- Check font preload paths
- Verify font-display settings
- Monitor font loading timing
- Test fallback font rendering

#### Image Performance Issues

- Verify image format support
- Check responsive image sizing
- Monitor image loading priority
- Test lazy loading implementation

### Debug Tools

#### Browser DevTools

- Performance tab for Core Web Vitals
- Network tab for resource loading
- Console for performance marks

#### Performance Monitoring

- Real-time metrics in development
- Performance debug panel
- Console logging for debugging

## Future Optimizations

### 1. Advanced Techniques

#### HTTP/3 Support

- Implement HTTP/3 when available
- Optimize for multiplexing
- Reduce connection overhead

#### Advanced Caching

- Implement stale-while-revalidate
- Add background sync capabilities
- Optimize cache invalidation

#### Performance APIs

- Use Performance Observer API
- Implement user timing measurements
- Add performance budgets

### 2. Emerging Standards

#### Web Vitals

- Monitor new Core Web Vitals
- Implement INP (Interaction to Next Paint)
- Track TTFB improvements

#### Modern Formats

- Evaluate new image formats
- Test new font loading strategies
- Implement new caching APIs

## Build-time memos

`BaseLayout` also memoizes `getSearchData()` for the build process (one search index build, many pages).

See `docs/TECHNICAL-AUDIT.md` for the full system map.

## Conclusion

This performance optimization implementation provides a solid foundation for excellent Core Web Vitals scores while maintaining the high-quality user experience expected from a modern blog. The combination of critical CSS inlining, font optimization, and image optimization follows Astro best practices and industry standards for performance.

Regular monitoring and continuous improvement will ensure the blog maintains optimal performance as content and features evolve.
