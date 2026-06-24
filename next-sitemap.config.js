module.exports = {
  siteUrl: 'https://ilyamedvedev.com',
  generateRobotsTxt: true,
  outDir: './public',
  // Simply list your categories here. 
  // It takes 10 seconds to add a new category if you add one later.
  additionalPaths: async (config) => {
    return [
      { loc: '/', changefreq: 'daily', priority: 1.0 },
      { loc: '/about', changefreq: 'monthly', priority: 0.7 },
      { loc: '/artwork/oil-paintings', changefreq: 'weekly', priority: 0.8 },
      { loc: '/artwork/drawings', changefreq: 'weekly', priority: 0.8 },
      { loc: '/artwork/watercolors', changefreq: 'weekly', priority: 0.8 },
      { loc: '/artwork/other-works', changefreq: 'weekly', priority: 0.8 },
    ];
  },
};