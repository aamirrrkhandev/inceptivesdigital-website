"use client";
import { useEffect } from "react";

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
let scriptReady: Promise<void> | undefined;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (!scriptReady)
    scriptReady = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptReady = undefined;
        script.remove();
        reject(new Error("Verification unavailable"));
      };
      document.head.append(script);
    });
  return scriptReady;
}
const text = (value: unknown) =>
  new DOMParser().parseFromString(String(value || ""), "text/html").body
    .textContent || "";

export default function ContactForms({ pageKey }: { pageKey: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".migrated-page");
    if (!root) return;
    let disposed = false;
    const widgets = new Map<HTMLElement, string>();
    const pending = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const container = entry.target as HTMLElement;
            if (widgets.has(container) || pending.has(container)) continue;
            pending.add(container);
            loadTurnstile()
              .then(() => {
                if (disposed || !window.turnstile) return;
                widgets.set(
                  container,
                  window.turnstile.render(container, {
                    sitekey: container.dataset.sitekey,
                    theme: container.dataset.theme || "auto",
                    size: "normal",
                    appearance: "always",
                    action: "elementor-form",
                    "error-callback": (code: string) => {
                      container.dataset.verificationError = code;
                    },
                    callback: () => {
                      delete container.dataset.verificationError;
                    },
                  }),
                );
                observer.unobserve(container);
              })
              .catch(() => {
                container.dataset.verificationError = "unavailable";
              })
              .finally(() => pending.delete(container));
          }
      },
      { rootMargin: "300px" },
    );
    root
      .querySelectorAll<HTMLElement>("[data-contact-verification]")
      .forEach((container) => observer.observe(container));
    const controllers = new Set<AbortController>();
    const submit = async (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      if (!form.matches("[data-contact-form]")) return;
      event.preventDefault();
      if (!form.reportValidity() || form.dataset.sending === "true") return;
      let status = form.querySelector<HTMLElement>("[data-form-status]");
      if (!status) {
        status = document.createElement("div");
        status.dataset.formStatus = "true";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        form.append(status);
      }
      const payload = new FormData(form);
      if (!payload.get("cf-turnstile-response")) {
        status.className = "migrated-message migrated-message-danger";
        status.textContent =
          "Please complete the security verification before sending your message.";
        return;
      }
      payload.set(
        "source_path",
        form.dataset.sourcePath ||
          root.dataset.formSourcePath ||
          root.dataset.sourcePath ||
          location.pathname,
      );
      form.dataset.sending = "true";
      form.setAttribute("aria-busy", "true");
      const button = form.querySelector<HTMLButtonElement>(
        'button[type="submit"]',
      );
      if (button) button.disabled = true;
      status.textContent = "Sending…";
      const controller = new AbortController();
      controllers.add(controller);
      try {
        const response = await fetch("/api/forms", {
          method: "POST",
          body: payload,
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || result.success !== true)
          throw new Error(
            text(result.data?.message) ||
              "Your message could not be sent. Please try again.",
          );
        status.className = "migrated-message migrated-message-success";
        status.textContent =
          text(result.data?.message) || "Your submission was successful.";
        form.reset();
        // All enquiry forms share the local completion page. Only confirmed
        // handler success reaches this branch; failures retain the entered data.
        location.assign("/thank-you");
      } catch (error) {
        if (disposed) return;
        status.className = "migrated-message migrated-message-danger";
        status.textContent =
          error instanceof Error
            ? error.message
            : "Your message could not be sent. Please try again.";
      } finally {
        controllers.delete(controller);
        if (!disposed) {
          delete form.dataset.sending;
          form.removeAttribute("aria-busy");
          if (button) button.disabled = false;
          const container = form.querySelector<HTMLElement>(
            "[data-contact-verification]",
          );
          const id = container && widgets.get(container);
          if (id) window.turnstile?.reset(id);
        }
      }
    };
    root.addEventListener("submit", submit);
    return () => {
      disposed = true;
      observer.disconnect();
      root.removeEventListener("submit", submit);
      controllers.forEach((controller) => controller.abort());
      widgets.forEach((id) => window.turnstile?.remove(id));
    };
  }, [pageKey]);
  return null;
}
