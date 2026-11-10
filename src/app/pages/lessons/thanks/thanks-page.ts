import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LESSONS_CONTENT } from '../lessons.token';

/** `/lessons/thanks`: shown after Cal.com accepts a booking request. The
 * request is still unconfirmed at this point, so the copy says what happens
 * next instead of celebrating a booking that may be rejected. */
@Component({
  selector: 'app-lessons-thanks',
  imports: [RouterLink],
  template: `
    <section class="thanks">
      <p class="eyebrow">// request sent</p>
      <h1 class="title">Thanks, your request is in.</h1>
      <p class="lead">
        @if (offer(); as o) {
          Your {{ o.title.toLowerCase() }} ({{ o.minutes }} min) is held for
          you.
        } @else {
          Your slot is held for you.
        }
        I'll review it by hand, usually within a day.
      </p>
      <ol class="next">
        <li>
          <b>Watch WhatsApp and email.</b> For a lesson, I'll send a payment
          link (Tikkie or PayPal). The free intro call skips this step.
        </li>
        <li>
          <b>Once it's paid, it's confirmed.</b> You'll get the confirmation
          email with the Google Meet link, and we meet at the agreed time.
        </li>
        <li>
          <b>Need to change it?</b> Use the reschedule link in the email, free
          up to 24 hours before. Cancelled lessons are still charged.
        </li>
      </ol>
      <a class="cta" routerLink="/lessons">Back to lessons</a>
    </section>
  `,
  styleUrl: './thanks-page.scss',
})
export class ThanksPage {
  private readonly lessons = inject(LESSONS_CONTENT);

  readonly type = input<string>();

  protected readonly offer = computed(() =>
    this.lessons.offers.find((o) => o.slug === this.type()),
  );
}
