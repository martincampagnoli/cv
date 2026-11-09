import { Component, computed } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LESSONS } from '../../data/lessons.data';
import { obfuscateEmail, openMail } from '../../util/email';

/** Frame shared by every `/lessons` page: header, footer, and the design
 * tokens. Tokens are custom properties on the host, so they inherit into the
 * child pages through Angular's style encapsulation. */
@Component({
  selector: 'app-lessons-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './lessons-layout.html',
  styleUrl: './lessons-layout.scss',
})
export class LessonsLayout {
  protected readonly lessons = LESSONS;
  protected readonly year = new Date().getFullYear();

  protected readonly emailDisplay = computed(() =>
    this.lessons.email ? obfuscateEmail(this.lessons.email) : null,
  );

  protected mail(event: Event): void {
    event.preventDefault();
    if (this.lessons.email) openMail(this.lessons.email, 'Coding lessons');
  }
}
