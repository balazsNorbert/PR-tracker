const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const fsp = fs.promises;
const path = require('path');
require('dotenv').config();

(async () => {
  const outputFolder = path.resolve(__dirname, 'build/static-html');
  const buildFolder = path.resolve(__dirname, 'build');
  const apiURL = process.env.REACT_APP_CLIENT_URL;

  const urls = [
    '/',
    '/tips',
    '/tips/how-to-avoid-workout-plateaus',
    '/tips/why-track-your-nutrition',
    '/tips/why-track-your-workouts',
    '/tips/how-to-stay-consistent-working-out',
    '/tips/how-to-warm-up-before-workout',
    '/tips/how-much-protein-you-need',
    '/tips/what-to-eat-before-workout',
    '/tips/what-to-eat-after-workout',
    '/tips/why-you-are-not-building-muscle',
    '/tips/how-long-should-your-workouts-be',
    '/tips/how-many-days-a-week-should-you-workout',
    '/tips/should-you-workout-every-day',
    '/tips/how-long-should-you-rest-between-sets',
    '/tips/should-you-do-cardio-before-or-after-weights',
    '/tips/what-is-progressive-overload',
    '/tips/best-time-to-workout',
    '/tips/should-you-train-to-failure-every-set',
    '/tips/can-you-lose-fat-and-gain-muscle',
    '/tips/best-workout-split-for-beginners',
    '/tips/best-workout-split',
    '/tips/how-heavy-should-you-lift',
    '/tips/train-muscle-twice-a-week',
    '/tips/muscle-soreness-and-growth',
    '/tips/how-many-exercises-per-muscle',
    '/tips/strength-vs-hypertrophy',
    '/tips/compound-vs-isolation-exercises',
    '/tips/free-weights-vs-machines',
  ];

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const baseUrl = apiURL;

  await fs.remove(outputFolder);
  await fs.mkdirp(outputFolder);

  for (const url of urls) {
    const fullUrl = baseUrl + url;
    console.log(`Generating static HTML for: ${fullUrl}`);

    await page.goto(fullUrl, { waitUntil: 'networkidle0' });

    const html = await page.content();

    const filePath = path.join(outputFolder, url, 'index.html');

    await fs.mkdirp(path.dirname(filePath));
    await fs.writeFile(filePath, html);

    console.log(`Saved: ${filePath}`);
  }

  await browser.close();
  console.log('Static HTML generation completed!');


  async function copyFolder(src, dest) {
    const entries = await fsp.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await fsp.mkdir(destPath, { recursive: true });
        await copyFolder(srcPath, destPath);
      } else {
        await fsp.copyFile(srcPath, destPath);
      }
    }
  }

  await copyFolder(outputFolder, buildFolder);
  console.log('Copied static HTML into build folder!');

  await fs.remove(outputFolder);
  console.log('Deleted static HTML from build folder!');

})();
