import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSection } from './hero';
import { CV } from '../../data/cv.data';

describe('HeroSection', () => {
  let fixture: ComponentFixture<HeroSection>;
  let el: HTMLElement;

  const halves = () => el.querySelectorAll<HTMLElement>('.half');
  const section = () => el.querySelector('.hero')!;
  const settle = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSection],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSection);
    fixture.componentRef.setInput('hero', CV.hero);
    el = fixture.nativeElement as HTMLElement;
    await settle();
  });

  it('starts on the surface', () => {
    expect(section().classList.contains('is-deep')).toBe(false);
    expect(el.querySelector('.mode')?.textContent?.trim()).toBe('Surface');
    expect(halves()[0].classList.contains('is-on')).toBe(true);
    expect(halves()[1].classList.contains('is-off')).toBe(true);
  });

  it('previews the deep world on hover and relaxes back on tagline leave', async () => {
    halves()[1].dispatchEvent(new MouseEvent('mouseenter'));
    await settle();
    expect(section().classList.contains('is-deep')).toBe(true);
    // Depth is read from the `max` facet, never hardcoded.
    const max = CV.hero.deep
      .find((f) => f.key === 'max')!
      .value.replace(/^'|'$/g, '');
    expect(el.querySelector('.mode')?.textContent?.trim()).toBe(
      `Deep · −${max}`,
    );

    el.querySelector('.tag')!.dispatchEvent(new MouseEvent('mouseleave'));
    await settle();
    expect(section().classList.contains('is-deep')).toBe(false);
  });

  it('locks the world on click so later hovers are ignored', async () => {
    halves()[1].dispatchEvent(new MouseEvent('click'));
    await settle();
    expect(fixture.componentInstance.locked()).toBe(true);
    expect(section().classList.contains('is-deep')).toBe(true);

    halves()[0].dispatchEvent(new MouseEvent('mouseenter'));
    await settle();
    expect(section().classList.contains('is-deep')).toBe(true);

    el.querySelector('.tag')!.dispatchEvent(new MouseEvent('mouseleave'));
    await settle();
    expect(section().classList.contains('is-deep')).toBe(true);
  });

  it('locks on Enter and Space from the keyboard', async () => {
    halves()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    await settle();
    expect(section().classList.contains('is-deep')).toBe(true);
    expect(fixture.componentInstance.locked()).toBe(true);
  });

  it('mutes the links that belong to the other world', async () => {
    const muted = () =>
      [...el.querySelectorAll<HTMLElement>('.link')].map((a) =>
        a.classList.contains('is-muted'),
      );
    const mutedWhenDeep = (deep: boolean) =>
      CV.hero.links.map((l) => (l.world === 'deep') !== deep);

    expect(muted().length).toBe(CV.hero.links.length);
    expect(muted()).toEqual(mutedWhenDeep(false));

    halves()[1].dispatchEvent(new MouseEvent('mouseenter'));
    await settle();
    expect(muted()).toEqual(mutedWhenDeep(true));

    // Both worlds must actually be represented, or this asserts nothing.
    expect(new Set(CV.hero.links.map((l) => l.world)).size).toBe(2);
  });

  // Asserts the layout invariant, not the copy — the facts in cv.data.ts are
  // expected to keep changing, and editing them should not break this.
  it('renders the code background with values aligned in one column', () => {
    const facets = [...CV.hero.surface, ...CV.hero.deep];
    const lines = [...el.querySelectorAll('.code__line')].map(
      (l) => l.textContent ?? '',
    );

    expect(lines.length).toBe(facets.length);
    expect(lines.every((l) => l.startsWith('  '))).toBe(true);
    expect(lines.every((l) => l.endsWith(','))).toBe(true);
    expect(lines.every((l, i) => l.startsWith(`  ${facets[i].key}:`))).toBe(
      true,
    );

    // The point of the padding: every value begins at the same column.
    const valueColumns = lines.map((l, i) => l.indexOf(facets[i].value));
    expect(valueColumns.every((c) => c > 0)).toBe(true);
    expect(new Set(valueColumns).size).toBe(1);
  });

  // The brace lines are literal template text sitting next to `white-space:
  // pre` facet lines. Prettier re-wraps them freely, which collapses into a
  // stray leading space — harmless only because `.code__brace` does NOT
  // inherit `pre`. Keep that split, or the opening brace drifts one column
  // right of the closing one.
  it('renders the brace lines with the right content', () => {
    const braces = [...el.querySelectorAll('.code__brace')].map((l) =>
      (l.textContent ?? '').trim(),
    );
    expect(braces).toEqual(['const surface = {', '};', 'const deep = {', '};']);
  });

  it('keeps significant whitespace off the brace lines', () => {
    // Only the interpolated facet lines may render pre-formatted whitespace.
    const preLines = [...el.querySelectorAll('.code__line')];
    const braceLines = [...el.querySelectorAll('.code__brace')];
    expect(preLines.length).toBe(CV.hero.surface.length + CV.hero.deep.length);
    expect(braceLines.length).toBe(4);
    expect(braceLines.some((l) => l.classList.contains('code__line'))).toBe(
      false,
    );
  });

  it('builds a stable field of 32 motes', () => {
    expect(el.querySelectorAll('.mote').length).toBe(32);
    const first = el.querySelector<HTMLElement>('.mote')!.style.left;
    fixture.detectChanges();
    expect(el.querySelector<HTMLElement>('.mote')!.style.left).toBe(first);
  });
});
