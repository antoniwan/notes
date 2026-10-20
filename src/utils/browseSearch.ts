import { normalizeCatalogText } from './catalogSearch';

/**
 * Browse's search: the essays Browse lists, matched by title, topic, and
 * description, and by body text through the build-time word index
 * (/browse-words.json). Pure, so the endpoint, the page script, and the tests
 * share one implementation. The header search keeps its own matcher.
 */

export { normalizeCatalogText };

/** Words too common to tell one essay from another, already normalized (no apostrophes). */
export const STOPWORDS: ReadonlySet<string> = new Set(
  (
    'a an and are as at be been but by can could did do does doing for from had has have having ' +
    'he her hers him his how i if in into is it its just me my no nor not of on or our ours she ' +
    'so than that the their theirs them then there these they this those to too us was we were ' +
    'what when where which who whom why will with would you your yours im ive dont doesnt didnt ' +
    'isnt wasnt arent cant wont thats theres youre theyre weve also very'
  ).split(' '),
);

const TITLE_WEIGHT = 4;
const TOPIC_WEIGHT = 2;
const DESCRIPTION_WEIGHT = 1;
/**
 * Added when the whole query is the name of one of the essay's topics, so typing
 * or tapping a topic lists that topic's own essays first.
 */
const TOPIC_NAME_BOOST = 8;

/** Compares by UTF-16 code unit, the order `<` and `startsWith` agree with. */
const byCodeUnit = (a: string, b: string): number => (a < b ? -1 : a > b ? 1 : 0);

/**
 * The words a reader sees in an essay's Markdown or MDX. Code, comments, tags,
 * images, and URLs go; a link keeps its text. Each removal leaves a space so
 * the words on either side stay apart.
 */
