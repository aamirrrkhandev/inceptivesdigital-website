import { CALENDLY_EMBED_URL } from "./calendly";
import { isCalendarCTA } from "./cta-intent";

// Reuse one iframe. Warm it after an exposed CTA is idle or on explicit intent,
// so Calendly's external application does not start from cold on every click.
export function initializeCalendarPopup(root: HTMLElement) {
  const popup = root.querySelector<HTMLElement>("#schedulePopup");
  const frame = popup?.querySelector<HTMLIFrameElement>("iframe");
  const error = popup?.querySelector<HTMLElement>(".calendly-load-error");
  const retry = popup?.querySelector<HTMLButtonElement>("#idCalendlyRetry");
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending = false;
  let ready = false;
  let warmTimer: ReturnType<typeof setTimeout> | undefined;
  let idle: number | undefined;
  const failed = () => {
    clearTimeout(timer);
    pending = false;
    ready = false;
    popup?.classList.remove("calendly-loaded");
    popup?.classList.add("calendly-error");
    if (error) error.hidden = false;
  };
  const loaded = () => {
    if (!frame?.getAttribute("src")) return;
    clearTimeout(timer);
    pending = false;
    ready = true;
    popup?.classList.remove("calendly-error");
    popup?.classList.add("calendly-loaded");
    if (error) error.hidden = true;
  };
  const load = (force = false, background = false) => {
    if (popup && !background) {
      popup.classList.remove('calendly-prewarming');
      popup.inert = false;
    }
    if (!popup || !frame || (!force && (pending || ready))) return;
    if (background && !popup.classList.contains('is-open')) {
      popup.classList.add('calendly-prewarming');
      popup.inert = true;
    }
    pending = true;
    ready = false;
    popup.classList.remove("calendly-loaded", "calendly-error");
    if (error) error.hidden = true;
    clearTimeout(timer);
    timer = setTimeout(failed, 20000);
    frame.loading = "eager";
    frame.tabIndex = 0;
    const url = new URL(frame.dataset.embedSrc || CALENDLY_EMBED_URL);
    // Browsers may coalesce a same-URL retry with a still-pending navigation.
    // Only explicit retries bypass that request; normal reopen reuses the frame.
    if (force) url.searchParams.set("_retry", String(Date.now()));
    frame.src = url.href;
  };
  const onRetry = () => load(true);
  const triggers = [...root.querySelectorAll<HTMLElement>('a,button')].filter(
    (element) => isCalendarCTA(element.textContent || ''),
  );
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const mayWarm = !connection?.saveData && !/^(slow-)?2g$/.test(connection?.effectiveType || '');
  const warm = () => { if (mayWarm) load(false, true); };
  const observer = mayWarm && typeof IntersectionObserver !== 'undefined'
    ? new IntersectionObserver((entries) => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer?.disconnect();
        // Leave initial rendering alone; skip speculative loading on data saver.
        warmTimer = setTimeout(() => {
          if ('requestIdleCallback' in window) idle = window.requestIdleCallback(warm, { timeout: 1500 });
          else warm();
        }, 1500);
      }) : undefined;
  triggers.forEach(trigger => {
    observer?.observe(trigger);
    trigger.addEventListener('pointerenter', warm);
    trigger.addEventListener('focus', warm);
    trigger.addEventListener('touchstart', warm, { passive: true });
  });
  frame?.addEventListener("load", loaded);
  frame?.addEventListener("error", failed);
  retry?.addEventListener("click", onRetry);
  return {
    load,
    dispose() {
      clearTimeout(timer);
      clearTimeout(warmTimer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      observer?.disconnect();
      popup?.classList.remove('calendly-prewarming');
      if (popup) popup.inert = false;
      triggers.forEach(trigger => {
        trigger.removeEventListener('pointerenter', warm);
        trigger.removeEventListener('focus', warm);
        trigger.removeEventListener('touchstart', warm);
      });
      frame?.removeEventListener("load", loaded);
      frame?.removeEventListener("error", failed);
      retry?.removeEventListener("click", onRetry);
    },
  };
}
