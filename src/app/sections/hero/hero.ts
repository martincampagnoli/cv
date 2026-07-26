import { Component, input } from '@angular/core';
import { Hero } from '../../models/cv.model';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroSection {
  readonly hero = input.required<Hero>();
}
