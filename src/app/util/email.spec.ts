import { vi } from 'vitest';
import { obfuscateEmail, openMail } from './email';

describe('email util', () => {
  it('obfuscates every dot in the domain', () => {
    expect(obfuscateEmail('me@mail.example.com')).toBe(
      'me [at] mail [dot] example [dot] com',
    );
  });

  it('opens a mailto with an encoded subject', () => {
    const setHref = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      set href(value: string) {
        setHref(value);
      },
    } as Location);
    openMail('me@example.com', 'Booking: Intro call');
    expect(setHref).toHaveBeenCalledWith(
      'mailto:me@example.com?subject=Booking%3A%20Intro%20call',
    );
    vi.restoreAllMocks();
  });
});
