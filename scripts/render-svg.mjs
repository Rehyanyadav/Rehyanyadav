import fs from 'node:fs';

const LANG_COLORS = {
  Java: '#B07219', 'C++': '#F34B7D', C: '#555555', Dart: '#00B4AB', Go: '#00ADD8',
  JavaScript: '#F1E05A', TypeScript: '#3178C6', Python: '#3572A5', HTML: '#E34C26',
  CSS: '#563D7C', Kotlin: '#A97BFF', Swift: '#F05138', Shell: '#89E051',
  Dockerfile: '#384D54', Ruby: '#701516', PHP: '#4F5D95', Rust: '#DEA584',
};
const langColor = (name) => LANG_COLORS[name] || '#67E8F9';

function statCard(theme, stats) {
  const dark = theme === 'dark';
  const bg = dark ? ['#0A101F', '#0D1526'] : ['#FFFFFF', '#F8FAFC'];
  const border = dark ? '#1B2434' : '#E2E8F0';
  const heading = dark ? '#F8FAFC' : '#0F172A';
  const sub = dark ? '#94A3B8' : '#64748B';
  const accentA = dark ? '#22D3EE' : '#0891B2';
  const accentB = dark ? '#10B981' : '#059669';
  const divider = dark ? '#1B2434' : '#E2E8F0';
  const numColor = dark ? '#F8FAFC' : '#0F172A';

  const items = [
    { label: 'Total Stars', value: stats.totalStars },
    { label: 'Contributions', value: stats.totalContributions },
    { label: 'Public Repos', value: stats.totalRepos },
    { label: 'Followers', value: stats.followers },
  ];

  const colW = 560 / items.length;
  const cols = items.map((it, i) => {
    const cx = colW * i + colW / 2;
    return `
    <text x="${cx}" y="118" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" font-weight="700" fill="${numColor}">${it.value.toLocaleString()}</text>
    <text x="${cx}" y="142" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11.5" fill="${sub}">${it.label}</text>`;
  }).join('');

  const dividers = items.slice(1).map((_, i) => {
    const x = colW * (i + 1);
    return `<line x1="${x}" y1="82" x2="${x}" y2="150" stroke="${divider}" stroke-width="1"/>`;
  }).join('');

  const subline = `${stats.totalCommits.toLocaleString()} commits · ${stats.totalPRs.toLocaleString()} PRs · ${stats.totalIssues.toLocaleString()} issues · ${stats.totalForks.toLocaleString()} forks`;

  return `<svg width="560" height="200" viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${theme}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg[0]}"/><stop offset="100%" stop-color="${bg[1]}"/>
    </linearGradient>
    <linearGradient id="accent-${theme}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentA}"/><stop offset="100%" stop-color="${accentB}"/>
    </linearGradient>
  </defs>
  <rect width="560" height="200" rx="12" fill="url(#bg-${theme})"/>
  <rect x="0.5" y="0.5" width="559" height="199" rx="12" fill="none" stroke="${border}" stroke-width="1"/>
  <rect x="10" y="0" width="540" height="3" rx="1.5" fill="url(#accent-${theme})"/>
  <text x="28" y="40" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5" fill="${accentA}">GITHUB STATS</text>
  <text x="28" y="58" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="${sub}">@rehyanyadav</text>
  <line x1="0" y1="82" x2="560" y2="82" stroke="${divider}" stroke-width="1"/>
  ${dividers}
  ${cols}
  <line x1="0" y1="150" x2="560" y2="150" stroke="${divider}" stroke-width="1"/>
  <text x="280" y="176" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="11.5" fill="${sub}">${subline}</text>
</svg>`;
}

function langCard(theme, stats) {
  const dark = theme === 'dark';
  const bg = dark ? ['#0A101F', '#0D1526'] : ['#FFFFFF', '#F8FAFC'];
  const border = dark ? '#1B2434' : '#E2E8F0';
  const sub = dark ? '#94A3B8' : '#64748B';
  const accentA = dark ? '#22D3EE' : '#0891B2';
  const accentB = dark ? '#10B981' : '#059669';
  const divider = dark ? '#1B2434' : '#E2E8F0';
  const trackBg = dark ? '#131C2E' : '#E2E8F0';
  const nameColor = dark ? '#E2E8F0' : '#334155';
  const pctColor = dark ? '#94A3B8' : '#64748B';

  const rows = stats.languages.map((l, i) => {
    const y = 94 + i * 26;
    const barW = Math.max(6, (l.pct / 100) * 300);
    const c = langColor(l.name);
    return `
    <circle cx="30" cy="${y - 4}" r="4.5" fill="${c}"/>
    <text x="42" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="12.5" fill="${nameColor}">${l.name}</text>
    <rect x="130" y="${y - 10}" width="300" height="8" rx="4" fill="${trackBg}"/>
    <rect x="130" y="${y - 10}" width="${barW.toFixed(1)}" height="8" rx="4" fill="${c}"/>
    <text x="444" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="${pctColor}">${l.pct}%</text>`;
  }).join('');

  const height = 94 + stats.languages.length * 26 + 20;

  return `<svg width="560" height="${height}" viewBox="0 0 560 ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgl-${theme}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg[0]}"/><stop offset="100%" stop-color="${bg[1]}"/>
    </linearGradient>
    <linearGradient id="accentl-${theme}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${accentA}"/><stop offset="100%" stop-color="${accentB}"/>
    </linearGradient>
  </defs>
  <rect width="560" height="${height}" rx="12" fill="url(#bgl-${theme})"/>
  <rect x="0.5" y="0.5" width="559" height="${height - 1}" rx="12" fill="none" stroke="${border}" stroke-width="1"/>
  <rect x="10" y="0" width="540" height="3" rx="1.5" fill="url(#accentl-${theme})"/>
  <text x="28" y="40" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" letter-spacing="1.5" fill="${accentA}">TOP LANGUAGES</text>
  <text x="28" y="58" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="${sub}">by repository</text>
  <line x1="0" y1="76" x2="560" y2="76" stroke="${divider}" stroke-width="1"/>
  ${rows}
</svg>`;
}

const mock = {
  followers: 42, totalContributions: 612, totalCommits: 480, totalPRs: 38, totalIssues: 14,
  totalStars: 57, totalForks: 12, totalRepos: 23,
  languages: [
    { name: 'Java', pct: 34.8 }, { name: 'C++', pct: 21.7 }, { name: 'Dart', pct: 17.4 },
    { name: 'Go', pct: 13.0 }, { name: 'C', pct: 8.7 }, { name: 'TypeScript', pct: 4.4 },
  ],
};

const dataPath = 'dist/stats-data.json';
const stats = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, 'utf-8')) : mock;

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/github-stats.svg', statCard('light', stats));
fs.writeFileSync('dist/github-stats-dark.svg', statCard('dark', stats));
fs.writeFileSync('dist/top-langs.svg', langCard('light', stats));
fs.writeFileSync('dist/top-langs-dark.svg', langCard('dark', stats));
console.log('SVGs written to dist/');
