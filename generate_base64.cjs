const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'src', 'assets', 'images');
const images = {
  annuaireCleanNetwork: 'annuaire_clean_network.jpg',
  dgfipLogoImg: 'dgfip_logo.jpg',
  ninkasiLogoImg: 'ninkasi_logo.jpg',
  antoineBouetImg: 'antoine_bouet.png',
  brunoRoyImg: 'bruno_roy.png',
  nicholasGoodwinImg: 'nicholas_goodwin.jpg',
  logoSiliconComte: 'logo-siliconcomte.png',
  illustrationHome: 'illustration-home-new.png'
};

const output = {};

for (const [key, filename] of Object.entries(images)) {
  const filePath = path.join(imagesDir, filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename).toLowerCase();
    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
    const base64 = fs.readFileSync(filePath).toString('base64');
    output[key] = `data:${mime};base64,${base64}`;
  }
}

fs.writeFileSync(
  path.join(__dirname, 'src', 'assets', 'imagesData.ts'),
  `export const imagesData = ${JSON.stringify(output, null, 2)};`
);
console.log('Created src/assets/imagesData.ts');
