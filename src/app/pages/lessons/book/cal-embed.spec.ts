import { CAL_EMBED_SRC, loadCal, renderInline } from './cal-embed';

/** A throwaway window-like object so the real `window.Cal` is never touched
 * and no test depends on another's leftovers. */
function fakeWindow(): Window {
  const doc = document.implementation.createHTMLDocument('cal');
  return { document: doc } as unknown as Window;
}

describe('cal-embed', () => {
  it('installs the stub once and injects embed.js on first call only', () => {
    const win = fakeWindow();
    const cal = loadCal(win);
    expect(loadCal(win)).toBe(cal);
    expect(win.document.querySelectorAll('script').length).toBe(0);

    cal('init', 'a', {});
    cal('init', 'b', {});
    const scripts = win.document.querySelectorAll('script');
    expect(scripts.length).toBe(1);
    expect(scripts[0].getAttribute('src')).toBe(CAL_EMBED_SRC);
  });

  it('queues inline, ui and booking listeners on the event namespace', () => {
    const win = fakeWindow();
    const element = win.document.createElement('div');
    let booked = 0;
    renderInline(
      {
        namespace: 'intro-call',
        calLink: 'someone/intro-call',
        element,
        brand: '#000000',
        onBooked: () => booked++,
      },
      win,
    );

    const ns = win.Cal!.ns['intro-call'];
    const actions = ns.q!.map((args) => args[0]);
    expect(actions).toEqual(['init', 'inline', 'ui', 'on', 'on']);
    const inline = ns.q![1][1] as {
      calLink: string;
      elementOrSelector: HTMLElement;
    };
    expect(inline.calLink).toBe('someone/intro-call');
    expect(inline.elementOrSelector).toBe(element);

    // Both success events are wired, but a booking is reported only once.
    const listeners = ns
      .q!.filter((args) => args[0] === 'on')
      .map((args) => (args[1] as { callback: () => void }).callback);
    listeners.forEach((fn) => fn());
    expect(booked).toBe(1);
  });
});
