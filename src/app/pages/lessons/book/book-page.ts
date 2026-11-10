import {
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  input,
  viewChildren,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LessonOffer } from '../../../models/lessons.model';
import { obfuscateEmail, openMail } from '../../../util/email';
import { LESSONS_CONTENT } from '../lessons.token';
import { renderInline } from './cal-embed';

/** `/lessons/book?type=<slug>`: pick an offer, then a slot in the embedded
 * Cal.com calendar. Cal.com holds the slot as unconfirmed and emails Martín
 * to accept or reject it; this page only hands off to it. */
@Component({
  selector: 'app-lessons-book',
  imports: [RouterLink],
  templateUrl: './book-page.html',
  styleUrl: './book-page.scss',
})
export class BookPage {
  private readonly router = inject(Router);
  protected readonly lessons = inject(LESSONS_CONTENT);

  /** Bound from the `type` query param (component input binding). */
  readonly type = input<string>();

  /** The URL is the only source of truth for the selection, so a shared link
   * ("book the intro call") and the back button always agree with the page. */
  protected readonly selected = computed<LessonOffer>(() => {
    const offers = this.lessons.offers;
    const slug = this.type();
    return (
      offers.find((o) => o.slug === slug) ??
      offers.find((o) => o.primary) ??
      offers[0]
    );
  });

  protected readonly emailDisplay = computed(() =>
    this.lessons.email ? obfuscateEmail(this.lessons.email) : null,
  );

  private readonly slots = viewChildren<ElementRef<HTMLElement>>('calSlot');

  /** Each offer's embed is rendered once, on first selection, then kept and
   * only shown/hidden — re-rendering would reload the iframe and lose the
   * month the visitor was looking at. */
  private readonly rendered = new Set<string>();

  constructor() {
    afterRenderEffect(() => {
      const cal = this.lessons.cal;
      const offer = this.selected();
      if (!cal || this.rendered.has(offer.slug)) return;
      const slot = this.slots().find(
        (s) => s.nativeElement.dataset['slug'] === offer.slug,
      );
      if (!slot) return;
      this.rendered.add(offer.slug);
      renderInline({
        namespace: offer.slug,
        calLink: `${cal.username}/${offer.slug}`,
        element: slot.nativeElement,
        brand: cal.brand,
        onBooked: () =>
          void this.router.navigate(['/lessons/thanks'], {
            queryParams: { type: offer.slug },
          }),
      });
    });
  }

  protected pick(offer: LessonOffer): void {
    // Replace rather than push: one history entry per click would make the
    // back button step through every offer the visitor looked at.
    void this.router.navigate([], {
      queryParams: { type: offer.slug },
      replaceUrl: true,
    });
  }

  protected mail(event: Event): void {
    event.preventDefault();
    if (this.lessons.email)
      openMail(this.lessons.email, `Booking: ${this.selected().title}`);
  }
}
