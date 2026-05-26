# Graph Report - .  (2026-05-26)

## Corpus Check
- 168 files · ~176,627 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1025 nodes · 1584 edges · 75 communities (61 shown, 14 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 32 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Tag system and vocabulary|Tag system and vocabulary]]
- [[_COMMUNITY_Read state localStorage|Read state localStorage]]
- [[_COMMUNITY_Post frontmatter|Post frontmatter]]
- [[_COMMUNITY_Brain Science metrics|Brain Science metrics]]
- [[_COMMUNITY_Brain Science charts|Brain Science charts]]
- [[_COMMUNITY_Base layout and head|Base layout and head]]
- [[_COMMUNITY_Quotes API|Quotes API]]
- [[_COMMUNITY_Brain Science time series|Brain Science time series]]
- [[_COMMUNITY_RSS JSON feeds|RSS JSON feeds]]
- [[_COMMUNITY_Brain Science insights|Brain Science insights]]
- [[_COMMUNITY_Category pages|Category pages]]
- [[_COMMUNITY_Tag UI components|Tag UI components]]
- [[_COMMUNITY_Library data|Library data]]
- [[_COMMUNITY_Search index|Search index]]
- [[_COMMUNITY_Image rotator|Image rotator]]
- [[_COMMUNITY_Social image build|Social image build]]
- [[_COMMUNITY_Brain Science meta|Brain Science meta]]
- [[_COMMUNITY_Brain Science cadence|Brain Science cadence]]
- [[_COMMUNITY_Docs and governance|Docs and governance]]
- [[_COMMUNITY_Brain Science patterns|Brain Science patterns]]
- [[_COMMUNITY_Mobile nav|Mobile nav]]
- [[_COMMUNITY_Remark42 comments|Remark42 comments]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_scripts|scripts]]
- [[_COMMUNITY_Multilingual translations|Multilingual translations]]
- [[_COMMUNITY_Remark42 comments|Remark42 comments]]
- [[_COMMUNITY_Brain Science (26)|Brain Science (26)]]
- [[_COMMUNITY_json|[json]]]
- [[_COMMUNITY_SEO structured data (28)|SEO structured data (28)]]
- [[_COMMUNITY_Tags and vocabulary (29)|Tags and vocabulary (29)]]
- [[_COMMUNITY_....consts|../../consts]]
- [[_COMMUNITY_Tags and vocabulary (31)|Tags and vocabulary (31)]]
- [[_COMMUNITY_Brain Science (32)|Brain Science (32)]]
- [[_COMMUNITY_Multilingual translations (33)|Multilingual translations (33)]]
- [[_COMMUNITY_Tags and vocabulary (34)|Tags and vocabulary (34)]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_Multilingual translations (36)|Multilingual translations (36)]]
- [[_COMMUNITY_sw.js|sw.js]]
- [[_COMMUNITY_....package.json|../../package.json]]
- [[_COMMUNITY_Brain Science (39)|Brain Science (39)]]
- [[_COMMUNITY_Read state localStorage (40)|Read state localStorage (40)]]
- [[_COMMUNITY_tsconfig.json|tsconfig.json]]
- [[_COMMUNITY_Tags and vocabulary (42)|Tags and vocabulary (42)]]
- [[_COMMUNITY_Cursor Agent Skills Guide|Cursor Agent Skills Guide]]
- [[_COMMUNITY_Performance Optimization Guide|Performance Optimization Guide]]
- [[_COMMUNITY_Tags and vocabulary (45)|Tags and vocabulary (45)]]
- [[_COMMUNITY_RSS and feeds|RSS and feeds]]
- [[_COMMUNITY_test-theme.astro|test-theme.astro]]
- [[_COMMUNITY_chartTheme.ts|chartTheme.ts]]
- [[_COMMUNITY_Brain Science (49)|Brain Science (49)]]
- [[_COMMUNITY_Brain Science (50)|Brain Science (50)]]
- [[_COMMUNITY_shareUtils.ts|shareUtils.ts]]
- [[_COMMUNITY_Post table of contents|Post table of contents]]
- [[_COMMUNITY_generate-favicons.js|generate-favicons.js]]
- [[_COMMUNITY_Remark42 comments (54)|Remark42 comments (54)]]
- [[_COMMUNITY_Remark42 comments (55)|Remark42 comments (55)]]
- [[_COMMUNITY_..componentsPerformanceMonitor.as|../components/PerformanceMonitor.as]]
- [[_COMMUNITY_Read state localStorage (57)|Read state localStorage (57)]]
- [[_COMMUNITY_permissions|permissions]]
- [[_COMMUNITY_RSS and feeds (59)|RSS and feeds (59)]]
- [[_COMMUNITY_defaultCovers.ts|defaultCovers.ts]]
- [[_COMMUNITY_navigation.ts|navigation.ts]]
- [[_COMMUNITY_sentiment.d.ts|sentiment.d.ts]]
- [[_COMMUNITY_extensions.json|extensions.json]]
- [[_COMMUNITY_launch.json|launch.json]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 69|Community 69]]

