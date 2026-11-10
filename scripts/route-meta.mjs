// Writes a per-route copy of index.html with its own <title>, description and
// Open Graph tags, e.g. dist/cv/browser/lessons/index.html.
//
// Why: link previews (WhatsApp, LinkedIn, Slack) read the raw HTML and never
// run JavaScript, so tags set by the Angular router are invisible to them.
// Firebase Hosting serves a real file before applying the SPA rewrite, so
// `/lessons` gets this file and Angular then boots and routes normally — the
// <base href="/"> keeps every asset path working from the subfolder.
//
// Run after `ng build` (see the "build" script).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const OUT = 'dist/cv/browser';
const SITE = 'https://martincampagnoli.com';

// Copy mirrors `meta` in src/app/data/lessons.data.ts — keep the two in sync.
const ROUTES = [
  {
    path: 'lessons',
    title: 'Coding lessons · Martín Campagnoli',
    description:
      'Private 1:1 online coding lessons with a senior frontend developer. Book a free intro call.',
  },
  {
    path: 'lessons/book',
    title: 'Book a lesson · Martín Campagnoli',
    description:
      'Pick a free slot for a 1:1 online coding lesson. Start with a free 20-minute intro call.',
  },
];

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const index = await readFile(join(OUT, 'index.html'), 'utf8');

for (const route of ROUTES) {
  const url = `${SITE}/${route.path}`;
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Martín Campagnoli" />`,
    `<meta property="og:title" content="${escape(route.title)}" />`,
    `<meta property="og:description" content="${escape(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE}/assets/og/lessons.png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="Learn to code: 1:1 online coding lessons" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="canonical" href="${url}" />`,
  ].join('\n    ');

  let html = index
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${escape(route.description)}" />`,
    );
  if (html === index)
    throw new Error(`route-meta: no tags replaced for ${route.path}`);
  html = html.replace('</head>', `    ${tags}\n  </head>`);

  const file = join(OUT, route.path, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
  console.log(`route-meta: wrote ${file}`);
}
