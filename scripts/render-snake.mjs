import fs from 'node:fs';

const weeks = 53;
const days = 7;
const cellSize = 11;
const gap = 3;
const padding = 20;

function buildSvg(theme) {
  const dark = theme === 'dark';
  const bg = dark ? '#0D1117' : '#FFFFFF';
  const stroke = dark ? '#161B22' : '#E1E4E8';
  const cellFill = dark ? '#39D353' : '#2DA44E';
  const cellStroke = dark ? '#1F2937' : '#D0D7DE';
  const textColor = dark ? '#C9D1D9' : '#1F2328';

  const width = padding * 2 + weeks * cellSize + (weeks - 1) * gap;
  const height = padding * 2 + days * cellSize + (days - 1) * gap;

  const cells = [];
  for (let week = 0; week < weeks; week += 1) {
    for (let day = 0; day < days; day += 1) {
      const x = padding + week * (cellSize + gap);
      const y = padding + day * (cellSize + gap);
      cells.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${cellFill}" stroke="${cellStroke}" stroke-width="1"/>`);
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" rx="10" fill="${bg}"/>
  <text x="${padding}" y="${padding - 6}" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="600" fill="${textColor}">Full green contribution grid</text>
  ${cells.join('\n  ')}
</svg>`;
}

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/github-contribution-grid-snake.svg', buildSvg('light'));
fs.writeFileSync('dist/github-contribution-grid-snake-dark.svg', buildSvg('dark'));
console.log('Generated full-green snake SVGs in dist/');
