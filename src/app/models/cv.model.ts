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

/** The downloadable CV. `pages` and `format` are shown next to the link so the
 * reader knows what they are getting before they click. */
export interface CvFile {
  readonly url: string;
  readonly format: string;
  readonly pages: number;
}

/** A small card under the links that points somewhere on this site (an app
 * route, not an external URL). It belongs to the surface world, so the deep
 * state dims it like the surface links. */
export interface Teaser {
  readonly eyebrow: string;
  readonly title: string;
  readonly route: string;
}

export interface Hero {
  readonly name: string;
  readonly tagline: readonly string[];
  readonly links: readonly SocialLink[];
  /** Optional: no card is rendered without it. */
  readonly teaser?: Teaser;
  readonly surface: readonly Facet[];
  readonly deep: readonly Facet[];
  /** Optional: the contact line is hidden entirely until an address is set,
   * so a placeholder can never ship. */
  readonly email?: string;
  readonly file: CvFile;
}

export interface Cv {
  readonly hero: Hero;
}
