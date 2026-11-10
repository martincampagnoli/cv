import { Lessons } from '../models/lessons.model';
import { CV } from './cv.data';

export const LESSONS: Lessons = {
  eyebrow: 'Coding lessons · 1:1 · online',
  headline: ['Learn to code'],
  intro:
    'Private online lessons for beginners and working developers. We go at your pace, on your goals and in real code: no slides, no recordings, one person who has shipped production frontends for more than ten years.',
  facts: [
    { key: 'format', value: "'1:1 on Google Meet'" },
    { key: 'length', value: "'60 min'" },
    { key: 'first', value: "'free 20 min intro call'" },
    { key: 'timezone', value: "'Europe/Amsterdam'" },
  ],
  topics: [
    {
      title: 'Programming from zero',
      body: 'Variables to functions to your first small app. For people who have never written code, or who started and got stuck.',
      tags: ['JavaScript', 'HTML', 'CSS'],
    },
    {
      title: 'TypeScript & modern frontend',
      body: 'Types that actually help, components, state and async: the things that turn a script into an application.',
      tags: ['TypeScript', 'Angular', 'Signals'],
    },
    {
      title: 'Level up at work',
      body: 'Code review of your own project, testing, architecture, and preparing for technical interviews.',
      tags: ['Testing', 'Code review', 'Interviews'],
    },
  ],
  steps: [
    {
      title: 'Pick a time',
      body: 'Choose a free slot in the calendar. Your first booking is a free 20-minute intro call.',
    },
    {
      title: 'I confirm it',
      body: 'I check the request and confirm on WhatsApp or email, usually within a day, with your Google Meet link.',
    },
    {
      title: 'We code',
      body: 'Join the Meet at the agreed time. Payment is a Tikkie link, sent with the confirmation.',
    },
  ],
  offers: [
    {
      slug: 'intro-call',
      title: 'Intro call',
      minutes: 20,
      price: 'Free',
      body: 'We meet, talk about where you are and what you want to learn, and see if we are a good fit.',
      primary: true,
    },
    {
      slug: 'coding-lesson',
      title: 'Coding lesson',
      minutes: 60,
      body: 'A full 1:1 session on your topic. Rate agreed on the intro call.',
    },
  ],
  policy: [
    'Requests are confirmed by hand, so a booking is final only after my confirmation.',
    'Free cancellation or rescheduling up to 24 hours before the lesson.',
    'Payment by Tikkie, sent with the confirmation.',
  ],
  faq: [
    {
      question: 'Do I need any experience?',
      answer:
        'No. Lessons start wherever you are, including from nothing at all.',
    },
    {
      question: 'What do I need?',
      answer:
        'A laptop, a stable connection and a browser. We set up anything else together in the first lesson.',
    },
    {
      question: 'Which language are lessons in?',
      answer: 'English or Spanish, whichever you prefer.',
    },
    {
      question: 'Can I book a regular weekly slot?',
      answer:
        'Yes. After the first lesson we can fix a recurring time, so you do not have to book every week.',
    },
  ],
  privacy:
    'Your name, email and phone number are used only to arrange and confirm your lessons. Ask and they are deleted.',
  // Set once the Cal.com account exists; until then the booking page shows an
  // email contact instead of an embed that would 404.
  //   cal: { username: 'martincampagnoli', brand: '#0d1a21' },
  email: CV.hero.email,
  meta: {
    title: 'Coding lessons · Martín Campagnoli',
    description:
      'Private 1:1 online coding lessons with a senior frontend developer. Book a free intro call.',
  },
};
