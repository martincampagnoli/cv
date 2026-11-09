import { Routes } from '@angular/router';

/** Every page is lazy, so the CV never downloads the lessons code (or the
 * Cal.com embed) and vice versa.
 *
 * Titles here are what the browser tab shows once the app runs. Link previews
 * (WhatsApp, LinkedIn) never run JS, so their tags are written into per-route
 * HTML files at build time instead — see `scripts/route-meta.mjs`. */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Martín Campagnoli',
    loadComponent: () => import('./pages/cv/cv-page').then((m) => m.CvPage),
  },
  {
    path: 'lessons',
    loadComponent: () =>
      import('./pages/lessons/lessons-layout').then((m) => m.LessonsLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        // Literal, not `LESSONS.meta.title`: importing the data here would pull
        // the whole lessons copy into the CV's initial bundle.
        title: 'Coding lessons · Martín Campagnoli',
        loadComponent: () =>
          import('./pages/lessons/landing/landing-page').then(
            (m) => m.LandingPage,
          ),
      },
      {
        path: 'book',
        title: 'Book a lesson · Martín Campagnoli',
        loadComponent: () =>
          import('./pages/lessons/book/book-page').then((m) => m.BookPage),
      },
      {
        path: 'thanks',
        title: 'Request sent · Martín Campagnoli',
        loadComponent: () =>
          import('./pages/lessons/thanks/thanks-page').then(
            (m) => m.ThanksPage,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
