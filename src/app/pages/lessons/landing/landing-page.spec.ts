import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LESSONS } from '../../../data/lessons.data';
import { LandingPage } from './landing-page';

describe('LandingPage', () => {
  async function render() {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    const fixture = TestBed.createComponent(LandingPage);
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders every topic, step, offer and FAQ entry from the data', async () => {
    const el = await render();
    expect(el.querySelectorAll('.topic').length).toBe(LESSONS.topics.length);
    expect(el.querySelectorAll('.step').length).toBe(LESSONS.steps.length);
    expect(el.querySelectorAll('.offer').length).toBe(LESSONS.offers.length);
    expect(el.querySelectorAll('.faq__item').length).toBe(LESSONS.faq.length);
  });

  it('links each offer to the booking page with its type', async () => {
    const el = await render();
    const hrefs = [...el.querySelectorAll<HTMLAnchorElement>('.offer a')].map(
      (a) => a.getAttribute('href'),
    );
    expect(hrefs).toEqual(
      LESSONS.offers.map((o) => `/lessons/book?type=${o.slug}`),
    );
  });

  it('keeps the in-page link on /lessons instead of resolving to the base href', async () => {
    const el = await render();
    const how = [...el.querySelectorAll<HTMLAnchorElement>('a')].find((a) =>
      a.textContent?.includes('How it works'),
    );
    expect(how?.getAttribute('href')).toBe('/lessons#how');
  });

  it('aligns the code card values in one column', async () => {
    const el = await render();
    const lines = [...el.querySelectorAll('.code__line')].map(
      (l) => l.textContent ?? '',
    );
    expect(lines.length).toBe(LESSONS.facts.length);
    const cols = lines.map((l, i) => l.indexOf(LESSONS.facts[i].value));
    expect(new Set(cols).size).toBe(1);
  });

  it('only ever shows a price that is set in the data', async () => {
    const el = await render();
    const metas = [...el.querySelectorAll('.offer__meta')].map((m) =>
      m.textContent?.trim(),
    );
    LESSONS.offers.forEach((o, i) => {
      expect(metas[i]).toBe(
        o.price ? `${o.minutes} min · ${o.price}` : `${o.minutes} min`,
      );
    });
  });
});
