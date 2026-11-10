import { Cv } from '../models/cv.model';

export const CV: Cv = {
  hero: {
    name: 'Martín Campagnoli',
    tagline: ['Developer on the surface', 'Diver in the deeps'],
    links: [
      {
        label: 'Linkedin',
        url: 'https://www.linkedin.com/in/martincampagnoli',
        world: 'surface',
      },
      {
        label: 'Github',
        url: 'https://github.com/martincampagnoli',
        world: 'surface',
      },
      {
        label: 'Instagram',
        url: 'https://www.instagram.com/martin.campagnoli',
        world: 'deep',
      },
      {
        label: 'Frey Dive',
        url: 'https://freydive.app',
        world: 'deep',
      },
    ],
    surface: [
      { key: 'role', value: "'Senior Frontend Developer'" },
      { key: 'stack', value: "['Angular', 'TypeScript', 'Signals']" },
      { key: 'years', value: '10+' },
      { key: 'builds', value: "'interfaces that hold pressure'" },
      { key: 'writes', value: "'tests, always'" },
      { key: 'city', value: "'Utrecht, NL'" },
    ],
    deep: [
      { key: 'cert', value: "'Diving Instructor'" },
      { key: 'logged', value: '163' },
      { key: 'max', value: "'60 m'" },
      { key: 'gas', value: "['air', 'EAN', 'trimix']" },
      { key: 'water', value: "'hot and crystal clear'" },
      { key: 'next', value: "'a wreck at 72 m'" },
    ],
    email: 'martin.campagnoli@hotmail.com.ar',
    file: {
      url: 'assets/cv/martin-campagnoli-cv.pdf',
      format: 'PDF',
      pages: 2,
    },
  },
};
