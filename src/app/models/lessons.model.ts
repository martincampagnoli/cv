/** Content for the public lessons pages (`/lessons`). Copy lives in
 * `data/lessons.data.ts`, never in templates — same rule as the CV. */

export interface LessonTopic {
  readonly title: string;
  readonly body: string;
  /** Short tags rendered as mono chips under the topic. */
  readonly tags: readonly string[];
}

export interface LessonStep {
  readonly title: string;
  readonly body: string;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

/** One bookable thing. `slug` is the Cal.com event-type slug, so the booking
 * page can embed `<username>/<slug>` directly. */
export interface LessonOffer {
  readonly slug: string;
  readonly title: string;
  readonly minutes: number;
  /** Display string, e.g. 'Free' or '€45'. Absent means "agreed on the intro
   * call" — a made-up price must never ship. */
  readonly price?: string;
  readonly body: string;
  /** The offer pre-selected on the booking page. Exactly one should set it. */
  readonly primary?: boolean;
}

/** Cal.com account the booking page embeds. Optional: until it is set, the
 * booking page falls back to an email contact instead of a broken embed. */
export interface CalConfig {
  readonly username: string;
  /** Brand colour handed to the embed so it matches the page. */
  readonly brand: string;
}

export interface Lessons {
  readonly eyebrow: string;
  readonly headline: readonly string[];
  readonly intro: string;
  readonly facts: readonly { readonly key: string; readonly value: string }[];
  readonly topics: readonly LessonTopic[];
  readonly steps: readonly LessonStep[];
  readonly offers: readonly LessonOffer[];
  readonly policy: readonly string[];
  readonly faq: readonly FaqItem[];
  readonly privacy: string;
  readonly cal?: CalConfig;
  readonly email?: string;
  readonly meta: {
    readonly title: string;
    readonly description: string;
  };
}
