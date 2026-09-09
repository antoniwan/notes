import { describe, expect, it, vi } from 'vitest';
import { getReadingProgress, groupPostsBySeason } from './guidedPath';

function post(id: string, pubDate: string) {
  return { id, data: { pubDate: new Date(pubDate), title: id } };
}

describe('groupPostsBySeason', () => {
  it.each([
    ['2026-02-28T23:59:59.999Z', 'winter-2025'],
    ['2026-03-01T00:00:00.000Z', 'spring-2026'],
    ['2026-05-31T23:59:59.999Z', 'spring-2026'],
    ['2026-06-01T00:00:00.000Z', 'summer-2026'],
    ['2026-08-31T23:59:59.999Z', 'summer-2026'],
    ['2026-09-01T00:00:00.000Z', 'fall-2026'],
    ['2026-11-30T23:59:59.999Z', 'fall-2026'],
    ['2026-12-01T00:00:00.000Z', 'winter-2026'],
  ])('assigns the boundary instant %s to %s', (date, chapterId) => {
    const chapters = groupPostsBySeason([post('boundary', date)]);

    expect(chapters.map((chapter) => chapter.id)).toEqual([chapterId]);
    expect(chapters[0].posts.map((item) => item.id)).toEqual(['boundary']);
  });

  it('uses UTC months regardless of the timestamp offset', () => {
    const chapters = groupPostsBySeason([
      post('utc-summer', '2026-05-31T23:30:00-04:00'),
      post('utc-winter', '2026-03-01T00:30:00+02:00'),
    ]);

    expect(chapters.map((chapter) => [chapter.id, chapter.posts[0].id])).toEqual([
      ['summer-2026', 'utc-summer'],
      ['winter-2025', 'utc-winter'],
    ]);
  });

  it('keeps December, January, and leap day in one winter', () => {
    const chapters = groupPostsBySeason([
      post('december', '2023-12-01T12:00:00Z'),
      post('january', '2024-01-01T00:00:00Z'),
      post('leap-day', '2024-02-29T23:59:59.999Z'),
    ]);

    expect(chapters).toHaveLength(1);
    expect(chapters[0]).toMatchObject({
      id: 'winter-2023',
      title: 'Winter 2023',
      season: 'Winter',
      year: 2023,
    });
    expect(chapters[0].posts.map((item) => item.id)).toEqual(['leap-day', 'january', 'december']);
  });

  it('creates the prior-year winter when the earliest note is in January', () => {
    const earliest = post('earliest', '2020-01-01T00:00:00Z');

    expect(groupPostsBySeason([earliest])).toEqual([
      {
        id: 'winter-2019',
        title: 'Winter 2019',
        year: 2019,
        season: 'Winter',
        posts: [earliest],
      },
    ]);
  });

  it('includes every month exactly once with no overlapping seasons or empty chapters', () => {
    const posts = Array.from({ length: 12 }, (_, month) => ({
      id: `month-${month + 1}`,
      data: { pubDate: new Date(Date.UTC(2026, month, 15, 12)) },
    }));
    const chapters = groupPostsBySeason(posts);

    expect(chapters.map((chapter) => [chapter.id, chapter.posts.map((item) => item.id)])).toEqual([
      ['winter-2026', ['month-12']],
      ['fall-2026', ['month-11', 'month-10', 'month-9']],
      ['summer-2026', ['month-8', 'month-7', 'month-6']],
      ['spring-2026', ['month-5', 'month-4', 'month-3']],
      ['winter-2025', ['month-2', 'month-1']],
    ]);
    expect(chapters.flatMap((chapter) => chapter.posts)).toHaveLength(posts.length);
  });

  it('sorts chapters and their posts newest first without mutating the source', () => {
    const older = post('older-summer', '2026-06-01T11:00:00Z');
    const winter = post('winter', '2025-12-20T09:00:00Z');
    const newer = post('newer-summer', '2026-06-01T15:00:00Z');
    const future = post('future', '2030-03-01T00:00:00Z');
    const posts = Object.freeze([older, winter, newer, future]);
    const originalTimes = posts.map((item) => item.data.pubDate.getTime());
    const chapters = groupPostsBySeason(posts);

    expect(chapters.map((chapter) => chapter.id)).toEqual([
      'spring-2030',
      'summer-2026',
      'winter-2025',
    ]);
    expect(chapters[1].posts).toEqual([newer, older]);
    expect(chapters[1].posts[0]).toBe(newer);
    expect(posts).toEqual([older, winter, newer, future]);
    expect(posts.map((item) => item.data.pubDate.getTime())).toEqual(originalTimes);
  });

  it('keeps the first occurrence of a repeated id even across different dates', () => {
    const first = post('one-note', '2026-04-01T00:00:00Z');
    const duplicate = post('one-note', '2026-07-01T00:00:00Z');
    const chapters = groupPostsBySeason([first, duplicate, first]);

    expect(chapters.map((chapter) => chapter.id)).toEqual(['spring-2026']);
    expect(chapters[0].posts).toEqual([first]);
  });

  it('returns no chapters for an empty collection', () => {
    expect(groupPostsBySeason([])).toEqual([]);
  });

  it('reports invalid publication dates rather than creating an invalid chapter', () => {
    expect(() => groupPostsBySeason([post('invalid-note', 'not-a-date')])).toThrow(
      'Invalid publication date for post "invalid-note"',
    );
  });
});

describe('getReadingProgress', () => {
  it('counts each slug once even when multiple page elements reference the same note', () => {
    const isRead = vi.fn((slug: string) => slug === 'read-note');

    expect(
      getReadingProgress(['read-note', 'unread-note', 'read-note', 'unread-note'], isRead),
    ).toEqual({ total: 2, read: 1, remaining: 1, percentage: 50 });
    expect(isRead.mock.calls).toEqual([['read-note'], ['unread-note']]);
  });

  it('returns zero percent for an empty path without checking read state', () => {
    const isRead = vi.fn(() => true);

    expect(getReadingProgress([], isRead)).toEqual({
      total: 0,
      read: 0,
      remaining: 0,
      percentage: 0,
    });
    expect(isRead).not.toHaveBeenCalled();
  });

  it('rounds partial progress and recognizes completion from current read state', () => {
    const readSlugs = new Set(['one']);
    const slugs = Object.freeze(['one', 'two', 'three']);
    const isRead = (slug: string) => readSlugs.has(slug);

    expect(getReadingProgress(slugs, isRead)).toEqual({
      total: 3,
      read: 1,
      remaining: 2,
      percentage: 33,
    });
    readSlugs.add('two');
    readSlugs.add('three');
    expect(getReadingProgress(slugs, isRead)).toEqual({
      total: 3,
      read: 3,
      remaining: 0,
      percentage: 100,
    });
    readSlugs.clear();
    expect(getReadingProgress(slugs, isRead)).toEqual({
      total: 3,
      read: 0,
      remaining: 3,
      percentage: 0,
    });
    expect(slugs).toEqual(['one', 'two', 'three']);
  });
});
