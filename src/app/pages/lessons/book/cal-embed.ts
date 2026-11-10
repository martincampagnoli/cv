/** Thin, typed port of Cal.com's official embed snippet.
 *
 * The snippet installs a queueing `window.Cal` stub and appends embed.js; calls
 * made before the script arrives are queued and replayed once it loads. Kept
 * as a function (not inlined in index.html) so the script is only requested on
 * the booking page — the CV and the landing page never download it. */

export const CAL_ORIGIN = 'https://cal.com';
export const CAL_EMBED_SRC = 'https://app.cal.com/embed/embed.js';

type Args = unknown[];

/** One namespace: the API every per-event embed is driven through. */
export type CalNamespace = ((...args: Args) => void) & { q?: Args[] };

export type CalGlobal = ((...args: Args) => void) & {
  loaded?: boolean;
  ns: Record<string, CalNamespace>;
  q?: Args[];
};

declare global {
  interface Window {
    Cal?: CalGlobal;
  }
}

export interface InlineOptions {
  readonly namespace: string;
  readonly calLink: string;
  readonly element: HTMLElement;
  readonly brand: string;
  readonly onBooked: () => void;
}

/** Installs the stub if needed and returns `window.Cal`. Idempotent. */
export function loadCal(win: Window = window): CalGlobal {
  if (win.Cal) return win.Cal;

  const push = (target: { q?: Args[] }, args: Args) => {
    (target.q ??= []).push(args);
  };

  const cal = function (...args: Args) {
    const self = win.Cal!;
    if (!self.loaded) {
      self.ns = {};
      self.q ??= [];
      const script = win.document.createElement('script');
      script.src = CAL_EMBED_SRC;
      script.async = true;
      win.document.head.appendChild(script);
      self.loaded = true;
    }
    if (args[0] === 'init') {
      const namespace = args[1];
      if (typeof namespace === 'string') {
        const api: CalNamespace = (...nsArgs: Args) => push(api, nsArgs);
        api.q ??= [];
        self.ns[namespace] ??= api;
        push(self.ns[namespace], args);
        push(self, ['initNamespace', namespace]);
      } else {
        push(self, args);
      }
      return;
    }
    push(self, args);
  } as CalGlobal;
  cal.ns = {};
  win.Cal = cal;
  return cal;
}

/** Renders one event type inline into `element`, styled to the page, and
 * reports a successful booking request. */
export function renderInline(
  options: InlineOptions,
  win: Window = window,
): void {
  const cal = loadCal(win);
  cal('init', options.namespace, { origin: CAL_ORIGIN });
  const ns = cal.ns[options.namespace];

  ns('inline', {
    elementOrSelector: options.element,
    calLink: options.calLink,
    config: { layout: 'month_view', theme: 'light' },
  });
  ns('ui', {
    theme: 'light',
    layout: 'month_view',
    hideEventTypeDetails: false,
    cssVarsPerTheme: { light: { 'cal-brand': options.brand } },
  });

  // V2 is the current event; the legacy name is still emitted by older embed
  // builds. Whichever fires first wins.
  let done = false;
  const once = () => {
    if (done) return;
    done = true;
    options.onBooked();
  };
  ns('on', { action: 'bookingSuccessfulV2', callback: once });
  ns('on', { action: 'bookingSuccessful', callback: once });
}
