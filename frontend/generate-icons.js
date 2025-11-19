const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad)"/>
  <g fill="white">
    <rect x="${size * 0.15}" y="${size * 0.2}" width="${size * 0.18}" height="${size * 0.6}" rx="${size * 0.02}"/>
    <rect x="${size * 0.41}" y="${size * 0.2}" width="${size * 0.18}" height="${size * 0.6}" rx="${size * 0.02}"/>
    <rect x="${size * 0.67}" y="${size * 0.2}" width="${size * 0.18}" height="${size * 0.6}" rx="${size * 0.02}"/>
  </g>
  <text x="50%" y="${size * 0.92}" font-family="Arial, sans-serif" font-size="${size * 0.12}" fill="white" text-anchor="middle" font-weight="bold">KANBAN</text>
</svg>`;

// Save SVG files
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

[192, 512].forEach(size => {
  const svg = createSVG(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg);
  console.log(`✅ Created icon-${size}x${size}.svg`);
});

console.log('\n📝 Note: For production, convert SVG to PNG using:');
console.log('   - Online tool: https://cloudconvert.com/svg-to-png');
console.log('   - Or use sharp: npm install sharp && convert with Node.js');
console.log('\nFor now, update vite.config.ts to use .svg icons.');
