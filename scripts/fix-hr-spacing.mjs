import { promises as fs } from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd());
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const VALID_EXTENSIONS = new Set(['.md', '.mdx']);

async function listFilesRecursive(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFilesRecursive(fullPath);
      return fullPath;
    }),
  );
  return files.flat();
}

function isContentFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return VALID_EXTENSIONS.has(ext);
}

function fixContent(content) {
  // Normalize to \n for processing; preserve original EOL on write
  const eol = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = content.replaceAll('\r\n', '\n').split('\n');

  let changed = false;
  const out = [];

  // Track if we're in frontmatter at the very top
  let atStart = true;
  let inFrontmatter = false;
  let frontmatterFenceCount = 0;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (atStart) {
      if (line.trim() === '---') {
        inFrontmatter = true;
        frontmatterFenceCount += 1; // opening fence
      } else {
        atStart = false;
      }
    }

    if (inFrontmatter && line.trim() === '---') {
      // closing fence
      if (frontmatterFenceCount === 1) {
        frontmatterFenceCount += 1;
      } else {
        // Unexpected extra fence; ignore
      }
      if (frontmatterFenceCount === 2) {
        inFrontmatter = false;
        atStart = false;
      }
      out.push(line);
      continue;
    }

    if (!inFrontmatter) {
      const trimmed = line.trim();
      const isHrLike = /^-{3,}$/.test(trimmed);

      if (isHrLike) {
        const prevLine = out.length > 0 ? out[out.length - 1] : '';
        const prevIsBlank = prevLine === '' || /^\s*$/.test(prevLine);
        if (!prevIsBlank) {
          out.push(''); // insert blank line before hr
          changed = true;
        }
        out.push(line);
        continue;
      }
    }

    out.push(line);
  }

  return { changed, content: out.join(eol) };
}

async function main() {
  const all = await listFilesRecursive(CONTENT_DIR);
  const targets = all.filter(isContentFile);

  let filesChanged = 0;
  for (const file of targets) {
    const original = await fs.readFile(file, 'utf8');
    const { changed, content } = fixContent(original);
    if (changed) {
      await fs.writeFile(file, content, 'utf8');
      filesChanged += 1;
      process.stdout.write(`fixed: ${path.relative(ROOT, file)}\n`);
    }
  }
  process.stdout.write(`Done. Files changed: ${filesChanged}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
