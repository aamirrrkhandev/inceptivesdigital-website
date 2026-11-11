import { CALENDLY_EMBED_URL } from "./calendly";

// The WordPress snippet assigned src on open; an empty exported iframe cannot
// initialize itself. Keep this on demand instead of shipping Calendly's SDK.
export function initializeCalendarPopup(root: HTMLElement) {
  const popup = root.querySelector<HTMLElement>("#schedulePopup");
  const frame = popup?.querySelector<HTMLIFrameElement>("iframe");
  const error = popup?.querySelector<HTMLElement>(".calendly-load-error");
  const retry = popup?.querySelector<HTMLButtonElement>("#idCalendlyRetry");
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending = false;
  let ready = false;
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
  const load = (force = false) => {
    if (!popup || !frame || (!force && (pending || ready))) return;
    pending = true;
    ready = false;
    popup.classList.remove("calendly-loaded", "calendly-error");
    if (error) error.hidden = true;
    clearTimeout(timer);
    timer = setTimeout(failed, 20000);
    frame.loading = "eager";
    frame.tabIndex = 0;
    frame.src = frame.dataset.embedSrc || CALENDLY_EMBED_URL;
  };
  const onRetry = () => load(true);
  frame?.addEventListener("load", loaded);
  frame?.addEventListener("error", failed);
  retry?.addEventListener("click", onRetry);
  return {
    load,
    dispose() {
      clearTimeout(timer);
      frame?.removeEventListener("load", loaded);
      frame?.removeEventListener("error", failed);
      retry?.removeEventListener("click", onRetry);
    },
  };
}
