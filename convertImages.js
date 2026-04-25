
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

// Convert public/images/blog/welcome.jpg
convertImage(
  path.join(__dirname, 'public/images/blog/welcome.jpg'),
  path.join(__dirname, 'public/images/blog/welcome.webp')
);

// Convert public/images/people/ceo.jpg
convertImage(
  path.join(__dirname, 'public/images/people/ceo.jpg'),
  path.join(__dirname, 'public/images/people/ceo.webp')
);

// Convert public/images/tech/databricks.png
convertImage(
  path.join(__dirname, 'public/images/tech/databricks.png'),
  path.join(__dirname, 'public/images/tech/databricks.webp')
);

// Convert public/images/tech/oracle.png
convertImage(
  path.join(__dirname, 'public/images/tech/oracle.png'),
  path.join(__dirname, 'public/images/tech/oracle.webp')
);

// Convert public/images/tech/power-bi.png
convertImage(
  path.join(__dirname, 'public/images/tech/power-bi.png'),
  path.join(__dirname, 'public/images/tech/power-bi.webp')
);

// Convert public/images/tech/sap.png
convertImage(
  path.join(__dirname, 'public/images/tech/sap.png'),
  path.join(__dirname, 'public/images/tech/sap.webp')
);

// Convert public/images/tech/sql.png
convertImage(
  path.join(__dirname, 'public/images/tech/sql.png'),
  path.join(__dirname, 'public/images/tech/sql.webp')
);
