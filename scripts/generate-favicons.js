import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicons() {
  const svgPath = path.join(__dirname, '../public/favicon.svg');
  const publicDir = path.join(__dirname, '../public');

  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Generate favicon.ico (32x32)
    console.log('Generating favicon.ico...');
    const favicon32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();

    // Create ICO file (simplified - in production you'd want a proper ICO library)
    // For now, we'll create a 32x32 PNG as favicon.ico
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), favicon32);

    // Generate apple-touch-icon.png (180x180)
    console.log('Generating apple-touch-icon.png...');
    const appleTouchIcon = await sharp(svgBuffer).resize(180, 180).png().toBuffer();
    fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchIcon);

    // Generate additional sizes for better PWA support
    console.log('Generating additional favicon sizes...');

    // 192x192 for PWA
    const favicon192 = await sharp(svgBuffer).resize(192, 192).png().toBuffer();
    fs.writeFileSync(path.join(publicDir, 'favicon-192x192.png'), favicon192);

    // 512x512 for PWA
    const favicon512 = await sharp(svgBuffer).resize(512, 512).png().toBuffer();
    fs.writeFileSync(path.join(publicDir, 'favicon-512x512.png'), favicon512);

    console.log('✅ Favicon files generated successfully!');
    console.log('Generated files:');
    console.log('- favicon.ico (32x32)');
    console.log('- apple-touch-icon.png (180x180)');
    console.log('- favicon-192x192.png');
    console.log('- favicon-512x512.png');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
