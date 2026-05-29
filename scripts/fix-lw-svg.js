
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function fixLwLogo() {
  const lwPath = path.join(__dirname, '../public/images/logos/lw.svg');
  const svgContent = fs.readFileSync(lwPath, 'utf8');

  // Render to a large PNG to find the bounding box
  const buffer = await sharp(Buffer.from(svgContent))
    .png()
    .toBuffer();

  const { info } = await sharp(buffer)
    .trim()
    .toBuffer({ resolveWithObject: true });

  // sharp's trim info gives: top, left, width, height of the content
  // We also need the original dimensions to map back
  const metadata = await sharp(buffer).metadata();
  
  // Original viewBox
  const viewBoxMatch = svgContent.match(/viewBox="([^"]*)"/);
  if (!viewBoxMatch) return;
  const [vbX, vbY, vbW, vbH] = viewBoxMatch[1].split(/\s+/).map(Number);

  // Map trim boxes back to viewBox coordinates
  const scaleX = vbW / metadata.width;
  const scaleY = vbH / metadata.height;

  const contentX = vbX + (info.trimOffsetLeft * scaleX);
  const contentY = vbY + (info.trimOffsetTop * scaleY);
  const contentW = info.width * scaleX;
  const contentH = info.height * scaleY;

  // Now create a square viewBox around this content with 5% padding
  const maxDim = Math.max(contentW, contentH);
  const pad = maxDim * 0.05;
  const size = maxDim + (pad * 2);

  const newMinX = contentX - (size - contentW) / 2;
  const newMinY = contentY - (size - contentH) / 2;

  const normalized = svgContent
    .replace(/viewBox="[^"]*"/, `viewBox="${newMinX} ${newMinY} ${size} ${size}"`)
    .replace(/\s(width|height)="[^"]*"/g, '');

  fs.writeFileSync(lwPath, normalized);
  console.log(`Updated LW SVG viewBox: ${newMinX} ${newMinY} ${size} ${size}`);
}

fixLwLogo().catch(console.error);
