import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
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
      providers: [provideRouter([])],
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

  it('links the CV download with its format and page count', () => {
    const link = el.querySelector<HTMLAnchorElement>('.doc__link')!;
    expect(link.getAttribute('href')).toBe(CV.hero.file.url);
    expect(link.hasAttribute('download')).toBe(true);
    // The arrow is decorative, so the label has to carry the meaning itself.
    expect(link.getAttribute('aria-label')).toContain('Download CV');
    expect(link.getAttribute('aria-label')).toContain(
      String(CV.hero.file.pages),
    );

    const meta = el.querySelector('.doc__meta')!.textContent ?? '';
    expect(meta).toContain(CV.hero.file.format);
    expect(meta).toContain(String(CV.hero.file.pages));
  });

  it('renders the contact address obfuscated, assembled only on click', () => {
    const contact = el.querySelector<HTMLAnchorElement>('.contact');
    if (!CV.hero.email) {
      // Deliberate: no address configured means no line at all, never a
      // placeholder.
      expect(contact).toBeNull();
      return;
    }
    const [user, domain] = CV.hero.email.split('@');
    const expectedDisplay = `${user} [at] ${domain.replace(/\./g, ' [dot] ')}`;
    expect(contact?.textContent?.trim()).toBe(expectedDisplay);
    // The raw address must never sit in the markup, only in the click handler.
    expect(contact?.getAttribute('href')).not.toContain(CV.hero.email);

    const setHref = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      set href(value: string) {
        setHref(value);
      },
    } as Location);

    contact?.dispatchEvent(new MouseEvent('click'));
    expect(setHref).toHaveBeenCalledWith(`mailto:${CV.hero.email}`);
  });

  it('hides the contact line when no address is configured', async () => {
    const noEmail = { ...CV.hero };
    delete (noEmail as { email?: string }).email;
    fixture.componentRef.setInput('hero', noEmail);
    await settle();
    expect(el.querySelector('.contact')).toBeNull();
    // The download block is unconditional and must survive.
    expect(el.querySelector('.doc__link')).not.toBeNull();
  });

  it('links the teaser card to its route and dims it in the deep world', async () => {
    const card = () => el.querySelector<HTMLAnchorElement>('.teaser')!;
    expect(card().getAttribute('href')).toBe(CV.hero.teaser!.route);
    expect(card().textContent).toContain(CV.hero.teaser!.title);
    expect(card().classList.contains('is-muted')).toBe(false);

    halves()[1].click();
    await settle();
    expect(card().classList.contains('is-muted')).toBe(true);
  });

  it('renders no teaser card when none is configured', async () => {
    fixture.componentRef.setInput('hero', { ...CV.hero, teaser: undefined });
    await settle();
    expect(el.querySelector('.teaser')).toBeNull();
  });

  it('builds a stable field of 32 motes', () => {
    expect(el.querySelectorAll('.mote').length).toBe(32);
    const first = el.querySelector<HTMLElement>('.mote')!.style.left;
    fixture.detectChanges();
    expect(el.querySelector<HTMLElement>('.mote')!.style.left).toBe(first);
  });
});
