import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      // A plain `href="#id"` resolves against `<base href="/">` and would
      // leave the page, so in-page links go through the router's fragment
      // support instead; this makes it scroll, and new pages start at the top.
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
      // Query params such as `/lessons/book?type=intro-call` bind straight to
      // component inputs.
      withComponentInputBinding(),
    ),
  ],
};
