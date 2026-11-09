/** Renders an address as `user [at] domain [dot] tld`, so scrapers can't lift
 * a plain address out of the markup. The real address is only assembled when
 * someone clicks (see `openMail`). */
export function obfuscateEmail(email: string): string {
  const [user, domain] = email.split('@');
  return `${user} [at] ${domain.replace(/\./g, ' [dot] ')}`;
}

export function openMail(email: string, subject?: string): void {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : '';
  window.location.href = `mailto:${email}${query}`;
}
