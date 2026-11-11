"use client";
import { useEffect } from "react";
import { isGhlReplay, recordGhlSubmission } from "@/lib/ghl-tracking";
import { captureCallRailSubmission } from "@/lib/callrail";
import { createTurnstileProtection } from "@/lib/turnstile";
import { recordConfirmedLead } from "@/lib/conversion-tracking";

const text = (value: unknown) =>
  new DOMParser().parseFromString(String(value || ""), "text/html").body
    .textContent || "";

export default function ContactForms({ pageKey }: { pageKey: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".migrated-page");
    if (!root) return;
    let disposed = false;
    const protection = createTurnstileProtection(root, "[data-contact-form] [data-contact-verification]");
    const controllers = new Set<AbortController>();
    const delivered = new WeakMap<HTMLFormElement, string>();
    const submit = async (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      if (!form.matches("[data-contact-form]")) return;
      event.preventDefault();
      if (isGhlReplay(form)) return;
      event.stopPropagation();
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
      const signature = JSON.stringify(
        [...payload.entries()].filter(
          ([key]) => key !== "cf-turnstile-response",
        ),
      );
      if (!payload.get("cf-turnstile-response")) {
        protection.ensure(form);
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
        let result = {
          success: true,
          data: { message: "Your submission was successful." },
        };
        if (delivered.get(form) !== signature) {
          const response = await fetch("/api/forms", {
            method: "POST",
            body: payload,
            signal: controller.signal,
          });
          result = await response.json();
          if (!response.ok || result.success !== true)
            throw new Error(
              text(result.data?.message) ||
                "Your message could not be sent. Please try again.",
            );
          delivered.set(form, signature);
        }
        status.textContent = "Recording your enquiry…";
        await recordGhlSubmission(form);
        await captureCallRailSubmission(form);
        await recordConfirmedLead(form);
        delivered.delete(form);
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
          protection.reset(form);
        }
      }
    };
    root.addEventListener("submit", submit, true);
    return () => {
      disposed = true;
      protection.dispose();
      root.removeEventListener("submit", submit, true);
      controllers.forEach((controller) => controller.abort());
    };
  }, [pageKey]);
  return null;
}
