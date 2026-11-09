import { InjectionToken } from '@angular/core';
import { LESSONS } from '../../data/lessons.data';
import { Lessons } from '../../models/lessons.model';

/** The lessons content, injectable so tests can exercise the configured-Cal
 * path without editing the real data file. Defaults to `LESSONS`. */
export const LESSONS_CONTENT = new InjectionToken<Lessons>('LESSONS_CONTENT', {
  providedIn: 'root',
  factory: () => LESSONS,
});
