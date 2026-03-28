/** Returns a youtube-nocookie embed URL, or null if `raw` is not a recognized YouTube watch/share URL. */
export function getYouTubeNocookieEmbedUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim());
    const host = u.hostname.replace(/^www\./, '');
    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`;
      const embed = u.pathname.match(/^\/embed\/([^/?]+)/);
      if (embed?.[1]) return `https://www.youtube-nocookie.com/embed/${embed[1]}`;
      const shorts = u.pathname.match(/^\/shorts\/([^/?]+)/);
      if (shorts?.[1]) return `https://www.youtube-nocookie.com/embed/${shorts[1]}`;
    }
  } catch {
    return null;
  }
  return null;
}
