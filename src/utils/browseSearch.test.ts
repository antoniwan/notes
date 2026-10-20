import { describe, expect, it } from 'vitest';
import {
  bodyTokens,
  buildWordIndex,
  normalizeCatalogText,
  plainTextFromMarkdown,
  queryWords,
  searchEssays,
  STOPWORDS,
  tokenMatches,
  type BrowseEssay,
  type BrowseSearchInput,
} from './browseSearch';

const essay = (fields: Partial<BrowseEssay> & Pick<BrowseEssay, 'slug'>): BrowseEssay => ({
  date: '2026-01-01',
  title: '',
  description: '',
  topics: [],
  topicSlugs: [],
  ...fields,
});

describe('plainTextFromMarkdown', () => {
  it('strips code, comments, tags, images, and URLs and keeps link text', () => {
    const text = plainTextFromMarkdown(
      [
        "import { Image } from 'astro:assets';",
        'export const frontmatterNote = 1;',
        '',
        'Read [the long letter](https://example.com/letter "Letter") twice.',
        '![A pier at dawn](../../assets/pier.avif)',
        'See [Leadership](<https://en.wikipedia.org/wiki/Leadership_(book)>) and https://example.com/raw?x=1 here.',
        'Run `pnpm install` first. <!-- hidden note -->',
        '<Image src={img1} alt="harbor" />',
        '<p class="lead">Kept words</p>',
        '```js',
        'const secret = 1;',
        '```',
        'After the fence.',
      ].join('\n'),
    );

    expect(text).toContain('Read the long letter twice.');
    expect(text).toContain('See Leadership and');
    expect(text).toContain('Kept words');
    expect(text).toContain('After the fence.');
    for (const gone of [
      'import',
      'astro',
      'frontmatterNote',
      'example',
      'https',
      'Letter"',
      'pier',
      'avif',
      'wikipedia',
      'raw',
      'pnpm',
      'hidden',
      'Image',
      'harbor',
      'class',
      'secret',
    ]) {
      expect(text, gone).not.toContain(gone);
    }
  });

  it('drops a fence that never closes through to the end', () => {
    expect(plainTextFromMarkdown('Before.\n\n```\nconst left = open;')).not.toContain('left');
  });
});

describe('bodyTokens', () => {
  it('keeps distinct words of two or more characters that are not stopwords', () => {
    expect(bodyTokens("The father's Café, the café; I x")).toEqual(['fathers', 'cafe']);
  });

  it('uses the 96-word stopword list, normalized like the text', () => {
    expect(STOPWORDS.size).toBe(96);
    for (const word of STOPWORDS) expect(normalizeCatalogText(word)).toBe(word);
  });
});

describe('buildWordIndex', () => {
  const index = buildWordIndex([
    { slug: 'one', body: 'Zebra crossings and the apple orchard.' },
    { slug: 'two', body: 'An apple, a zebra, and a mango.' },
    { slug: 'three', body: 'Mango season was very short.' },
  ]);

  it('lists slugs in input order with sorted keys and ascending postings', () => {
    expect(index.v).toBe(1);
    expect(index.s).toEqual(['one', 'two', 'three']);
    const keys = Object.keys(index.w);
    expect(keys).toEqual([...keys].sort());
    expect(index.w.apple).toEqual([0, 1]);
    expect(index.w.mango).toEqual([1, 2]);
    expect(index.w.zebra).toEqual([0, 1]);
    for (const postings of Object.values(index.w)) {
      expect(postings).toEqual([...postings].sort((a, b) => a - b));
    }
  });

  it('has no stopword keys', () => {
    for (const word of STOPWORDS) expect(Object.hasOwn(index.w, word), word).toBe(false);
  });

  it('indexes words that are also Object.prototype names', () => {
    expect(buildWordIndex([{ slug: 'one', body: 'The constructor.' }]).w).toEqual({
      constructor: [0],
    });
  });
});

describe('queryWords', () => {
  it('drops stopwords and words under two characters, and keeps each word once', () => {
    expect(queryWords('The Tao')).toEqual(['tao']);
    expect(queryWords('Sí, llegó! a b')).toEqual(['si', 'llego']);
    expect(queryWords('dad dad')).toEqual(['dad']);
  });

  it('keeps the stopwords when nothing else is left', () => {
    expect(queryWords('the who')).toEqual(['the', 'who']);
    expect(queryWords('a ?')).toEqual([]);
  });
});

