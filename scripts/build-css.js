const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');

async function buildCss() {
  const inputPath = path.join(__dirname, '../src/app/globals.css');
  const outputPath = path.join(__dirname, '../src/app/compiled.css');

  const inputCss = fs.readFileSync(inputPath, 'utf8');
  const result = await postcss([tailwind()]).process(inputCss, { from: inputPath });

  fs.writeFileSync(outputPath, result.css);
  console.log(`✓ Compiled CSS (${result.css.length} bytes) written to ${outputPath}`);
}

buildCss().catch(console.error);

