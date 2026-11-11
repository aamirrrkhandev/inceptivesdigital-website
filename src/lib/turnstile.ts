"use client";

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
let loading: Promise<void> | undefined;
function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = "inceptives-turnstile";
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    let settled = false;
    const finish = (success: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (success) resolve();
      else {
        script.remove();
        loading = undefined;
        reject(
          new Error("Security verification is unavailable. Please retry."),
        );
      }
    };
    const timer = setTimeout(() => finish(false), 10000);
    script.onload = () => finish(Boolean(window.turnstile));
    script.onerror = () => finish(false);
    document.head.append(script);
  });
  return loading;
}

export function createTurnstileProtection(root: HTMLElement, selector = "[data-contact-verification]") {
  const widgets = new Map<HTMLElement, { id: string; size: string }>();
  const pending = new Set<HTMLElement>();
  let disposed = false;
  const sizeFor = (container: HTMLElement) => {
    const widths = [
      container.getBoundingClientRect().width,
      container.parentElement?.getBoundingClientRect().width || 0,
      container.closest("form")?.getBoundingClientRect().width || 0,
      window.innerWidth - 32,
    ].filter((width) => width > 0);
    return Math.min(...widths) < 300 ? "compact" : "normal";
  };
  const render = async (container: HTMLElement) => {
    if (disposed || pending.has(container) || widgets.has(container)) return;
    pending.add(container);
    container.dataset.verificationState = "loading";
    try {
      await loadTurnstile();
      if (disposed || !root.contains(container) || !window.turnstile) return;
      const size = sizeFor(container);
      const id = window.turnstile.render(container, {
        sitekey:
          window.location.hostname === "inceptives-homepage-review.vercel.app"
            ? process.env.NEXT_PUBLIC_STAGING_TURNSTILE_SITE_KEY || container.dataset.sitekey
            : ["inceptivesdigital.com", "www.inceptivesdigital.com"].includes(window.location.hostname)
              ? process.env.NEXT_PUBLIC_PRODUCTION_TURNSTILE_SITE_KEY
              : container.dataset.sitekey,
        theme: container.dataset.theme || "auto",
        size,
        appearance: "always",
        action: "elementor-form",
        "refresh-expired": "auto",
        "refresh-timeout": "auto",
        "error-callback": (code: string) => {
          container.dataset.verificationError = code;
          container.dataset.verificationState = "error";
        },
        "expired-callback": () => {
          container.dataset.verificationState = "expired";
        },
        "timeout-callback": () => {
          container.dataset.verificationState = "expired";
        },
        callback: () => {
          delete container.dataset.verificationError;
          container.dataset.verificationState = "ready";
          // Never forward challenge tokens as analytics form fields.
          container
            .querySelectorAll("input")
            .forEach((input) => input.setAttribute("data-cr-no-capture", ""));
        },
      });
      widgets.set(container, { id, size });
      intersections.unobserve(container);
    } catch {
      container.dataset.verificationError = "unavailable";
      container.dataset.verificationState = "error";
    } finally {
      pending.delete(container);
    }
  };
  const intersections = new IntersectionObserver(
    (entries) => {
      for (const entry of entries)
        if (entry.isIntersecting) void render(entry.target as HTMLElement);
    },
    { rootMargin: "300px" },
  );
  const resizing = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const container = entry.target as HTMLElement;
      const widget = widgets.get(container);
      if (
        widget &&
        entry.contentRect.width > 0 &&
        widget.size !== sizeFor(container)
      ) {
        window.turnstile?.remove(widget.id);
        widgets.delete(container);
        void render(container);
      }
    }
  });
  const watch = (node: Element) => {
    const containers = [...node.querySelectorAll<HTMLElement>(selector)];
    if (node.matches(selector)) containers.push(node as HTMLElement);
    containers.forEach((container) => {
      intersections.observe(container);
      resizing.observe(container);
    });
  };
  const mutations = new MutationObserver((records) => {
    for (const record of records)
      for (const node of record.addedNodes)
        if (node instanceof Element) watch(node);
    for (const [container, widget] of widgets)
      if (!root.contains(container)) {
        window.turnstile?.remove(widget.id);
        intersections.unobserve(container);
        resizing.unobserve(container);
        widgets.delete(container);
      }
  });
  mutations.observe(root, { childList: true, subtree: true });
  watch(root);
  return {
    ensure(form: HTMLFormElement) {
      const container = form.querySelector<HTMLElement>(selector);
      if (!container) return;
      const widget = widgets.get(container);
      if (!widget) void render(container);
      else if (
        ["error", "expired"].includes(container.dataset.verificationState || "")
      ) {
        container.dataset.verificationState = "loading";
        window.turnstile?.reset(widget.id);
      }
    },
    reset(form: HTMLFormElement) {
      const container = form.querySelector<HTMLElement>(selector);
      const widget = container && widgets.get(container);
      if (widget && container) {
        container.dataset.verificationState = "loading";
        window.turnstile?.reset(widget.id);
      }
    },
    dispose() {
      disposed = true;
      intersections.disconnect();
      resizing.disconnect();
      mutations.disconnect();
      widgets.forEach(({ id }) => window.turnstile?.remove(id));
      widgets.clear();
    },
  };
}
