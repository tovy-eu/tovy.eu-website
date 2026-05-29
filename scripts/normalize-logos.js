
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Normalizes an SVG string to a tight viewBox (non-square allowed).
 * Also forces all fill/stroke colors to 'currentColor' for monochromatic support.
 */
async function normalizeSvg(svgContent) {
  let normalized = svgContent
    .replace(/fill="[^"]*"/g, 'fill="currentColor"')
    .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
    .replace(/fill:\s*[^;}]*/g, 'fill: currentColor');

  // We use sharp to find the true bounding box
  const buffer = await sharp(Buffer.from(normalized))
    .png()
    .toBuffer();

  const { info } = await sharp(buffer)
    .trim()
    .toBuffer({ resolveWithObject: true });

  const metadata = await sharp(buffer).metadata();
  const viewBoxMatch = normalized.match(/viewBox="([^"]*)"/);
  if (viewBoxMatch) {
    const [vbX, vbY, vbW, vbH] = viewBoxMatch[1].split(/\s+/).map(Number);
    const scaleX = vbW / metadata.width;
    const scaleY = vbH / metadata.height;

    const contentX = vbX + (info.trimOffsetLeft * scaleX);
    const contentY = vbY + (info.trimOffsetTop * scaleY);
    const contentW = info.width * scaleX;
    const contentH = info.height * scaleY;

    // Tight viewBox with 2% padding
    const padX = contentW * 0.02;
    const padY = contentH * 0.02;
    
    normalized = normalized.replace(/viewBox="[^"]*"/, 
      `viewBox="${contentX - padX} ${contentY - padY} ${contentW + (padX * 2)} ${contentH + (padY * 2)}"`);
  }

  normalized = normalized.replace(/\s(width|height)="[^"]*"/g, '');
  return normalized;
}

async function run() {
  const logosDir = path.join(__dirname, '../public/images/logos');
  const peopleDir = path.join(__dirname, '../public/images/people');
  
  if (fs.existsSync(logosDir)) {
    const files = fs.readdirSync(logosDir);
    for (const file of files) {
      const filePath = path.join(logosDir, file);
      if (file.endsWith('.svg')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const normalized = await normalizeSvg(content);
        fs.writeFileSync(filePath, normalized);
        console.log(`Normalized SVG: ${file}`);
      } else if (file.match(/\.(png|jpg|jpeg|webp)$/)) {
        const webpPath = filePath.replace(/\.(png|jpg|jpeg|webp)$/, '.webp');
        try {
          await sharp(filePath)
            .ensureAlpha()
            .trim()
            // RESIZE: Target max 150px width/height for logos (displayed at ~70-80px)
            .resize({
              width: 150,
              height: 150,
              fit: 'inside',
              withoutEnlargement: true
            })
            .extend({
              top: 5, bottom: 5, left: 5, right: 5,
              background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp({ quality: 70, effort: 6 }) // Lower quality for maximum compression
            .toFile(path.join(logosDir, 'temp_' + path.basename(webpPath)));
          fs.renameSync(path.join(logosDir, 'temp_' + path.basename(webpPath)), webpPath);
          console.log(`Optimized & Resized: ${file}`);
        } catch (err) { console.error(err); }
      }
    }
  }

  // Optimize CEO image
  const ceoPath = path.join(peopleDir, 'ceo.webp');
  if (fs.existsSync(ceoPath)) {
    try {
      const tempCeo = path.join(peopleDir, 'temp_ceo.webp');
      await sharp(ceoPath)
        // CEO avatar is displayed at 80x80. Resize to 160x160 for 2x Retina.
        .resize(160, 160, { fit: 'cover' })
        .webp({ quality: 75, effort: 6 })
        .toFile(tempCeo);
      fs.renameSync(tempCeo, ceoPath);
      console.log('Optimized CEO image');
    } catch (err) { console.error(err); }
  }
}

run().catch(console.error);
