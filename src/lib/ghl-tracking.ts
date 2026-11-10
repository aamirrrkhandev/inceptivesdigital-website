"use client";

const SCRIPT_URL =
  "https://clients.inceptivesdigital.com/js/external-tracking.js";
// Public installation identifier supplied by the account's External Tracking UI.
const TRACKING_ID = "tk_92e0fd793caf40fab8810a29eb837874";
const SCRIPT_ID = "inceptives-ghl-tracking";
const hosts = new Set([
  "inceptives-homepage-review.vercel.app",
  "inceptivesdigital.com",
  "www.inceptivesdigital.com",
]);
const replays = new WeakSet<HTMLFormElement>();
type Pending = {
  resolve: () => void;
  error?: string;
  timer: ReturnType<typeof setTimeout>;
};
const pending = new Map<string, Pending>();
let ready: Promise<void> | undefined;
let instrumented = false;
export const ghlEnabled = () =>
  typeof window !== "undefined" && hosts.has(location.hostname);
export const isGhlReplay = (form: HTMLFormElement) => replays.has(form);
const isLead = (form: HTMLFormElement) =>
  form.matches("[data-contact-form],#id-ios-form");

function observeAcknowledgements() {
  if (instrumented) return;
  instrumented = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input, init) => {
    const request = originalFetch(input, init);
    try {
      const url = new URL(
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url,
        location.href,
      );
      if (
        url.origin === "https://backend.leadconnectorhq.com" &&
        url.pathname === "/external-tracking/events" &&
        typeof init?.body === "string"
      ) {
        const event = JSON.parse(init.body);
        const entry =
          event.type === "external_form_submission" &&
          event.trackingId === TRACKING_ID &&
          pending.get(event.formId);
        if (entry)
          void request
            .then(async (response) => {
              if (!response.ok) {
                entry.error =
                  "GHL could not accept your enquiry. Please retry.";
                return;
              }
              const result = await response
                .clone()
                .json()
                .catch(() => null);
              if (result?.success === false) {
                entry.error =
                  "GHL could not accept your enquiry. Please retry.";
                return;
              }
              clearTimeout(entry.timer);
              pending.delete(event.formId);
              entry.resolve();
            })
            .catch(() => {
              entry.error = "GHL is temporarily unavailable. Please retry.";
            });
      }
    } catch {
      /* Leave unrelated requests untouched. */
    }
    return request;
  };
  // Native browser submission still occurs. Suppress only the SDK's early click
  // fallback so invalid forms/backend failures never become CRM submissions.
  document.addEventListener(
    "click",
    (event) => {
      const button = (event.target as Element).closest<
        HTMLButtonElement | HTMLInputElement
      >('button[type="submit"],input[type="submit"]');
      if (button?.form && isLead(button.form)) event.stopPropagation();
    },
    true,
  );
}

export function ensureGhlTracking(): Promise<void> {
  if (!ghlEnabled()) return Promise.resolve();
  if (ready) return ready;
  observeAcknowledgements();
  ready = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.async = true;
    script.dataset.trackingId = TRACKING_ID;
    script.onload = () => {
      document.documentElement.dataset.ghlTracking = "ready";
      resolve();
    };
    script.onerror = () => {
      script.remove();
      ready = undefined;
      document.documentElement.dataset.ghlTracking = "unavailable";
      reject(new Error("GHL tracking could not load. Please retry."));
    };
    document.body.append(script);
  });
  return ready;
}

export async function recordGhlSubmission(
  form: HTMLFormElement,
): Promise<void> {
  // Local and immutable-preview automated tests never create real CRM records.
  if (!ghlEnabled()) return;
  let loadTimer: ReturnType<typeof setTimeout> | undefined;
  try {
    await Promise.race([
      ensureGhlTracking(),
      new Promise<never>((_, reject) => {
        loadTimer = setTimeout(
        () => reject(new Error("GHL tracking is unavailable. Please retry.")),
        12000,
        );
      }),
    ]);
  } finally {
    clearTimeout(loadTimer);
  }
  const id = form.id || form.name;
  if (!id) throw new Error("This form's GHL mapping is unavailable.");
  if (pending.has(id))
    throw new Error("Your enquiry is already being recorded.");
  await new Promise<void>((resolve, reject) => {
    const entry: Pending = {
      resolve,
      timer: setTimeout(() => {
        pending.delete(id);
        reject(
          new Error(
            entry.error || "GHL did not confirm your enquiry. Please retry.",
          ),
        );
      }, 20000),
    };
    pending.set(id, entry);
    replays.add(form);
    form.addEventListener("submit", (event) => event.preventDefault(), {
      once: true,
    });
    try {
      form.dispatchEvent(
        new SubmitEvent("submit", { bubbles: true, cancelable: true }),
      );
    } finally {
      replays.delete(form);
    }
  });
}
