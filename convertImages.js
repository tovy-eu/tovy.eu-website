
const sharp = require('sharp');
const path = require('path');

async function convertImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ quality: 80 }) // Adjust quality as needed
      .toFile(outputPath);
    console.log(`Converted ${inputPath} to ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error);
  }
}

// Convert public/images/tovy-og-image.png
convertImage(
  path.join(__dirname, 'public/images/tovy-og-image.png'),
  path.join(__dirname, 'public/images/tovy-og-image.webp')
);
