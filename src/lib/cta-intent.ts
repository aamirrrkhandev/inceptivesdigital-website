// Verified conversion labels whose exported source controls lacked an action.
// Keep genuine links, downloads, form buttons and anchor destinations untouched.
export const isCalendarCTA = (text: string) =>
  /^(?:let['’]s\s+)?(?:schedule\s+(?:a\s+|your\s+)?(?:(?:strategy|discovery)\s+)?call|book a consultation)$/i.test(text.trim().replace(/\s+/g, ' '));

const enquiryLabels = new Set([
  'get started today',
  'start your project',
  'discuss your app idea',
  'discuss your product',
  'talk to a strategist',
  'tell us about your project',
  'start your education app project',
  'build a connected commerce platform',
  'talk to our team',
]);
export function isUnwiredEnquiryCTA(button: HTMLElement) {
  if (button.closest('form') || !enquiryLabels.has((button.textContent || '').trim().replace(/\s+/g, ' ').toLowerCase())) return false;
  const href = button.getAttribute('href');
  if (!href || href === '#' || href === '#!') return true;
  try {
    const url = new URL(href, location.href);
    return url.origin === location.origin && url.pathname.replace(/\/$/, '') === location.pathname.replace(/\/$/, '') && !url.search && ['', '#', '#!'].includes(url.hash);
  } catch { return false; }
}
