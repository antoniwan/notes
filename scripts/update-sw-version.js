import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const swPath = path.join(rootDir, 'public', 'sw.js');
const pkgPath = path.join(rootDir, 'package.json');

async function main() {
  const [pkgRaw, swRaw] = await Promise.all([
    fs.readFile(pkgPath, 'utf8'),
    fs.readFile(swPath, 'utf8'),
  ]);

  const pkg = JSON.parse(pkgRaw);
  const version = pkg.version || '0.0.0';

  // Use package.json version in cache names
  const newSw = swRaw.replace(
    /const (CACHE_NAME|STATIC_CACHE|DYNAMIC_CACHE) = '.*?';/g,
    (_, name) => {
      const base = name === 'CACHE_NAME' ? 'blog' : name === 'STATIC_CACHE' ? 'static' : 'dynamic';
      return `const ${name} = '${base}-v${version}';`;
    },
  );

  if (newSw !== swRaw) {
    await fs.writeFile(swPath, newSw, 'utf8');
    console.log(`✅ Updated service worker cache names to use version ${version}`);
  } else {
    console.log('ℹ️ Service worker cache names already match expected pattern; no changes made.');
  }
}

main().catch((err) => {
  console.error('❌ Failed to update service worker version:', err);
  process.exit(1);
});
