
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function convertImages(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      await convertImages(res);
    } else {
      if (res.match(/\.(png|jpg|jpeg)$/)) {
        const webpPath = res.replace(/\.(png|jpg|jpeg)$/, '.webp');
        try {
          await sharp(res)
            .webp({ quality: 80 })
            .toFile(webpPath);
          console.log(`Converted ${res} to ${webpPath}`);
        } catch (error) {
          console.error(`Error converting ${res}:`, error);
        }
      }
    }
  }
}

convertImages(path.join(__dirname, 'public/images'));
