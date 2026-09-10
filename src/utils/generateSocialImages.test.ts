import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { writeManifest } from '../../scripts/generate-social-images.js';

describe('social image manifest generation', () => {
  it('removes mappings whose AVIF source is no longer present', async () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'social-manifest-'));
    const manifestPath = path.join(tempDir, 'socialImageManifest.ts');
    const retained = {
      original: '/images/retained.avif',
      social: '/social/images/retained-social.jpg',
    };
    const removed = {
      original: '/images/removed.avif',
      social: '/social/images/removed-social.jpg',
    };

    await writeManifest([retained, removed], manifestPath);
    await writeManifest([retained], manifestPath);
    const reconciled = fs.readFileSync(manifestPath, 'utf8');

    expect(reconciled).toContain(retained.original);
    expect(reconciled).not.toContain(removed.original);

    await writeManifest([retained], manifestPath);
    expect(fs.readFileSync(manifestPath, 'utf8')).toBe(reconciled);
  });
});
