import { describe, expect, it } from 'vitest';
import { enclosureMimeType, prepareFeedHtml } from './feedHtml';

describe('prepareFeedHtml', () => {
  it('strips scripts, styles, iframes, and event handlers', () => {
    const dirty = `
      <p onclick="alert(1)">Hello</p>
      <script>evil()</script>
      <style>.x{}</style>
      <iframe src="https://evil.example"></iframe>
      <a href="/p/foo">link</a>
      <img src="/images/x.jpg" />
    `;
    const clean = prepareFeedHtml(dirty, 'https://notes.antoniwan.online');
    expect(clean).not.toMatch(/<script/i);
    expect(clean).not.toMatch(/<style/i);
    expect(clean).not.toMatch(/<iframe/i);
    expect(clean).not.toMatch(/onclick=/i);
    expect(clean).toContain('href="https://notes.antoniwan.online/p/foo"');
    expect(clean).toContain('src="https://notes.antoniwan.online/images/x.jpg"');
  });

  it('neutralizes javascript: URLs', () => {
    const clean = prepareFeedHtml('<a href="javascript:alert(1)">x</a>', 'https://example.com');
    expect(clean.toLowerCase()).not.toContain('javascript:');
  });
});

describe('enclosureMimeType', () => {
  it('detects common image types', () => {
    expect(enclosureMimeType('/social/x-social.jpg')).toBe('image/jpeg');
    expect(enclosureMimeType('/social/x-social.png')).toBe('image/png');
    expect(enclosureMimeType('/images/x.avif')).toBe('image/avif');
  });
});
