import { describe, expect, it, vi } from 'vitest';
import { contentDigest, createMemoBySignature, postsSignature } from './buildMemo';

describe('build memo signatures', () => {
  it('changes for same-length content and title edits', () => {
    const base = [{ id: 'post', body: 'calm', data: { title: 'First' } }];

    expect(postsSignature([{ ...base[0], body: 'rage' }])).not.toBe(postsSignature(base));
    expect(postsSignature([{ ...base[0], data: { title: 'Other' } }])).not.toBe(
      postsSignature(base),
    );
  });

  it('is stable across post and tag ordering', () => {
    const first = [
      { id: 'b', body: 'two', data: { title: 'B', tags: ['z', 'a'] } },
      { id: 'a', body: 'one', data: { title: 'A', tags: ['x'] } },
    ];
    const second = [
      { id: 'a', body: 'one', data: { title: 'A', tags: ['x'] } },
      { id: 'b', body: 'two', data: { title: 'B', tags: ['a', 'z'] } },
    ];

    expect(postsSignature(first)).toBe(postsSignature(second));
    expect(contentDigest('same')).toBe(contentDigest('same'));
  });

  it('reuses only an unchanged signature', () => {
    const compute = vi.fn((items: string[]) => items.join(','));
    const memoized = createMemoBySignature<string[], string>((items) => items.join('|'), compute);

    expect(memoized(['a'])).toBe('a');
    expect(memoized(['a'])).toBe('a');
    expect(memoized(['b'])).toBe('b');
    expect(compute).toHaveBeenCalledTimes(2);
  });
});
