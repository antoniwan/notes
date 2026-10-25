/**
 * Named series: posts that read in order. A post joins one with `series: <id>`
 * in frontmatter (and `seriesOrder` when date order is wrong). Each series gets
 * "Part N of M" links on its posts and a page at `/series/<id>`.
 */
export interface Series {
  id: string;
  title: string;
  /** One or two sentences for the series page and its meta description. */
  description: string;
}

export const series = [
  {
    id: 'game-reviews',
    title: 'Game reviews',
    description:
      'Long looks at the games I sink real hours into: what they do well, what they ask of you, and whether they earn it.',
  },
  {
    id: 'digital-sandbox',
    title: 'The digital sandbox',
    description:
      'Building my own corner of the web by hand, and what each round of building taught me.',
  },
  {
    id: 'stronghand-terminal',
    title: 'The Stronghand terminal',
    description:
      'Shaping a terminal setup from chaos into something I can command, one update at a time.',
  },
] as const satisfies readonly Series[];

export type SeriesId = (typeof series)[number]['id'];

export const seriesIds = series.map((s) => s.id) as [SeriesId, ...SeriesId[]];

export function getSeries(id: string): Series | undefined {
  return series.find((s) => s.id === id);
}
