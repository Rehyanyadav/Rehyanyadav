import fs from 'node:fs';

const weeks = 53;
const days = 7;
const cellSize = 11;
const gap = 3;
const padding = 20;

function buildSvg(theme) {
  const dark = theme === 'dark';
  const bg = dark ? '#090B10' : '#F8FAFC';
  const cellFill = dark ? '#39D353' : '#22C55E';
  const cellStroke = dark ? '#0F172A' : '#D1D5DB';
  const textColor = dark ? '#C9D1D9' : '#111827';
  const glowColor = dark ? '#5EEAD4' : '#86EFAC';
  const accent = dark ? '#A7F3D0' : '#4ADE80';

  const width = padding * 2 + weeks * cellSize + (weeks - 1) * gap;
  const height = padding * 2 + days * cellSize + (days - 1) * gap;

  const cells = [];
  for (let week = 0; week < weeks; week += 1) {
    for (let day = 0; day < days; day += 1) {
      const x = padding + week * (cellSize + gap);
      const y = padding + day * (cellSize + gap);
      const offset = ((week * days + day) % 28) * 0.18;
      const op = dark ? '0.45;0.88;0.57;0.96;0.45' : '0.58;1;0.66;0.95;0.58';

      cells.push(`
  <g transform="translate(${x} ${y})">
    <rect x="0" y="0" width="${cellSize}" height="${cellSize}" rx="3" fill="${cellFill}" stroke="${cellStroke}" stroke-width="1">
      <animate attributeName="fill-opacity" dur="10s" repeatCount="indefinite" values="${op}" keyTimes="0;0.22;0.48;0.78;1" begin="${offset.toFixed(2)}s" />
      <animateTransform attributeName="transform" type="translate" values="0 0;0 -0.4;0 0;0 0.4;0 0" dur="9s" repeatCount="indefinite" begin="${(offset + 0.7).toFixed(2)}s" />
    </rect>
  </g>`);
    }
  }

  const snakePath = `M ${padding + 8} ${padding + 8}
    C ${width * 0.24} ${padding + 8}, ${width * 0.32} ${height * 0.24}, ${width * 0.42} ${height * 0.36}
    S ${width * 0.56} ${height * 0.48}, ${width * 0.62} ${height * 0.44}
    S ${width * 0.72} ${height * 0.38}, ${width * 0.78} ${height * 0.54}
    S ${width * 0.84} ${height * 0.68}, ${width - padding - 8} ${height - padding - 8}`;

  const trailSegments = Array.from({ length: 7 }, (_, i) => {
    const size = 8 + i * 1;
    const opacity = 0.9 - i * 0.12;
    const speed = 5.8 + i * 0.18;
    return `
    <circle r="${size / 2}" fill="${glowColor}" opacity="${opacity}">
      <animateMotion dur="${speed}s" repeatCount="indefinite" begin="${(i * 0.22).toFixed(2)}s" path="${snakePath}"/>
    </circle>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="glow-${theme}" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="bg-grad-${theme}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${dark ? '#090B10' : '#F8FAFC'}" />
      <stop offset="100%" stop-color="${dark ? '#08101A' : '#E2E8F0'}" />
    </linearGradient>
    <linearGradient id="snake-grad-${theme}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" />
      <stop offset="100%" stop-color="${glowColor}" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="14" fill="url(#bg-grad-${theme})" />
  <text x="${padding}" y="${padding - 6}" font-family="Segoe UI, Arial, sans-serif" font-size="12" font-weight="700" fill="${textColor}">Organic animated contribution grid</text>
  ${cells.join('')}
  <g filter="url(#glow-${theme})">
    <path d="${snakePath}" fill="none" stroke="${accent}" stroke-width="2.2" stroke-linecap="round" stroke-opacity="0.22" />
    <path d="${snakePath}" fill="none" stroke="url(#snake-grad-${theme})" stroke-width="3.8" stroke-linecap="round" stroke-dasharray="18 12" stroke-dashoffset="0">
      <animate attributeName="stroke-dashoffset" from="0" to="-96" dur="6s" repeatCount="indefinite" />
    </path>
    ${trailSegments}
    <circle r="9" fill="#ffffff" opacity="0.9">
      <animateTransform attributeName="transform" type="scale" values="1;1.15;1" dur="3.4s" repeatCount="indefinite" />
      <animateMotion dur="6s" repeatCount="indefinite" path="${snakePath}" />
    </circle>
    <circle r="18" fill="${glowColor}" opacity="0.18">
      <animate attributeName="r" values="18;24;18" dur="3.4s" repeatCount="indefinite" />
      <animateMotion dur="6s" repeatCount="indefinite" path="${snakePath}" />
    </circle>
  </g>
</svg>`;
}

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/github-contribution-grid-snake.svg', buildSvg('light'));
fs.writeFileSync('dist/github-contribution-grid-snake-dark.svg', buildSvg('dark'));
console.log('Generated animated organic contribution grid SVGs in dist/');