## God Nodes (most connected - your core abstractions)
1. `../../layouts/BaseLayout.astro` - 48 edges
2. `LocalStorageManager` - 32 edges
3. `Notes Project` - 30 edges
4. `../../layouts/BlogLayout.astro` - 23 edges
5. `scripts` - 17 edges
6. `../components/Comments.astro` - 17 edges
7. `../../components/PostCard.astro` - 17 edges
8. `../components/BaseHead.astro` - 16 edges
9. `../components/ReadStateServiceInit.astro` - 16 edges
10. `../../components/tag/ContentFormPrelude.astro` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Notes Project` --references--> `graphify-out Output Directory`  [EXTRACTED]
  README.md → docs/graphify.md
- `Notes Project` --references--> `GET /api/quotes`  [EXTRACTED]
  README.md → docs/quotes-api.md
- `Notes Project` --references--> `Public API Overview Page /api/`  [EXTRACTED]
  README.md → docs/quotes-api.md
- `Notes Project` --references--> `Schema.org JSON-LD`  [EXTRACTED]
  README.md → docs/structured-data-optimization.md
- `Notes Project` --references--> `Remark42 Comments`  [EXTRACTED]
  README.md → docs/comments-setup.md

## Hyperedges (group relationships)
- **Tag Governance Documentation Cluster** — tag_policy_signal_first, tag_vocabulary_doc, tag_cleanup_assessment, tag_migration_v1, tag_vocabulary_ts, tag_alias_map [INFERRED 0.85]
- **Multilingual Translation System** — multilingual_setup, frontmatter_translation_group, frontmatter_featured, language_toggle_astro, translation_utils_ts, blog_layout_astro [INFERRED 0.85]
- **Cursor Agent Skills Suite** — cursor_agent_skills_doc, skill_astro_webmaster, skill_post_publishing, skill_multilingual_qa, skill_release_gate, skill_brain_science_audit, skill_content_strategy [EXTRACTED 1.00]

## Communities (75 total, 14 thin omitted)

### Community 0 - "Tag system and vocabulary"
Cohesion: 0.06
Nodes (20): constructor(), getAllReadPosts(), getReadData(), init(), isRead(), loadReadPosts(), notifySubscribers(), createReadingDataUpdatedEvent() (+12 more)

### Community 1 - "Read state localStorage"
Cohesion: 0.05
Nodes (40): ../../utils/tag/contentFormTags, ../../utils/tag/preludeTemplates, sizeClasses, colors, ../../components/tag/ContentFormPrelude.astro, ../../components/TagCard.astro, ./TagCloud.astro, ../components/TagDisplay.astro (+32 more)

### Community 2 - "Post frontmatter"
Cohesion: 0.07
Nodes (32): ../../data/categories, ../utils/highlights, ../utils/highlightsLayout, categoryPosts, primaryCategoryPosts, secondaryCategoryPosts, alphabetical, mostWritten (+24 more)

### Community 3 - "Brain Science metrics"
Cohesion: 0.06
Nodes (35): ../data/defaultCovers, ../../utils/categoryUtils, ../../utils/readingTime, ../../utils/tagProcessing, backToTop, categoryName, chapterContent, isRead (+27 more)

### Community 4 - "Brain Science charts"
Cohesion: 0.07
Nodes (33): allAnalyses, evolutionData, evolutionLabels, evolutionMetaFrequency, evolutionSelfAwareness, metaMetrics, mostSelfAware, number (+25 more)

### Community 5 - "Base layout and head"
Cohesion: 0.07
Nodes (30): baseMetrics, emotionalPosts, growthPosts, maslowAnalysis, monthlyPosts, objectiveMetrics, pageInfo, postCountTimeSeries (+22 more)

### Community 6 - "Quotes API"
Cohesion: 0.10
Nodes (28): ../components/post-toc/postToc.client, ../data/searchIndex, ../types/layout, ../utils/relativeReadTime.client, ../../utils/seo, ../utils/structuredData, containerClasses, modal (+20 more)

### Community 7 - "Brain Science time series"
Cohesion: 0.06
Nodes (31): avgMaturityScore, complexityQuarters, complexityTimeSeries, complexityTrends, contentEvolution, currentYear, decliningTopics, earlyCount (+23 more)

### Community 8 - "RSS JSON feeds"
Cohesion: 0.11
Nodes (19): GET(), getKindSearchParam(), KIND_VALUES, parseKindParam(), serializeQuote(), Author, filterQuotesByKind(), getQuoteCountsByKind() (+11 more)

### Community 9 - "Brain Science insights"
Cohesion: 0.13
Nodes (20): ../data/navigation, ../utils/navActive, ../utils/themeEvents, isActive, isPrimaryMobileNavActive(), mobilePrimaryNavigation, subActive, isActive (+12 more)

### Community 10 - "Category pages"
Cohesion: 0.08
Nodes (25): confidentPosts, contentAnalysis, creativeEnergyPosts, emotionalIntensities, emotionalIntensityTimeSeries, emotionalPatterns, emotionalPosts, growthIndicators (+17 more)

### Community 11 - "Tag UI components"
Cohesion: 0.08
Nodes (24): currentYear, earlyQuarters, growingTopics, insightData, { insights, summary }, maslowAnalysis, number, objectiveMetrics (+16 more)

### Community 12 - "Library data"
Cohesion: 0.14
Nodes (17): getSearchData(), PAGE_SEARCH_DATA, getTagCategory(), getTagMetadata(), getTagWeight(), MASLOW_CATEGORIES, TAG_METADATA, TAG_WEIGHTS (+9 more)

### Community 13 - "Search index"
Cohesion: 0.14
Nodes (19): ../../utils/tagVocabulary, CORE_PREFERRED_TAGS, DOMAIN_EXTENSION_TAGS, DOMAIN_EXTENSION_VALUES, PREFERRED_TAGS, TAG_ALIAS_MAP, canonicalTag, getStaticPaths() (+11 more)

### Community 14 - "Image rotator"
Cohesion: 0.10
Nodes (17): ../../data/library, Book, books, BookStatus, libraryStats, rows, searchInput, shelfSelect (+9 more)

### Community 15 - "Social image build"
Cohesion: 0.15
Nodes (14): clearSearch(), constructor(), displayResults(), hideLoading(), hideNoResults(), hideResults(), init(), performSearch() (+6 more)

### Community 16 - "Brain Science meta"
Cohesion: 0.13
Nodes (14): ../config/assets, ../styles/global.css, metaTags, pubDateISO, updatedDateISO, AssetConfig, ../components/BaseHead.astro, Author (+6 more)

### Community 17 - "Brain Science cadence"
Cohesion: 0.18
Nodes (18): __dirname, ensureDir(), __filename, fingerprintPath, generateSocialForFile(), getAvifFiles(), main(), maybeHydrateFingerprintsFromManifest() (+10 more)

### Community 18 - "Docs and governance"
Cohesion: 0.13
Nodes (14): private(), rotators, setupAutoRotation(), setupNavigation(), setupThumbnails(), startAutoRotation(), updateDisplay(), otherTranslations (+6 more)

### Community 19 - "Brain Science patterns"
Cohesion: 0.10
Nodes (18): avgPostsPerMonth, baseMetrics, dayOfWeekChart, dayOfWeekStats, insightData, { insights, summary, balancedAnalysis }, monthlyPosts, monthOfYearChart (+10 more)

### Community 20 - "Mobile nav"
Cohesion: 0.20
Nodes (14): calculateChallengeAreas(), calculateImprovementAreas(), calculatePostingRegularity(), calculateQualityVariance(), calculateSentiment(), calculateTopicConsistency(), SENTIMENT_WORDS, BRAIN_SCIENCE_CONFIG (+6 more)

### Community 21 - "Remark42 comments"
Cohesion: 0.14
Nodes (17): categories.ts, CC BY-NC-SA 4.0 Content License, MIT Code License, heroImage Field, Midjourney OG Image Prompts, GET /api/quotes, Public API Overview Page /api/, Astro 6 Static Site (+9 more)

### Community 22 - "dependencies"
Cohesion: 0.12
Nodes (17): @vercel/speed-insights/astro, dependencies, astro, @astrojs/mdx, @astrojs/rss, @astrojs/sitemap, @astrojs/vercel, js-yaml (+9 more)

### Community 23 - "scripts"
Cohesion: 0.12
Nodes (17): scripts, analyze, astro, audit-performance, build, check, dev, format (+9 more)

### Community 24 - "Multilingual translations"
Cohesion: 0.15
Nodes (12): ../../utils/translationUtils, categoryItems, categoryName, imageAlt, keywords, tableOfContents, generateKeywords(), findTranslations() (+4 more)

### Community 25 - "Remark42 comments"
Cohesion: 0.15
Nodes (12): ../config/comments, ../types/comments, ../utils/remark42.client, initRemark42(), pageUrl, themeObserver, commentsConfig, ../components/Comments.astro (+4 more)

### Community 26 - "Brain Science (26)"
Cohesion: 0.12
Nodes (11): script, contentAnalysis, phasePosts, postsInMonth, postsOnDay, tags, getBrainSciencePosts(), ../../utils/brainScience/statistics (+3 more)

### Community 27 - "[json]"
Cohesion: 0.14
Nodes (15): [astro], editor.defaultFormatter, [css], editor.defaultFormatter, editor.formatOnPaste, editor.formatOnSave, [json], editor.defaultFormatter (+7 more)

### Community 28 - "SEO structured data (28)"
Cohesion: 0.23
Nodes (11): SOCIAL_LINKS, generateImageUrl(), autoDetectFAQSchema(), generateArticleSchema(), generateContentTypeSpecificSchema(), generateEnhancedStructuredData(), generateFAQSchema(), generateHowToSchema() (+3 more)

### Community 29 - "Tags and vocabulary (29)"
Cohesion: 0.24
Nodes (9): ../utils/letterboxd, diaryUrl, stars, [], ../components/LatestWatched.astro, extractPosterFromBlock(), extractTag(), fetchLetterboxdRecent() (+1 more)

### Community 30 - "../../consts"
Cohesion: 0.18
Nodes (10): ../../consts, ../utils/shareUtils, iconSizeClasses, paddingClasses, showHoverBg, sizeClasses, arrow, platforms (+2 more)

### Community 31 - "Tags and vocabulary (31)"
Cohesion: 0.21
Nodes (7): SOCIAL_IMAGE_MANIFEST, detectOGType(), generateCanonicalUrl(), generateImageAlt(), generateMetaTags(), MetaTags, SEOConfig

### Community 32 - "Brain Science (32)"
Cohesion: 0.20
Nodes (7): pageInfo, ../../data/brainScience, BRAIN_SCIENCE_PAGES, BrainScienceConfig, BrainSciencePage, getBrainSciencePage(), ../../components/brain-science/BrainScienceLayout.astro

### Community 33 - "Multilingual translations (33)"
Cohesion: 0.20
Nodes (11): comments.ts Config, Remark42 Comments, featured Field, minutesRead Remark Plugin, showComments Field, Frontmatter Specification, translationGroup Field, Book Library Pages (+3 more)

### Community 34 - "Tags and vocabulary (34)"
Cohesion: 0.18
Nodes (9): ../../data/tags, el, hash, linked, themesEl, getAllTags(), getUncategorizedTags(), existingTags (+1 more)

### Community 35 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, @astrojs/check, eslint, eslint-plugin-astro, prettier, prettier-plugin-astro, prettier-plugin-tailwindcss, @tailwindcss/vite (+3 more)

### Community 36 - "Multilingual translations (36)"
Cohesion: 0.31
Nodes (10): BaseLayout, BlogLayout.astro, graphify.mdc Cursor Rule, Graphify Knowledge Graph, graphify-out Output Directory, LanguageToggle.astro, Multilingual Content Setup, PostCard Component (+2 more)

### Community 37 - "sw.js"
Cohesion: 0.22
Nodes (4): data, options, STATIC_FILES, url

### Community 38 - "../../package.json"
Cohesion: 0.22
Nodes (9): homepage, name, repository, type, url, type, version, ../../package.json (+1 more)

### Community 39 - "Brain Science (39)"
Cohesion: 0.39
Nodes (6): coefficientOfVariation(), correlation(), linearRegression(), mean(), standardDeviation(), variance()

### Community 40 - "Read state localStorage (40)"
Cohesion: 0.29
Nodes (4): currentPostId, progressBar, ReadingTracker, ../components/ReadingProgress.astro

### Community 41 - "tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, strict, strictNullChecks, types, exclude, extends, include

### Community 42 - "Tags and vocabulary (42)"
Cohesion: 0.36
Nodes (8): contentFormTags.ts, TAG_ALIAS_MAP, Tag Cleanup Assessment 2026-04-10, Tag Management Analytics View, Tag Vocabulary Migration v1, Signal-First Tag Policy, Tag Vocabulary Policy, tagVocabulary.ts

### Community 43 - "Cursor Agent Skills Guide"
Cohesion: 0.25
Nodes (8): Cursor Agent Skills Guide, Brain Science Analytics, astro-webmaster-notes Skill, brain-science-audit Skill, content-strategy-map Skill, multilingual-content-qa Skill, post-publishing-workflow Skill, release-quality-gate Skill

### Community 44 - "Performance Optimization Guide"
Cohesion: 0.29
Nodes (7): Core Web Vitals Targets, Offline Fallback Page, Performance Optimization Guide, pnpm Workspace Config, Service Worker Caching, Social Image Generation Pipeline, Sharp Image Processing

### Community 45 - "Tags and vocabulary (45)"
Cohesion: 0.29
Nodes (6): ../../data/tagVocabulary, lowFrequencyTags, nonPreferredTags, sortedTags, { tagCounts, tagWeights, totalTags, totalTagInstances }, topTags

### Community 46 - "RSS and feeds"
Cohesion: 0.29
Nodes (3): FeedValidationResult, JSONFeedItem, RSSItem

### Community 47 - "test-theme.astro"
Cohesion: 0.33
Nodes (4): currentThemeSpan, darkClassStatusSpan, isDark, testToggle

### Community 48 - "chartTheme.ts"
Cohesion: 0.47
Nodes (5): applyDatasetTheme(), DATASET_COLORS_DARK, DATASET_COLORS_LIGHT, getChartOptions(), getChartTheme()

### Community 49 - "Brain Science (49)"
Cohesion: 0.33
Nodes (4): chartData, script, themed, ../../components/brain-science/ScatterChart.astro

### Community 50 - "Brain Science (50)"
Cohesion: 0.40
Nodes (3): chartData, script, ../../components/brain-science/TimeSeriesChart.astro

### Community 52 - "Post table of contents"
Cohesion: 0.83
Nodes (3): initPostToc(), setOpenState(), updateActiveLink()

### Community 54 - "Remark42 comments (54)"
Cohesion: 0.50
Nodes (3): CommentsConfig, Remark42Instance, Window

### Community 56 - "../components/PerformanceMonitor.as"
Cohesion: 0.50
Nodes (3): element, entries, ../components/PerformanceMonitor.astro

### Community 59 - "RSS and feeds (59)"
Cohesion: 0.67
Nodes (3): RSS and JSON Feed, robots.txt Crawl Rules, sitemap-index.xml

## Knowledge Gaps
- **447 isolated node(s):** `name`, `type`, `version`, `type`, `url` (+442 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **14 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `../../layouts/BaseLayout.astro` connect `Quotes API` to `Tag system and vocabulary`, `Read state localStorage`, `Post frontmatter`, `Brain Science metrics`, `Brain Science charts`, `Base layout and head`, `Brain Science time series`, `Brain Science insights`, `Category pages`, `Tag UI components`, `Library data`, `Search index`, `Brain Science meta`, `Brain Science patterns`, `dependencies`, `Multilingual translations`, `Brain Science (26)`, `SEO structured data (28)`, `../../consts`, `Tags and vocabulary (31)`, `../../package.json`, `Read state localStorage (40)`, `Tags and vocabulary (45)`, `test-theme.astro`, `../components/PerformanceMonitor.as`?**
  _High betweenness centrality (0.352) - this node is a cross-community bridge._
- **Why does `../components/ReadStateServiceInit.astro` connect `Tag system and vocabulary` to `Quotes API`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Why does `../../package.json` connect `../../package.json` to `devDependencies`, `../../consts`, `dependencies`, `scripts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Notes Project` (e.g. with `categories.ts` and `socialImageManifest.ts`) actually correct?**
  _`Notes Project` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _449 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Tag system and vocabulary` be split into smaller, more focused modules?**
  _Cohesion score 0.05792349726775956 - nodes in this community are weakly interconnected._
- **Should `Read state localStorage` be split into smaller, more focused modules?**
  _Cohesion score 0.05187074829931973 - nodes in this community are weakly interconnected._