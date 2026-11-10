import { TestBed } from '@angular/core/testing';
import {
  Router,
  provideRouter,
  withComponentInputBinding,
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { CV } from './data/cv.data';
import { LESSONS } from './data/lessons.data';

describe('App routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
    harness = await RouterTestingHarness.create();
  });

  const root = () => harness.fixture.nativeElement as HTMLElement;
  const text = () => root().textContent;

  it('renders the CV at /', async () => {
    await harness.navigateByUrl('/');
    const el = root().querySelector('.name');
    expect(el?.textContent).toContain(CV.hero.name);
  });

  it('renders a link for every social link on the CV', async () => {
    await harness.navigateByUrl('/');
    const anchors = root().querySelectorAll<HTMLAnchorElement>('.links .link');
    expect(anchors.length).toBe(CV.hero.links.length);
    expect(anchors[0].getAttribute('href')).toBe(CV.hero.links[0].url);
  });

  it('serves the lessons landing, booking and thanks pages', async () => {
    await harness.navigateByUrl('/lessons');
    expect(text()).toContain(LESSONS.headline[0]);

    await harness.navigateByUrl('/lessons/book');
    expect(text()).toContain('Pick a time');

    await harness.navigateByUrl('/lessons/thanks');
    expect(text()).toContain('your request is in');
  });

  it('marks the header link of the page you are on as current', async () => {
    const current = () =>
      [...root().querySelectorAll('.nav [aria-current="page"]')].map((a) =>
        a.textContent?.trim(),
      );

    await harness.navigateByUrl('/lessons');
    expect(current()).toEqual(['Lessons']);

    await harness.navigateByUrl('/lessons/book');
    expect(current()).toEqual(['Book']);

    await harness.navigateByUrl('/lessons/thanks');
    expect(current()).toEqual([]);
  });

  it('sends unknown paths back to the CV', async () => {
    await harness.navigateByUrl('/nope');
    expect(TestBed.inject(Router).url).toBe('/');
    expect(root().querySelector('.name')?.textContent).toContain(CV.hero.name);
  });
});
