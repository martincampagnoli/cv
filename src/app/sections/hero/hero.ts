import { Component, computed, input, signal } from '@angular/core';
import { Facet, Hero } from '../../models/cv.model';

/** One suspended particle. Generated once, then never recomputed — the values
 * are random, so producing them during change detection would make the field
 * twitch on every tick. */
interface Mote {
  readonly left: string;
  readonly top: string;
  readonly size: string;
  readonly opacity: number;
  readonly duration: string;
  readonly delay: string;
}

interface CodeLine {
  readonly key: string;
  readonly text: string;
}

interface CodeBlock {
  readonly name: string;
  readonly lines: readonly CodeLine[];
}

const MOTE_COUNT = 32;

/** Width of the `key:` column in the code background, so values line up. */
const KEY_COLUMN = 9;

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroSection {
  readonly hero = input.required<Hero>();

  readonly deep = signal(false);
  readonly locked = signal(false);

  /** Depth comes from the `max` facet rather than a literal, so the label and
   * the code background can never disagree about how deep he has been. */
  readonly mode = computed(() => {
    if (!this.deep()) return 'Surface';
    const max = this.hero()
      .deep.find((facet) => facet.key === 'max')
      ?.value.replace(/^'|'$/g, '');
    return max ? `Deep · −${max}` : 'Deep';
  });

  /** Pointer devices preview a world on hover. Touch devices skip that
   * entirely — there, a tap sets and locks. */
  readonly canHover =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? !window.matchMedia('(hover:none)').matches
      : true;

  readonly motes: readonly Mote[] = Array.from({ length: MOTE_COUNT }, () => {
    const size = 1 + Math.random() * 2.2;
    return {
      left: `${Math.random() * 100}%`,
      top: `${30 + Math.random() * 80}%`,
      size: `${size}px`,
      opacity: 0.12 + Math.random() * 0.45,
      duration: `${13 + Math.random() * 17}s`,
      // Negative delay so the field is already populated on first paint
      // instead of every mote starting from the bottom together.
      delay: `${-Math.random() * 26}s`,
    };
  });

  readonly codeBlocks = computed<readonly CodeBlock[]>(() => [
    { name: 'surface', lines: toLines(this.hero().surface) },
    { name: 'deep', lines: toLines(this.hero().deep) },
  ]);

  /** Displayed with `[at]`/`[dot]` so scrapers can't lift a plain address
   * out of the markup; the real address only gets assembled on click. */
  readonly emailDisplay = computed(() => {
    const email = this.hero().email;
    if (!email) return null;
    const [user, domain] = email.split('@');
    return `${user} [at] ${domain.replace(/\./g, ' [dot] ')}`;
  });

  setWorld(deep: boolean, lock = false): void {
    if (lock) this.locked.set(true);
    else if (this.locked()) return;
    this.deep.set(deep);
  }

  /** Hover preview. Ignored on touch, where `canHover` is false. */
  previewWorld(deep: boolean): void {
    if (this.canHover) this.setWorld(deep);
  }

  /** Relaxes back to the surface when the pointer leaves the whole tagline. */
  relax(): void {
    if (this.canHover) this.setWorld(false);
  }

  lockWorld(event: Event, deep: boolean): void {
    event.preventDefault();
    this.setWorld(deep, true);
  }

  openEmail(event: Event): void {
    event.preventDefault();
    const email = this.hero().email;
    if (email) window.location.href = `mailto:${email}`;
  }
}

function toLines(facets: readonly Facet[]): readonly CodeLine[] {
  return facets.map(({ key, value }) => ({
    key,
    text: `  ${`${key}:`.padEnd(KEY_COLUMN)}${value},`,
  }));
}
