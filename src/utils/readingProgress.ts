interface ArticleExtent {
  top: number;
  height: number;
}

/** Reading ends when the last line enters the viewport, before comments and navigation. */
export function calculateReadingProgress(
  scrollY: number,
  viewportHeight: number,
  documentHeight: number,
  article?: ArticleExtent,
): number {
  if (![scrollY, viewportHeight, documentHeight].every(Number.isFinite)) return 0;

  let progress: number;

  if (article) {
    if (![article.top, article.height].every(Number.isFinite) || article.height <= 0) return 0;

    const readingDistance = article.height - viewportHeight;
    if (readingDistance <= 0) {
      // A short article is complete once its whole body fits in the viewport.
      return scrollY + viewportHeight >= article.top + article.height ? 100 : 0;
    }
    progress = ((scrollY - article.top) / readingDistance) * 100;
  } else {
    const scrollDistance = documentHeight - viewportHeight;
    if (scrollDistance <= 0) return 0;
    progress = (scrollY / scrollDistance) * 100;
  }

  return Math.min(100, Math.max(0, progress));
}
