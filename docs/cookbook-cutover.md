# Cookbook cutover

Prepared October 17, 2026. Notes release: 6.35.0.

## Destinations

Family recipes now have a separate public home at https://cookbook.antoniwan.online/.

The migration covers 28 dishes and 40 language-specific pages. Twelve dishes have both English and Spanish pages.

The route manifest is [src/data/cookbookRecipes.json](../src/data/cookbookRecipes.json). Each record retains its original slug and language.

| Old path                   | Destination                                                    |
| -------------------------- | -------------------------------------------------------------- |
| /recipes                   | https://cookbook.antoniwan.online/                             |
| /p/recipes/SLUG            | https://cookbook.antoniwan.online/recipes/SLUG                 |
| /p/recipes/SLUG.md         | https://cookbook.antoniwan.online/recipes/SLUG.md              |
| /blog/recipes/SLUG         | https://cookbook.antoniwan.online/recipes/SLUG                 |
| /blog/recipes/SLUG.md      | https://cookbook.antoniwan.online/recipes/SLUG.md              |
| /p/lemon-pepper-chicken    | https://cookbook.antoniwan.online/recipes/lemon-pepper-chicken |
| /blog/lemon-pepper-chicken | https://cookbook.antoniwan.online/recipes/lemon-pepper-chicken |

The flat chicken aliases also support their Markdown suffix. Redirects preserve query parameters and retain the selected language.

Canonical Notes recipe URLs redirect directly to Cookbook with HTTP 301. The migration rules precede generic alias rules.

The adapter first normalizes trailing-slash URLs with HTTP 308. Legacy domains can first redirect through the canonical Notes host.

These existing normalization steps add permanent redirect hops. They do not change the final recipe, language, or query parameters.

Astro also defines exact redirects from the manifest. The service worker handles migrated recipe requests before reading cached pages.

The namespace redirects do not create missing recipes. A nonexistent Cookbook slug still returns a missing-page response.

## Public collection

The Astro loader excludes src/content/p/recipes/. Historical recipe files, media, and attribution remain in the repository.

Do not publish or revise recipes in that archived folder. Make future recipe changes in the Cookbook repository.

Notes no longer lists recipe records in Everything, search, Markdown exports, llms.txt, or sitemap metadata.

Cooking essays remain in Notes. Kitchen topic pages link directly to Cookbook without maintaining a second recipe count.

The About-page Cookbook link uses the decorative pattern. It no longer displays a borrowed dish photograph.

Authored books and the reading library remain unchanged in this release. Their separate migration is not part of this cutover.

## Continuity checks

Before implementation, the public baseline contained 95 writing URLs and 82 entries in each writing feed.

The baseline also records the ten latest-writing items. Their identifiers, URLs, and publication dates must remain unchanged.

The baseline and production verification receipt are under SOFTHEART: ~/AI/Work/web-properties/.

The existing modification to src/data/.brain-science-cache/meta-analysis.json is outside this release. Do not include it in the release commit.

## Release checks

1. Verify every manifest destination returns HTTP 200 before redirecting its source.
2. Verify the destination language and Markdown endpoint.
3. Run pnpm test.
4. Run pnpm format:check.
5. Run pnpm check.
6. Run pnpm lint.
7. Run pnpm audit-frontmatter.
8. Run pnpm validate-structured-data.
9. Run pnpm check-remark42-rewrite.
10. Run pnpm build.
11. Run pnpm validate-feeds.
12. Run pnpm validate-generated-content.
13. Compare the built writing URLs and feed identifiers with the baseline.
14. Verify the built search and sitemap contain no recipe records.
15. Verify permanent redirects on the production host after release.
16. Test a Spanish recipe, an English recipe, a Markdown URL, and a legacy alias.
17. Verify the Cookbook links in desktop and mobile navigation.

Host-level redirects require a deployed host. The local static preview does not reproduce Vercel routing rules.

The package version changes the service-worker and search-index cache keys. Existing writing still supports the established offline behavior.

The new worker redirects old recipe requests instead of serving cached recipe HTML. Cookbook does not inherit Notes' offline cache.

## Recovery

The pre-cutover Notes source commit is 7df7a0c9ffacdb364a5eb99728e2e282fe846004.

The pre-cutover production deployment is dpl_8ZLuyyhG4VusJ4Tqh2LfeMfxfjmo in the sh-sh-legacy team.

Browser and intermediary caches can retain permanent redirects. A deployment rollback does not clear redirects already cached by clients.

1. Keep Cookbook destinations available during recovery.
2. Restore the previous Notes deployment if the release breaks writing journeys.
3. Restore automatic production assignment after a platform rollback when required.
4. Prepare a source revert for the cutover commit before the next normal deployment.
5. Verify writing, feeds, search, and old recipe links after recovery.

Do not change DNS, security protections, comment configuration, or Panda source notes for this release.
