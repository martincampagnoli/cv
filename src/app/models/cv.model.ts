export interface SocialLink {
  readonly label: string;
  readonly url: string;
}

export interface Hero {
  readonly name: string;
  readonly tagline: readonly string[];
  readonly links: readonly SocialLink[];
}

export interface Cv {
  readonly hero: Hero;
}
