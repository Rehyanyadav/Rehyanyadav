import fs from 'node:fs';

const username = process.env.GH_USERNAME || 'rehyanyadav';
const token = process.env.GH_TOKEN;

if (!token) {
  console.error('Missing GH_TOKEN');
  process.exit(1);
}

const restHeaders = { Authorization: `token ${token}`, 'User-Agent': username };
const gqlHeaders = { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' };

async function graphql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST', headers: gqlHeaders, body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function restAll(url) {
  let results = []; let page = 1;
  while (true) {
    const sep = url.includes('?') ? '&' : '?';
    const res = await fetch(`${url}${sep}per_page=100&page=${page}`, { headers: restHeaders });
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    results = results.concat(data);
    if (data.length < 100) break;
    page++;
  }
  return results;
}

const query = `
  query($login: String!) {
    user(login: $login) {
      followers { totalCount }
      contributionsCollection {
        contributionCalendar { totalContributions }
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
      }
    }
  }`;

const { user } = await graphql(query, { login: username });

const repos = (await restAll(`https://api.github.com/users/${username}/repos`)).filter(r => !r.fork);

const totalStars = repos.reduce((s, r) => s + (r.stargazers_count || 0), 0);
const totalForks = repos.reduce((s, r) => s + (r.forks_count || 0), 0);
const totalRepos = repos.length;

const langCount = {};
for (const r of repos) {
  if (!r.language) continue;
  langCount[r.language] = (langCount[r.language] || 0) + 1;
}
const langEntries = Object.entries(langCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
const langTotal = langEntries.reduce((s, [, v]) => s + v, 0) || 1;

const stats = {
  followers: user.followers.totalCount,
  totalContributions: user.contributionsCollection.contributionCalendar.totalContributions,
  totalCommits: user.contributionsCollection.totalCommitContributions,
  totalPRs: user.contributionsCollection.totalPullRequestContributions,
  totalIssues: user.contributionsCollection.totalIssueContributions,
  totalStars, totalForks, totalRepos,
  languages: langEntries.map(([name, count]) => ({ name, pct: Math.round((count / langTotal) * 1000) / 10 })),
};

fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/stats-data.json', JSON.stringify(stats, null, 2));
console.log(JSON.stringify(stats, null, 2));
