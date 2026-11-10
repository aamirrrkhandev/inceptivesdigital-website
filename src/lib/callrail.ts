"use client";

export const CALLRAIL_SCRIPT =
  "https://cdn.callrail.com/companies/691547027/8acc5c6cc37011b7cee7/12/swap.js";
const SCRIPT_ID = "inceptives-callrail";
const enabledHosts = new Set([
  "inceptives-homepage-review.vercel.app",
  "inceptivesdigital.com",
  "www.inceptivesdigital.com",
]);
type CallRail = {
  swap: (scope?: Element) => void;
  captureForm?: (form: HTMLFormElement) => void;
};
declare global {
  interface Window {
    CallTrk?: CallRail;
  }
}
let loading: Promise<boolean> | undefined;
const captured = new WeakMap<HTMLFormElement, string>();
export const callRailEnabled = () =>
  typeof window !== "undefined" && enabledHosts.has(location.hostname);

export function loadCallRail(): Promise<boolean> {
  if (!callRailEnabled()) return Promise.resolve(false);
  if (window.CallTrk) return Promise.resolve(true);
  if (loading) return loading;
  loading = new Promise((resolve) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = CALLRAIL_SCRIPT;
    script.async = true;
    let finished = false;
    const finish = (success: boolean) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      document.documentElement.dataset.callrail = success
        ? "ready"
        : "unavailable";
      if (!success) {
        script.remove();
        loading = undefined;
      }
      resolve(success);
    };
    const timer = setTimeout(() => finish(false), 8000);
    script.onload = () => finish(Boolean(window.CallTrk));
    script.onerror = () => finish(false);
    document.body.append(script);
  });
  return loading;
}

export async function captureCallRailSubmission(form: HTMLFormElement) {
  if (!callRailEnabled()) return;
  // These are backend controls/challenge responses, not enquiry answers.
  form
    .querySelectorAll<HTMLInputElement>(
      'input[type="hidden"],input[type="password"],[name*="captcha" i],[name="cf-turnstile-response"]',
    )
    .forEach((field) => field.setAttribute("data-cr-no-capture", ""));
  const signature = JSON.stringify(
    [...new FormData(form).entries()].filter(
      ([key]) => !/captcha|cf-turnstile-response/i.test(key),
    ),
  );
  if (captured.get(form) === signature) return;
  let readinessTimer: ReturnType<typeof setTimeout> | undefined;
  try {
    const deadline = Date.now() + 1500;
    const ready = await Promise.race([
      loadCallRail(),
      new Promise<boolean>((resolve) => {
        readinessTimer = setTimeout(() => resolve(false), 1500);
      }),
    ]);
    if (!ready) {
      form.dataset.callrailCapture = "unavailable";
      return;
    }
    // CallRail loads its form module separately after the main snippet.
    while (!window.CallTrk?.captureForm && Date.now() < deadline)
      await new Promise((resolve) => setTimeout(resolve, 50));
    if (!window.CallTrk?.captureForm) {
      form.dataset.callrailCapture = "unavailable";
      return;
    }
    window.CallTrk.captureForm(form);
    captured.set(form, signature);
    // The vendor owns transport/persisted retries; invocation is not an ACK.
    form.dataset.callrailCapture = "queued";
  } catch {
    form.dataset.callrailCapture = "unavailable";
    // Analytics blocking must not discard an already-confirmed lead.
  } finally {
    clearTimeout(readinessTimer);
  }
}
