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

export interface Hero {
  readonly name: string;
  readonly tagline: readonly string[];
  readonly links: readonly SocialLink[];
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
