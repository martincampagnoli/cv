import { Component } from '@angular/core';
import { CV } from './data/cv.data';
import { HeroSection } from './sections/hero/hero';

@Component({
  selector: 'app-root',
  imports: [HeroSection],
  templateUrl: './app.html',
})
export class App {
  protected readonly cv = CV;
}
