"use client";
import { useEffect } from "react";
export default function SiteInteractions({ pageKey }: { pageKey: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".migrated-page");
    if (!root) return;
    const cleanups: (() => void)[] = [];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const menuItems = [...root.querySelectorAll<HTMLElement>(".sitekit-megamenu-has")];
    const alignMenus = () => {
      menuItems.forEach((item) => {
        const panel = item.querySelector<HTMLElement>(":scope > .sitekit-megamenu-panel");
        if (!panel) return;
        if (innerWidth < 1025) {
          panel.style.removeProperty("left");
          panel.style.removeProperty("width");
          return;
        }
        const parent = panel.offsetParent as HTMLElement | null;
        panel.style.setProperty("left", `${-(parent?.getBoundingClientRect().left || 0)}px`, "important");
        panel.style.setProperty("width", `${document.documentElement.clientWidth}px`, "important");
      });
    };
    const menuResize = new ResizeObserver(alignMenus);
    menuItems.forEach((item) => {
      const link = item.querySelector<HTMLAnchorElement>(":scope > a");
      if (!link) return;
      const open = () => {
        item.classList.remove("migration-menu-dismissed");
        item.classList.add("migration-menu-open");
        link.setAttribute("aria-expanded", "true");
        alignMenus();
      };
      const close = () => {
        item.classList.remove("migration-menu-open");
        link.setAttribute("aria-expanded", "false");
      };
      const enter = () => { if (innerWidth >= 1025) open(); };
      const leave = () => { if (innerWidth >= 1025 && !item.contains(document.activeElement)) close(); };
      const focus = () => { if (innerWidth >= 1025) open(); };
      const blur = (e: FocusEvent) => { if (!item.contains(e.relatedTarget as Node)) close(); };
      const key = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" && e.target === link) {
          e.preventDefault(); open();
          item.querySelector<HTMLElement>(".sitekit-megamenu-panel a[href]")?.focus();
        }
        if (e.key === "Escape") {
          e.preventDefault(); close(); link.focus();
          item.classList.add("migration-menu-dismissed");
          link.setAttribute("aria-expanded", "false");
        }
      };
      item.addEventListener("mouseenter", enter);
      item.addEventListener("mouseleave", leave);
      item.addEventListener("focusin", focus);
      item.addEventListener("focusout", blur);
      item.addEventListener("keydown", key);
      menuResize.observe(item.parentElement || item);
      cleanups.push(() => {
        item.removeEventListener("mouseenter", enter);
        item.removeEventListener("mouseleave", leave);
        item.removeEventListener("focusin", focus);
        item.removeEventListener("focusout", blur);
        item.removeEventListener("keydown", key);
      });
    });
    alignMenus();
    window.addEventListener("resize", alignMenus);
    cleanups.push(() => { menuResize.disconnect(); window.removeEventListener("resize", alignMenus); });
    const backgroundObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("e-lazyloaded");
            backgroundObserver.unobserve(entry.target);
          }
        }),
      { rootMargin: "150px" },
    );
    root
      .querySelectorAll(".e-con.e-parent")
      .forEach((e) => backgroundObserver.observe(e));
    cleanups.push(() => backgroundObserver.disconnect());
    root
      .querySelectorAll<HTMLElement>(".id-standalone-marquee")
      .forEach((marquee) => {
        const track = marquee.querySelector<HTMLElement>(
            ".id-standalone-marquee__track",
          ),
          first = marquee.querySelector<HTMLElement>(
            ".id-standalone-marquee__group",
          );
        if (!track || !first) return;
        const originals = [...first.children].map((e) => e.cloneNode(true));
        const build = () => {
          first.replaceChildren(...originals.map((e) => e.cloneNode(true)));
          const base = first.getBoundingClientRect().width;
          if (!base) return;
          const rounds = Math.max(
            1,
            Math.ceil((marquee.clientWidth + base) / base),
          );
          for (let i = 1; i < rounds; i++)
            originals.forEach((e) => first.appendChild(e.cloneNode(true)));
          track
            .querySelectorAll(".id-standalone-marquee__group")
            .forEach((e, i) => {
              if (i) e.remove();
            });
          const repeat = first.cloneNode(true) as HTMLElement;
          repeat.setAttribute("aria-hidden", "true");
          repeat.querySelectorAll("img").forEach((img) => (img.alt = ""));
          track.append(repeat);
          marquee.style.setProperty(
            "--id-marquee-duration",
            (
              first.getBoundingClientRect().width /
              (Number(marquee.dataset.speed) || 108)
            ).toFixed(3) + "s",
          );
          marquee.classList.add("is-ready");
        };
        const observer = new ResizeObserver(build);
        observer.observe(marquee);
        build();
        cleanups.push(() => observer.disconnect());
      });
    const mediaObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el instanceof HTMLVideoElement) {
            const parent = el.closest<HTMLElement>("[data-background-video]");
            if (
              parent &&
              !el.querySelector("source") &&
              !el.getAttribute("src")
            )
              el.src = parent.dataset.backgroundVideo || "";
            if (el.dataset.mediaSrc)
              el.src =
                innerWidth < 768 && el.dataset.mobileSrc
                  ? el.dataset.mobileSrc
                  : el.dataset.mediaSrc;
            else
              el.querySelectorAll<HTMLSourceElement>(
                "source[data-media-src]",
              ).forEach((s) => (s.src = s.dataset.mediaSrc || ""));
            el.load();
            if (!reduced) void el.play().catch(() => {});
          }
          if (el instanceof HTMLIFrameElement) {
            el.src = el.dataset.embedSrc || "";
            el.addEventListener(
              "load",
              () => {
                const popup = el.closest("#schedulePopup");
                popup?.classList.add("calendly-loaded");
              },
              { once: true },
            );
          }
          mediaObserver.unobserve(el);
        }
      },
      { rootMargin: "160px" },
    );
    root
      .querySelectorAll<HTMLVideoElement | HTMLIFrameElement>(
        "video,iframe[data-embed-src]",
      )
      .forEach((e) => mediaObserver.observe(e));
    cleanups.push(() => mediaObserver.disconnect());
    root
      .querySelectorAll<HTMLElement>('[data-widget="counter.default"]')
      .forEach((el) => {
        const number = el.querySelector<HTMLElement>("[data-to-value]");
        if (number)
          number.textContent = Number(
            number.dataset.toValue || 0,
          ).toLocaleString();
      });
    root.querySelectorAll<HTMLElement>("[role=tablist]").forEach((list) => {
      const tabs = [...list.querySelectorAll<HTMLElement>("[role=tab]")];
      const activate = (tab: HTMLElement) => {
        tabs.forEach((t) => {
          const selected = t === tab;
          t.setAttribute("aria-selected", String(selected));
          t.tabIndex = selected ? 0 : -1;
          const panel = document.getElementById(
            t.getAttribute("aria-controls") || "",
          );
          if (panel) {
            panel.hidden = !selected;
            panel.classList.toggle("e-active", selected);
            panel.style.display = selected ? "" : "none";
          }
        });
      };
      const click = (e: Event) => {
        const tab = (e.target as Element).closest<HTMLElement>("[role=tab]");
        if (tab && tabs.includes(tab)) activate(tab);
      };
      const key = (e: KeyboardEvent) => {
        const current = (e.target as Element).closest<HTMLElement>(
          "[role=tab]",
        );
        const i = tabs.indexOf(current!);
        if (i < 0) return;
        let next = i;
        if (e.key === "ArrowRight" || e.key === "ArrowDown")
          next = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
          next = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = tabs.length - 1;
        else return;
        e.preventDefault();
        activate(tabs[next]);
        tabs[next].focus();
      };
      list.addEventListener("click", click);
      list.addEventListener("keydown", key);
      if (tabs[0])
        activate(
          tabs.find((t) => t.getAttribute("aria-selected") === "true") ||
            tabs[0],
        );
      cleanups.push(() => {
        list.removeEventListener("click", click);
        list.removeEventListener("keydown", key);
      });
    });
    root
      .querySelectorAll<HTMLElement>(".swiper,.swiper-container")
      .forEach((container) => {
        const wrapper = container.querySelector<HTMLElement>(
          ":scope > .swiper-wrapper",
        );
        if (!wrapper) return;
        const slides = [...wrapper.children] as HTMLElement[];
        if (!slides.length) return;
        const widget = container.closest<HTMLElement>("[data-config]");
        let settings: Record<string, unknown> = {};
        try {
          settings = JSON.parse(widget?.dataset.config || "{}");
        } catch {}
        let current = 0;
        const show = () => {
          const n =
            innerWidth < 768
              ? Number(settings.slides_to_show_mobile || 1)
              : innerWidth < 1025
                ? Number(
                    settings.slides_to_show_tablet ||
                      settings.slides_to_show ||
                      1,
                  )
                : Number(settings.slides_to_show || 1);
          slides.forEach((s) => {
            s.style.flex = "0 0 " + 100 / n + "%";
            s.style.width = 100 / n + "%";
          });
          current = Math.min(current, Math.max(0, slides.length - n));
          wrapper.style.transform = `translate3d(${(-current * container.clientWidth) / n}px,0,0)`;
          wrapper.style.transitionDuration =
            Number(settings.speed || 500) + "ms";
        };
        const advance = (direction: number) => {
          const n =
            innerWidth < 768
              ? Number(settings.slides_to_show_mobile || 1)
              : Number(settings.slides_to_show || 1);
          current += direction;
          if (current > slides.length - n) current = 0;
          if (current < 0) current = Math.max(0, slides.length - n);
          show();
        };
        const controls = widget || container.parentElement!;
        const onClick = (e: Event) => {
          const target = (e.target as Element).closest(
            '[aria-label="Next slide"],.swiper-button-next,.migrated-swiper-button-next,[aria-label="Previous slide"],.swiper-button-prev,.migrated-swiper-button-prev',
          );
          if (target) {
            e.preventDefault();
            advance(
              target.getAttribute("aria-label") === "Previous slide" ||
                target.className.toString().includes("prev")
                ? -1
                : 1,
            );
          }
        };
        controls.addEventListener("click", onClick);
        const resize = new ResizeObserver(show);
        resize.observe(container);
        show();
        let hover = false;
        const enter = () => (hover = true),
          leave = () => (hover = false);
        container.addEventListener("mouseenter", enter);
        container.addEventListener("mouseleave", leave);
        const timer =
          !reduced && settings.autoplay === "yes"
            ? setInterval(
                () => {
                  if (!hover && !document.hidden) advance(1);
                },
                Number(settings.autoplay_speed) || 5000,
              )
            : null;
        cleanups.push(() => {
          resize.disconnect();
          controls.removeEventListener("click", onClick);
          container.removeEventListener("mouseenter", enter);
          container.removeEventListener("mouseleave", leave);
          if (timer) clearInterval(timer);
        });
      });
    let previousFocus: HTMLElement | null = null;
    const openPopup = (id: string) => {
      const popup = document.getElementById(id);
      if (!popup) return;
      previousFocus = document.activeElement as HTMLElement;
      popup.hidden = false;
      popup.classList.add("active", "is-open", "migration-visible");
      popup.setAttribute("aria-hidden", "false");
      popup
        .querySelectorAll<HTMLIFrameElement>("iframe[data-embed-src]")
        .forEach((f) => {
          if (!f.src) f.src = f.dataset.embedSrc || "";
        });
      if (id === "schedulePopup") popup.classList.add("calendly-loaded");
      popup.querySelector<HTMLElement>("button,input,a")?.focus();
    };
    const closePopups = () => {
      for (const id of ["schedulePopup", "id-contact-popup"]) {
        const popup = document.getElementById(id);
        if (popup) {
          popup.hidden = true;
          popup.classList.remove("active", "is-open", "migration-visible");
          popup.setAttribute("aria-hidden", "true");
        }
      }
      previousFocus?.focus();
    };
    const click = (e: MouseEvent) => {
      const target = e.target as Element;
      const toggle = target.closest<HTMLElement>(".sitekit-menu-toggler");
      if (toggle) {
        e.preventDefault();
        const menu = root.querySelector<HTMLElement>(".sitekit-menu-container");
        const expanded = toggle.getAttribute("aria-expanded") !== "true";
        root
          .querySelectorAll(".sitekit-menu-toggler")
          .forEach((t) => t.setAttribute("aria-expanded", String(expanded)));
        menu?.classList.toggle("active", expanded);
        menu?.classList.toggle("sitekit-menu-offcanvas-elements", expanded);
        return;
      }
      const link = target.closest<HTMLAnchorElement>("a");
      const button = target.closest<HTMLElement>("button,a");
      if (button && /schedule\s*a?\s*call/i.test(button.textContent || "")) {
        e.preventDefault();
        openPopup("schedulePopup");
        return;
      }
      if (
        button &&
        /get a call now|start my product roadmap|get in touch|discuss your project/i.test(
          button.textContent || "",
        ) &&
        (!link ||
          !link.getAttribute("href") ||
          ["#", "#!"].includes(link.getAttribute("href") || ""))
      ) {
        e.preventDefault();
        openPopup("id-contact-popup");
        return;
      }
      if (
        target.closest(
          ".schedule-popup-close,.id-cp__close,[data-close-popup],.id-cp-close",
        ) ||
        target.id === "schedulePopup" ||
        target.id === "id-contact-popup"
      ) {
        closePopups();
        return;
      }
      const menuLink = target.closest<HTMLElement>(
        ".sitekit-megamenu-has > a, .menu-item-has-children > a",
      );
      if (menuLink && innerWidth < 1025) {
        e.preventDefault();
        menuLink.parentElement?.classList.remove("migration-menu-dismissed");
        menuLink.parentElement?.classList.toggle("migration-menu-open");
        menuLink.setAttribute(
          "aria-expanded",
          String(
            menuLink.parentElement?.classList.contains("migration-menu-open"),
          ),
        );
      }
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePopups();
        root
          .querySelectorAll(".migration-menu-open")
          .forEach((e) => e.classList.remove("migration-menu-open"));
      }
    };
    const submit = (e: SubmitEvent) => {
      const form = e.target as HTMLFormElement;
      if (!form.matches("[data-staging-form]")) return;
      e.preventDefault();
      if (!form.reportValidity()) return;
      let status = form.querySelector<HTMLElement>("[role=status]");
      if (!status) {
        status = document.createElement("p");
        status.setAttribute("role", "status");
        form.append(status);
      }
      status.textContent =
        "Staging preview: your message has not been sent. Live submission handling is pending verification.";
    };
    root.addEventListener("click", click);
    root.addEventListener("keydown", key);
    root.addEventListener("submit", submit);
    root.dataset.interactionsReady = "true";
    cleanups.push(() => {
      delete root.dataset.interactionsReady;
      root.removeEventListener("click", click);
      root.removeEventListener("keydown", key);
      root.removeEventListener("submit", submit);
    });
    return () => cleanups.forEach((fn) => fn());
  }, [pageKey]);
  return null;
}
