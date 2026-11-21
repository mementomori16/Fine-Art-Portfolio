const fs = require('fs');
const path = require('path');

function getArtworkRoutesFromFile() {
  const filePath = path.join(__dirname, 'app', 'data', 'paintings.ts');
  if (!fs.existsSync(filePath)) return [];

  const content = fs.readFileSync(filePath, 'utf8');
  const routes = [];
  const seen = new Set();

  // Извлекаем пары id и category из объектов внутри PAINTINGS
  const objectRegex = /\{\s*id:\s*["']([^"']+)["'][\s\S]*?category:\s*["']([^"']+)["']/g;
  let match;

  while ((match = objectRegex.exec(content)) !== null) {
    const id = match[1].trim();
    const category = match[2].trim();
    const loc = `/artwork/${category}/${id}`;

    if (!seen.has(loc)) {
      seen.add(loc);
      routes.push({
        loc,
        changefreq: 'monthly',
        priority: 0.7,
      });
    }
  }

  return routes;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ilyamedvedev.com',
  generateRobotsTxt: true,
  outDir: './public',
  exclude: ['/icon.svg', '/icon1.svg'],
  additionalPaths: async () => {
    const staticPaths = [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/about', changefreq: 'monthly', priority: 0.7 },
      { loc: '/video', changefreq: 'weekly', priority: 0.8 },
      { loc: '/categories/oil-paintings', changefreq: 'weekly', priority: 0.8 },
      { loc: '/categories/drawings', changefreq: 'weekly', priority: 0.8 },
      { loc: '/categories/watercolors', changefreq: 'weekly', priority: 0.8 },
      { loc: '/categories/tempera', changefreq: 'weekly', priority: 0.8 },
      { loc: '/stylecategories/portrait', changefreq: 'weekly', priority: 0.8 },
      { loc: '/stylecategories/nude', changefreq: 'weekly', priority: 0.8 },
      { loc: '/stylecategories/landscape-still-life', changefreq: 'weekly', priority: 0.8 },
      { loc: '/stylecategories/memento-mori', changefreq: 'weekly', priority: 0.8 },
      { loc: '/stylecategories/psychological-realism', changefreq: 'weekly', priority: 0.8 },
      { loc: '/stylecategories/heritage-antiques', changefreq: 'weekly', priority: 0.8 },
    ];

    const artworkPaths = getArtworkRoutesFromFile();
    return [...staticPaths, ...artworkPaths];
  },
};