import { TestBed } from '@angular/core/testing';
import {
  Router,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { LESSONS } from '../../../data/lessons.data';
import { Lessons } from '../../../models/lessons.model';
import { LESSONS_CONTENT } from '../lessons.token';
import { BookPage } from './book-page';

async function setup(content: Lessons, url = '/lessons/book') {
  TestBed.configureTestingModule({
    providers: [
      { provide: LESSONS_CONTENT, useValue: content },
      provideRouter(
        [
          { path: 'lessons/book', component: BookPage },
          { path: 'lessons/thanks', children: [] },
          { path: 'lessons', children: [] },
        ],
        withComponentInputBinding(),
      ),
    ],
  });
  const harness = await RouterTestingHarness.create();
  await harness.navigateByUrl(url);
  const el = harness.fixture.nativeElement as HTMLElement;
  return { harness, el };
}

const pressed = (el: HTMLElement) =>
  [...el.querySelectorAll<HTMLButtonElement>('.offer')]
    .filter((b) => b.getAttribute('aria-pressed') === 'true')
    .map((b) => b.querySelector('.offer__title')?.textContent?.trim());

describe('BookPage', () => {
  afterEach(() => {
    delete window.Cal;
  });

  it('pre-selects the primary offer', async () => {
    const { el } = await setup(LESSONS);
    const primary = LESSONS.offers.find((o) => o.primary)!;
    expect(pressed(el)).toEqual([primary.title]);
  });

  it('selects the offer named in ?type and switches through the URL', async () => {
    const other = LESSONS.offers.find((o) => !o.primary)!;
    const { harness, el } = await setup(
      LESSONS,
      `/lessons/book?type=${other.slug}`,
    );
    expect(pressed(el)).toEqual([other.title]);

    const primary = LESSONS.offers.find((o) => o.primary)!;
    const button = [...el.querySelectorAll<HTMLButtonElement>('.offer')].find(
      (b) => b.textContent?.includes(primary.title),
    )!;
    button.click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe(
      `/lessons/book?type=${primary.slug}`,
    );
    expect(pressed(el)).toEqual([primary.title]);
  });

  it('falls back to an email contact while no Cal.com account is set', async () => {
    const { el } = await setup({ ...LESSONS, cal: undefined });
    expect(el.querySelector('.cal')).toBeNull();
    expect(el.querySelector('.fallback')).not.toBeNull();
    // Never a plain address in the markup.
    if (LESSONS.email) {
      expect(el.querySelector('.fallback')!.innerHTML).not.toContain(
        LESSONS.email,
      );
    }
  });

  it('embeds the selected event once Cal.com is configured', async () => {
    const calls: unknown[][] = [];
    const ns = Object.assign((...args: unknown[]) => calls.push(args), {
      q: [],
    });
    window.Cal = Object.assign(
      (...args: unknown[]) => {
        if (args[0] === 'init') window.Cal!.ns[args[1] as string] = ns;
      },
      { ns: {} as Record<string, typeof ns>, loaded: true },
    );

    const { el } = await setup({
      ...LESSONS,
      cal: { username: 'tester', brand: '#123456' },
    });
    const primary = LESSONS.offers.find((o) => o.primary)!;
    const inline = calls.find((c) => c[0] === 'inline')![1] as {
      calLink: string;
      elementOrSelector: HTMLElement;
    };
    expect(inline.calLink).toBe(`tester/${primary.slug}`);
    expect(inline.elementOrSelector.dataset['slug']).toBe(primary.slug);
    expect(el.querySelector('.fallback')).toBeNull();
    // Hidden slots for the other offers are not rendered until picked.
    expect(calls.filter((c) => c[0] === 'inline').length).toBe(1);
  });
});
