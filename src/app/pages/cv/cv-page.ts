import { Component } from '@angular/core';
import { CV } from '../../data/cv.data';
import { HeroSection } from '../../sections/hero/hero';

/** The CV at `/`. Its own route so the lessons pages never pull it in. */
@Component({
  selector: 'app-cv-page',
  imports: [HeroSection],
  template: '<app-hero [hero]="cv.hero" />',
})
export class CvPage {
  protected readonly cv = CV;
}
