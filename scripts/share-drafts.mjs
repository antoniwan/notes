// Drafts the "I published something" posts for one note, for Antonio to edit
// and post by hand: Bluesky (300 characters), Threads (500), and a free
// Patreon post. Nothing is sent anywhere.
//
// Usage: pnpm run share-drafts [slug]   (defaults to the newest post)
// Reads dist/client/latest.json, so run it after a build.
import { readFileSync } from 'node:fs';

const feed = JSON.parse(readFileSync('dist/client/latest.json', 'utf8'));
const slug = process.argv[2];
const item = slug ? feed.items.find((i) => i.url.endsWith(`/p/${slug}`)) : feed.items[0];
if (!item) {
  console.error(`share-drafts: no post ${slug} among the ${feed.items.length} newest.`);
  process.exit(1);
}

const fit = (text, limit) =>
  text.length <= limit ? text : `${text.slice(0, limit - 1).trimEnd()}…`;
const link = item.url;

const drafts = {
  'Bluesky (300)': `${fit(`${item.title}. ${item.summary}`, 300 - link.length - 2)}\n\n${link}`,
  'Threads (500)': `${fit(`New on Notes: ${item.title}\n\n${item.summary}`, 500 - link.length - 2)}\n\n${link}`,
  'Patreon (free post)': `${item.title}\n\n${item.summary}\n\nRead it here: ${link}`,
};

for (const [label, text] of Object.entries(drafts)) {
  console.log(`--- ${label}, ${text.length} characters\n${text}\n`);
}
console.log("The link preview uses the post's social card, so no image upload is needed.");