export function plainTextFromMarkdown(markdown: string): string {
  return (
    markdown
      // MDX module lines.
      .replace(/^(?:import|export) .*$/gm, ' ')
      // Fenced code runs to its closing fence, or to the end when it never closes.
      .replace(/^ {0,3}(`{3,}|~{3,})[^\n]*\n[\s\S]*?(?:^ {0,3}\1[^\n]*$|(?![\s\S]))/gm, ' ')
      .replace(/(`+)[^`\n][^\n]*?\1/g, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      // HTML and MDX tags. An angle-bracket link destination, <https://…>, goes with them.
      .replace(/<\/?[A-Za-z][^<>]*>/g, ' ')
      .replace(/!\[[^\]]*\]\((?:[^()]|\([^()]*\))*\)/g, ' ')
      .replace(/\[([^\]]*)\]\((?:[^()]|\([^()]*\))*\)/g, '$1')
      .replace(/https?:\/\/\S+/g, ' ')
  );
}

/** An essay's distinct searchable words: two or more characters, no stopwords. */
export function bodyTokens(markdown: string): string[] {
  const tokens = new Set<string>();
  for (const token of normalizeCatalogText(plainTextFromMarkdown(markdown)).split(' ')) {
    if (token.length >= 2 && !STOPWORDS.has(token)) tokens.add(token);
  }
  return [...tokens];
}

/**
 * The shape of /browse-words.json. `s` holds the essays' slugs; `w` maps each
 * word to the ascending positions in `s` of the essays that use it.
 *
 * Keys are written in sorted order, but a JS object lists integer-like keys
 * ('2024') first, so a reader sorts Object.keys(w) itself rather than trusting
 * the parsed order.
 */
export interface WordIndex {
  v: 1;
  s: string[];
  w: Record<string, number[]>;
}

export function buildWordIndex(posts: readonly { slug: string; body: string }[]): WordIndex {
  const postings = new Map<string, number[]>();
  posts.forEach((post, position) => {
    for (const token of bodyTokens(post.body)) {
      const list = postings.get(token);
      if (list) list.push(position);
      else postings.set(token, [position]);
    }
  });
  const entries = [...postings].sort(([a], [b]) => byCodeUnit(a, b));
  return { v: 1, s: posts.map((post) => post.slug), w: Object.fromEntries(entries) };
}

/**
 * The words a query searches for, two or more characters each, repeats once.
 * Stopwords are dropped unless the query is nothing but stopwords ('the who').
 */
export function queryWords(query: string): string[] {
  const words = [...new Set(normalizeCatalogText(query).split(' '))].filter(
    (word) => word.length >= 2,
  );
  const meaningful = words.filter((word) => !STOPWORDS.has(word));
  return [...new Set((meaningful.length > 0 ? meaningful : words).map(pluralStem))];
}

/**
 * A plural query word becomes the start it shares with its singular, so 'poems'
 * also finds 'poem', 'boundaries' finds 'boundary', and 'wishes' finds 'wish'.
 * The stem is a prefix of the plural, so nothing the plural matched is lost.
 * Words ending in 'ss', 'us', or 'is' (loss, focus, crisis) are not plurals.
 */
export function pluralStem(word: string): string {
  if (word.length < 4 || /(ss|us|is)$/.test(word)) return word;
  if (word.endsWith('ies') && word.length >= 7) return word.slice(0, -3);
  if (/(sses|xes|zes|ches|shes)$/.test(word)) return word.slice(0, -2);
  return word.endsWith('s') ? word.slice(0, -1) : word;
}

/**
 * A query word of one or two characters matches only that exact word, so 'ai'
 * never finds 'said' or 'again'. A longer word matches as a prefix, so 'fath'
 * finds 'fatherhood' while 'ship' does not find 'leadership'.
 */
export function tokenMatches(token: string, word: string): boolean {
  return word.length <= 2 ? token === word : token.startsWith(word);
}

export interface BrowseEssay {
  slug: string;
  /** YYYY-MM-DD, so newer first is a string comparison. */
  date: string;
  title: string;
  description: string;
  /** Display names, as getTagMetadata gives them. */
  topics: string[];
  topicSlugs: string[];
}

export interface BrowseSearchInput {
  essays: readonly BrowseEssay[];
  /** The word index once it has loaded. Without it, the body is not searched. */
  index?: WordIndex | null;
  query: string;
  /** A topic slug. Only essays carrying it are searched. */
  topic?: string | null;
}

export interface BrowseSearchResult {
  /** Every word found in the title, a topic, or the description: best score, then newest. */
  named: string[];
  /** At least one word found only in the body: newest first. */
  mentioned: string[];
}

interface IndexLookup {
  keys: string[];
  positions: Map<string, number>;
}

// Sorting about 11,000 keys per keystroke would be wasted work; the index never changes once loaded.
const lookups = new WeakMap<WordIndex, IndexLookup>();

function lookupFor(index: WordIndex): IndexLookup {
  let lookup = lookups.get(index);
  if (!lookup) {
    lookup = {
      keys: Object.keys(index.w).sort(byCodeUnit),
      positions: new Map(index.s.map((slug, position) => [slug, position])),
    };
    lookups.set(index, lookup);
  }
  return lookup;
}

/** Positions in `index.s` of the essays whose body has a word the query word matches. */
function bodyMatches(index: WordIndex, word: string): Set<number> {
  const { keys } = lookupFor(index);
  // Lower bound: the first key not before the word. Every key the word prefixes follows it in one
  // run, and a whole-word match for a short word can only be that first key.
  let low = 0;
  let high = keys.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (keys[middle] < word) low = middle + 1;
    else high = middle;
  }
  const hits = new Set<number>();
  for (let i = low; i < keys.length && tokenMatches(keys[i], word); i++) {
    for (const position of index.w[keys[i]]) hits.add(position);
  }
  return hits;
}

const tokensOf = (text: string): string[] => normalizeCatalogText(text).split(' ');

const byNewest = (a: BrowseEssay, b: BrowseEssay): number =>
  byCodeUnit(b.date, a.date) || byCodeUnit(a.slug, b.slug);

/**
 * Every query word must match somewhere. For each word, the first field that
 * has it sets its weight: title 4, topic 2, description 1, body 0. With a topic
 * and no words, the topic's essays come back newest first; with neither, nothing.
 */
export function searchEssays({
  essays,
  index = null,
  query,
  topic = null,
}: BrowseSearchInput): BrowseSearchResult {
  const pool = topic ? essays.filter((essay) => essay.topicSlugs.includes(topic)) : [...essays];
  const words = queryWords(query);
  if (words.length === 0) {
    return { named: topic ? pool.sort(byNewest).map((essay) => essay.slug) : [], mentioned: [] };
  }

  const wholeQuery = normalizeCatalogText(query);
  const positions = index ? lookupFor(index).positions : null;
  const bodyHits = index ? words.map((word) => bodyMatches(index, word)) : [];
  const named: { essay: BrowseEssay; score: number }[] = [];
  const mentioned: BrowseEssay[] = [];

  for (const essay of pool) {
    const title = tokensOf(essay.title);
    const topicNames = essay.topics.map(normalizeCatalogText);
    const topics = topicNames.flatMap((name) => name.split(' '));
    const description = tokensOf(essay.description);
    const position = positions?.get(essay.slug);
    let score = 0;
    let bodyOnly = false;

    const everyWord = words.every((word, i) => {
      const has = (tokens: string[]) => tokens.some((token) => tokenMatches(token, word));
      if (has(title)) score += TITLE_WEIGHT;
      else if (has(topics)) score += TOPIC_WEIGHT;
      else if (has(description)) score += DESCRIPTION_WEIGHT;
      else if (position !== undefined && bodyHits[i].has(position)) bodyOnly = true;
      else return false;
      return true;
    });
    if (!everyWord) continue;

    if (bodyOnly) {
      mentioned.push(essay);
    } else {
      const boost = topicNames.includes(wholeQuery) ? TOPIC_NAME_BOOST : 0;
      named.push({ essay, score: score + boost });
    }
  }

  return {
    named: named
      .sort((a, b) => b.score - a.score || byNewest(a.essay, b.essay))
      .map(({ essay }) => essay.slug),
    mentioned: mentioned.sort(byNewest).map((essay) => essay.slug),
  };
}
