import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LESSONS } from '../../../data/lessons.data';

/** Width of the `key:` column in the code card, so the values line up. */
const KEY_COLUMN = 10;

/** `/lessons`: what the lessons are, how booking works, and what it costs. */
@Component({
  selector: 'app-lessons-landing',
  imports: [RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
  protected readonly lessons = LESSONS;

  /** The facts rendered as an object literal, echoing the CV hero's code
   * background. Padded here rather than in CSS so the alignment survives copy
   * and paste and doesn't depend on the font. */
  protected readonly codeLines = computed(() =>
    this.lessons.facts.map(
      ({ key, value }) => `  ${`${key}:`.padEnd(KEY_COLUMN)}${value},`,
    ),
  );
}
