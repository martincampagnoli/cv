# CV

Personal CV / landing page. Angular 22, standalone components, zoneless change
detection, built with the esbuild-based `@angular/build` application builder.

## Requirements

Node `^22.22.3 || ^24.15.0 || >=26.0.0` (see `engines` in `package.json`).

```bash
npm install
```

## Development

```bash
npm start         # dev server on http://localhost:4200
npm run build     # production build into dist/cv/browser
```

## Quality

```bash
npm test          # unit tests (Vitest + jsdom)
npm run lint      # ESLint (angular-eslint) over .ts and .html
npm run format    # Prettier
```

## Deploy

Firebase Hosting, configured in `firebase.json` (serves `dist/cv/browser`).

```bash
npm run deploy    # ng build, then firebase deploy --only hosting
```

First time on a new machine: `npx firebase-tools login` and
`npx firebase-tools use --add` to bind the Firebase project (writes
`.firebaserc`).

Hosting is a static CDN — no Node process runs in production. Anything that
needs a response header (redirects, caching, `X-Robots-Tag`) belongs in
`firebase.json`, not in application code.

## Structure

```
src/
  app/
    app.ts                 root component
    app.config.ts          providers (zoneless, router)
    app.routes.ts          routes
    models/cv.model.ts     content types
    data/cv.data.ts        the CV content itself
    sections/hero/         hero section component
  styles.scss              global base (normalize, grid, helpers)
  styles/theme.scss        global theme layer, loaded after styles.scss
```

Content lives in `data/cv.data.ts` — edit that rather than the templates. To add
a section, create a component under `sections/`, add its fields to
`models/cv.model.ts`, and render it from `app.html`.

Styles that target `html`, `body`, or shared element selectors must stay in the
global stylesheets; component stylesheets are scoped and cannot match them.
