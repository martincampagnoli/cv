export type World = 'surface' | 'deep';

export interface SocialLink {
  readonly label: string;
  readonly url: string;
  /** Which hero state this link belongs to; the other state dims it. */
  readonly world: World;
}

/** One line of the ghosted code background. `value` is rendered verbatim, so it
 * arrives already quoted / bracketed / formatted the way it should read. */
export interface Facet {
  readonly key: string;
  readonly value: string;
}

export interface Hero {
  readonly name: string;
  readonly tagline: readonly string[];
  readonly links: readonly SocialLink[];
  readonly surface: readonly Facet[];
  readonly deep: readonly Facet[];
}

export interface Cv {
  readonly hero: Hero;
}
