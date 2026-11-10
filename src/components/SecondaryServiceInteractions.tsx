"use client";
import { useEffect } from "react";

export default function SecondaryServiceInteractions({
  path,
}: {
  path: string;
}) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".secondary-service-page");
    if (!root) return;
    const activate = (button: HTMLElement) => {
      const widget = button.closest<HTMLElement>("[data-secondary-tabs]");
      const selected = button.dataset.secondaryTab;
      widget
        ?.querySelectorAll<HTMLElement>("[data-secondary-tab]")
        .forEach((tab) => {
          const active = tab === button;
          tab.setAttribute("aria-selected", String(active));
          tab.tabIndex = active ? 0 : -1;
          const surface = widget?.hasAttribute("data-secondary-process")
            ? (tab.lastElementChild as HTMLElement)
            : tab;
          if (surface)
            surface.style.backgroundColor = active ? "#00ce44" : "#ccc";
        });
      widget
        ?.querySelectorAll<HTMLElement>("[data-secondary-panel]")
        .forEach((panel) => {
          panel.hidden = panel.dataset.secondaryPanel !== selected;
        });
    };
    const click = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target.closest("[data-secondary-top]")) {
        window.scrollTo({
          top: 0,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
        return;
      }
      const arrow = target.closest<HTMLElement>("[data-secondary-arrow]");
      if (arrow) {
        let parent = arrow.parentElement;
        while (parent && parent !== root) {
          const viewport = parent.querySelector<HTMLElement>(
            "[data-secondary-carousel]",
          );
          if (viewport) {
            const direction = Number(arrow.dataset.secondaryArrow);
            const end = viewport.scrollWidth - viewport.clientWidth;
            const position =
              direction > 0 && viewport.scrollLeft >= end - 2
                ? 0
                : direction < 0 && viewport.scrollLeft <= 1
                  ? end
                  : viewport.scrollLeft +
                    direction *
                      viewport.clientWidth *
                      Number(viewport.dataset.secondaryStep || ".5");
            viewport.scrollTo({
              left: position,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            });
            return;
          }
          parent = parent.parentElement;
        }
      }
      const tab = target.closest<HTMLElement>("[data-secondary-tab]");
      if (tab) {
        activate(tab);
        return;
      }
      const faq = target.closest<HTMLElement>("[data-secondary-faq]");
      if (faq) {
        const answer = faq.nextElementSibling as HTMLElement | null;
        const open = faq.getAttribute("aria-expanded") !== "true";
        faq.setAttribute("aria-expanded", String(open));
        if (answer) answer.hidden = !open;
        return;
      }
      const button = target.closest<HTMLElement>("button");
      if (
        button &&
        /get a free quote|get a call now|start your project/i.test(
          button.textContent || "",
        )
      ) {
        event.preventDefault();
        document
          .querySelector<HTMLElement>(".migrated-page .getintouch")
          ?.click();
      }
    };
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.matches("[data-secondary-faq]") &&
        ["Enter", " "].includes(event.key)
      ) {
        event.preventDefault();
        target.click();
      }
      if (
        target.matches("[data-secondary-tab]") &&
        ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
      ) {
        event.preventDefault();
        const tabs = [
          ...target
            .closest("[data-secondary-tabs]")!
            .querySelectorAll<HTMLElement>("[data-secondary-tab]"),
        ];
        const index =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? tabs.length - 1
              : (tabs.indexOf(target) +
                  (event.key === "ArrowRight" ? 1 : -1) +
                  tabs.length) %
                tabs.length;
        activate(tabs[index]);
        tabs[index].focus();
      }
    };
    root.addEventListener("click", click);
    root.addEventListener("keydown", keydown);
    root.dataset.secondaryReady = "true";
    return () => {
      root.removeEventListener("click", click);
      root.removeEventListener("keydown", keydown);
    };
  }, [path]);
  return null;
}