describe('tokenMatches', () => {
  it('matches a one or two character word only whole', () => {
    expect(tokenMatches('ai', 'ai')).toBe(true);
    expect(tokenMatches('said', 'ai')).toBe(false);
    expect(tokenMatches('aim', 'ai')).toBe(false);
  });

  it('matches a longer word as a prefix only', () => {
    expect(tokenMatches('fatherhood', 'fath')).toBe(true);
    expect(tokenMatches('ship', 'ship')).toBe(true);
    expect(tokenMatches('leadership', 'ship')).toBe(false);
  });
});

describe('searchEssays', () => {
  const search = (
    essays: BrowseEssay[],
    query: string,
    extra: Pick<BrowseSearchInput, 'index' | 'topic'> = {},
  ) => searchEssays({ essays, query, ...extra });

  it("does not find 'ai' inside 'said' or 'again', in metadata or the body", () => {
    const essays = [
      essay({ slug: 'said-again', title: 'He Said It Again', description: 'The pain, again.' }),
      essay({ slug: 'ai-notes', title: 'Notes', topics: ['AI'], topicSlugs: ['ai'] }),
    ];
    const index = buildWordIndex([
      { slug: 'said-again', body: 'He said it again and again.' },
      { slug: 'ai-notes', body: 'Nothing here.' },
    ]);
    expect(search(essays, 'ai', { index })).toEqual({ named: ['ai-notes'], mentioned: [] });
  });

  it("matches 'fath' to 'fatherhood' and not 'ship' to 'leadership'", () => {
    const essays = [
      essay({ slug: 'fatherhood', title: 'Fatherhood in Real Time' }),
      essay({ slug: 'leadership', title: 'On Leadership' }),
    ];
    expect(search(essays, 'fath').named).toEqual(['fatherhood']);
    expect(search(essays, 'ship').named).toEqual([]);
  });

  it('folds accents and case', () => {
    const essays = [
      essay({ slug: 'rodriguez', title: 'A Letter to Ana Rodríguez' }),
      essay({ slug: 'trickle-down', title: 'El Trickle Down Sí Llegó' }),
    ];
    expect(search(essays, 'rodriguez').named).toEqual(['rodriguez']);
    expect(search(essays, 'si llego').named).toEqual(['trickle-down']);
  });

  it('requires every word, in any order and any field', () => {
    const essays = [
      essay({ slug: 'both', title: 'Puerto Rico', description: 'Where the money went.' }),
      essay({ slug: 'one', title: 'Puerto Rico at Dawn' }),
    ];
    expect(search(essays, 'money puerto').named).toEqual(['both']);
  });

  it('ranks a query with stopwords like the same query without them', () => {
    const essays = [
      essay({ slug: 'tao', date: '2026-09-15', title: 'Briefly, on the Tao' }),
      essay({ slug: 'way', date: '2026-10-01', description: 'Notes on the Tao and water.' }),
      essay({ slug: 'other', title: 'The Other Thing' }),
    ];
    expect(search(essays, 'the tao')).toEqual(search(essays, 'tao'));
    expect(search(essays, 'tao').named).toEqual(['tao', 'way']);
  });

  it('weighs title over topic over description, and puts body-only hits in mentioned', () => {
    const essays = [
      essay({ slug: 'in-body', date: '2026-04-01', title: 'Summer' }),
      essay({ slug: 'in-description', date: '2026-03-01', description: 'On grief, in summer.' }),
      essay({ slug: 'in-topic', date: '2026-02-01', topics: ['Grief Work'] }),
      essay({ slug: 'in-title', date: '2026-01-01', title: 'The Rhythm of Grief' }),
      essay({ slug: 'nowhere', date: '2026-05-01', title: 'Winter' }),
    ];
    const index = buildWordIndex([
      { slug: 'in-body', body: 'A summer of grief.' },
      { slug: 'nowhere', body: 'Snow.' },
    ]);
    expect(search(essays, 'grief', { index })).toEqual({
      named: ['in-title', 'in-topic', 'in-description'],
      mentioned: ['in-body'],
    });
    // Without the index the body is not searched.
    expect(search(essays, 'grief').mentioned).toEqual([]);
  });

  it('sums word weights, then orders ties newest first and then by slug', () => {
    const essays = [
      essay({ slug: 'b-tied', date: '2025-01-01', title: 'Grief' }),
      essay({ slug: 'a-tied', date: '2025-01-01', title: 'Grief' }),
      essay({ slug: 'newer', date: '2026-01-01', title: 'Grief' }),
      essay({ slug: 'summed', date: '2024-01-01', title: 'Grief', description: 'One summer.' }),
    ];
    expect(search(essays, 'grief').named).toEqual(['newer', 'a-tied', 'b-tied', 'summed']);
    expect(search(essays, 'grief summer').named).toEqual(['summed']);
  });

  it('lists the essays of a topic first when the query is that topic name', () => {
    const essays = [
      essay({ slug: 'title-only', date: '2026-01-01', title: 'Notes on Puerto Rico' }),
      essay({
        slug: 'tagged',
        date: '2024-01-01',
        title: 'Sofrito Sundays',
        topics: ['Puerto Rico'],
        topicSlugs: ['puerto-rico'],
      }),
    ];
    expect(search(essays, 'Puerto  Rico').named).toEqual(['tagged', 'title-only']);
    // Only the whole name earns the boost.
    expect(search(essays, 'puerto').named).toEqual(['title-only', 'tagged']);
  });

  it('orders mentioned essays newest first, then by slug', () => {
    const essays = [
      essay({ slug: 'b', date: '2025-01-01' }),
      essay({ slug: 'a', date: '2025-01-01' }),
      essay({ slug: 'c', date: '2026-01-01' }),
    ];
    const index = buildWordIndex([
      { slug: 'a', body: 'Money.' },
      { slug: 'b', body: 'Money.' },
      { slug: 'c', body: 'Moneyed.' },
    ]);
    expect(search(essays, 'money', { index })).toEqual({ named: [], mentioned: ['c', 'a', 'b'] });
  });

  it('finds body words whose keys an object would reorder or inherit', () => {
    const essays = [essay({ slug: 'one' }), essay({ slug: 'two' })];
    const index = buildWordIndex([
      { slug: 'one', body: 'In 1984 the constructor came.' },
      { slug: 'two', body: 'At 20 the apple fell.' },
    ]);
    expect(search(essays, '198', { index }).mentioned).toEqual(['one']);
    expect(search(essays, '20', { index }).mentioned).toEqual(['two']);
    expect(search(essays, 'constructor', { index }).mentioned).toEqual(['one']);
    expect(search(essays, 'valueof', { index }).mentioned).toEqual([]);
  });

  it('filters to a topic, with and without a query', () => {
    const essays = [
      essay({
        slug: 'hair',
        date: '2024-05-01',
        title: 'An Hour of Hair Brushing',
        description: 'What my daughter taught me about time.',
        topics: ['Fatherhood'],
        topicSlugs: ['fatherhood'],
      }),
      essay({
        slug: 'phrases',
        date: '2026-08-27',
        title: 'What Phrases Did Your Dad Install On You?',
        topics: ['Fatherhood', 'Family'],
        topicSlugs: ['fatherhood', 'family'],
      }),
      essay({ slug: 'clock', date: '2026-09-01', title: 'Time' }),
    ];
    expect(search(essays, '', { topic: 'fatherhood' })).toEqual({
      named: ['phrases', 'hair'],
      mentioned: [],
    });
    expect(search(essays, 'time', { topic: 'fatherhood' }).named).toEqual(['hair']);
    expect(search(essays, 'time').named).toEqual(['clock', 'hair']);
    expect(search(essays, '', { topic: 'grief' }).named).toEqual([]);
  });

  it('returns nothing with no topic and no words', () => {
    const essays = [essay({ slug: 'one', title: 'One' })];
    expect(search(essays, '')).toEqual({ named: [], mentioned: [] });
    expect(search(essays, ' a ')).toEqual({ named: [], mentioned: [] });
  });
});
