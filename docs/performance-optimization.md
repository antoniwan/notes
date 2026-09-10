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

#### Enhanced Image Component

- Implement responsive image sizing with `sizes` attribute
- Use `loading="eager"` for above-the-fold images
- Implement `fetchpriority="high"` for LCP images
- Support AVIF and WebP formats with fallbacks

#### Image Loading Strategy

- **Hero images**: Eager loading with high priority
- **Below-the-fold**: Lazy loading with intersection observer
- **Responsive images**: Multiple sizes for different viewports

### 4. Service Worker Implementation

#### Caching Strategy

- **Static assets**: Cache-first strategy
- **Pages**: Network-first with cache fallback
- **API requests**: Network-first with cache fallback
- **Offline support**: Graceful degradation with offline page

#### Cache Management

- Versioned cache names for easy updates
- Automatic cache cleanup for old versions
- Background sync for offline actions

### 5. Performance Monitoring

#### Core Web Vitals Tracking

- Real-time FCP, LCP, FID, and CLS measurement
- Performance metrics reporting to analytics
- Development debugging panel (Ctrl+Shift+P)

#### Performance Marks

- Service worker registration timing
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

#### Service Worker Status

- Bottom-left indicator in development
- Real-time service worker state
- Update notification system

## Best Practices Implementation

### 1. Astro Blog Best Practices

- **Static Generation**: All pages pre-rendered at build time
- **Image Optimization**: Sharp integration with AVIF/WebP support
- **CSS Strategy**: Critical CSS inlining with async loading
- **Font Strategy**: System font fallbacks with custom font loading
- **Service Worker**: Progressive enhancement with offline support

### 2. Performance-First Approach

- **Critical Path**: Minimize render-blocking resources
- **Resource Priority**: High priority for above-the-fold content
- **Caching Strategy**: Aggressive caching with intelligent invalidation
- **Progressive Enhancement**: Core functionality works without JavaScript

### 3. User Experience Optimization

- **Loading States**: Smooth transitions and animations
- **Offline Support**: Graceful degradation with helpful messaging
- **Update Notifications**: Seamless service worker updates
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

- Update service worker caching strategies
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

#### Service Worker Issues

- Check service worker registration
- Verify cache strategies
- Monitor offline functionality
- Test update mechanisms

### Debug Tools

#### Browser DevTools

- Performance tab for Core Web Vitals
- Network tab for resource loading
- Application tab for service worker
- Console for performance marks

#### Performance Monitoring

- Real-time metrics in development
- Performance debug panel
- Service worker status indicator
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

## Brain Science (build-time cost)

Brain Science pages are **author analytics**, not reader Core Web Vitals surfaces (`noindex`, sitemap-excluded). Cost shows up as **Astro build wall time**, not client LCP.

- **Disk cache:** `src/data/.brain-science-cache/meta-analysis.json` — used only by `/writing-insights/meta`. Signature = `{id, bodyLength, pubDate}`. On load, `postDate` fields are revived to `Date` (JSON would otherwise leave strings and break sorts).
- **In-memory memo (build process):** `getBrainSciencePosts()`, `calculateSentiment()`, and `calculateObjectiveMetrics()` are memoized so the seven Brain Science routes share one collection walk and one objective-metrics pass. Sentiment word regexes are precompiled once. Basic Flesch / word / sentence metrics live in `textAnalysis.ts` (`getBasicTextMetricsForPost`) and are reused across insights, evolution, and patterns.
- **Still page-local:** insights / evolution / patterns still run their own chart loops. Lexicons are shared (`vocabulary.ts`). Further wins mean a single analysis pass, not more copies of word lists.
- **Commit policy:** treat the disk cache like social fingerprints — regenerate on miss, commit when content signatures change so CI stays warm.

`BaseLayout` also memoizes `getSearchData()` for the build process (one search index build, many pages).

See `docs/TECHNICAL-AUDIT.md` for the full system map.

## Conclusion

This performance optimization implementation provides a solid foundation for excellent Core Web Vitals scores while maintaining the high-quality user experience expected from a modern blog. The combination of critical CSS inlining, font optimization, image optimization, and service worker implementation follows Astro best practices and industry standards for performance.

Regular monitoring and continuous improvement will ensure the blog maintains optimal performance as content and features evolve.
