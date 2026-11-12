"use client";
import { useEffect } from "react";
import { initializeCalendarPopup } from "@/lib/calendar-popup";
import { isCalendarCTA, isUnwiredEnquiryCTA } from "@/lib/cta-intent";
import { initializeAIEstimator } from "@/lib/ai-estimator";
import { initializeContactTestimonials } from "@/lib/contact-testimonials";
export default function SiteInteractions({ pageKey }: { pageKey: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".migrated-page");
    if (!root) return;
    const cleanups: (() => void)[] = [];
    cleanups.push(initializeAIEstimator(root));
    const testimonials = initializeContactTestimonials(root);
    cleanups.push(testimonials.dispose);
    const headingColumns = new ResizeObserver(entries => {
      for (const entry of entries) {
        const column = entry.target as HTMLElement;
        const width = Math.round(entry.contentRect.width);
        if (width > 0 && column.style.getPropertyValue("--heading-column-width") !== `${width}px`)
          column.style.setProperty("--heading-column-width", `${width}px`);
      }
    });
    root.querySelectorAll(".migrated-widget-heading").forEach(column => headingColumns.observe(column));
    cleanups.push(() => headingColumns.disconnect());
    root.querySelectorAll<HTMLElement>(".scroll-sty").forEach(region => {
      if (!region.hasAttribute("tabindex")) region.tabIndex = 0;
      const heading = region.closest(".e-parent")?.querySelector("h2,h3");
      if (heading && !region.hasAttribute("aria-label") && !region.hasAttribute("aria-labelledby")) {
        region.setAttribute("role", "region");
        region.setAttribute("aria-label", heading.textContent?.trim() || "Scrollable content");
      }
    });
    const calendar = initializeCalendarPopup(root);
    cleanups.push(calendar.dispose);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const menuItems = [
      ...root.querySelectorAll<HTMLElement>(".sitekit-megamenu-has"),
    ];
    const alignMenus = () => {
      document.documentElement.classList.toggle(
        "migration-mobile-menu-open",
        innerWidth < 1025 &&
          !!root.querySelector(".sitekit-menu-container.active"),
      );
      menuItems.forEach((item) => {
        const panel = item.querySelector<HTMLElement>(
          ":scope > .sitekit-megamenu-panel",
        );
        if (!panel) return;
        if (innerWidth < 1025) {
          panel.style.removeProperty("left");
          panel.style.removeProperty("width");
          return;
        }
        const parent = panel.offsetParent as HTMLElement | null;
        panel.style.setProperty(
          "left",
          `${-(parent?.getBoundingClientRect().left || 0)}px`,
          "important",
        );
        panel.style.setProperty(
          "width",
          `${document.documentElement.clientWidth}px`,
          "important",
        );
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
      const enter = () => {
        if (innerWidth >= 1025) open();
      };
      const leave = () => {
        if (innerWidth >= 1025 && !item.contains(document.activeElement))
          close();
      };
      const focus = () => {
        if (innerWidth >= 1025) open();
      };
      const blur = (e: FocusEvent) => {
        if (!item.contains(e.relatedTarget as Node)) close();
      };
      const key = (e: KeyboardEvent) => {
        if (e.key === "ArrowDown" && e.target === link) {
          e.preventDefault();
          open();
          item
            .querySelector<HTMLElement>(".sitekit-megamenu-panel a[href]")
            ?.focus();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          link.focus();
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
    cleanups.push(() => {
      menuResize.disconnect();
      window.removeEventListener("resize", alignMenus);
    });
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
            if (!reduced && !el.closest(".home-container-sty"))
              void el.play().catch(() => {});
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
        .forEach((e) => { if (!e.closest("#schedulePopup")) mediaObserver.observe(e); });
    cleanups.push(() => mediaObserver.disconnect());
    root
      .querySelectorAll<HTMLElement>(".home-container-sty")
      .forEach((card) => {
        const video = card.querySelector<HTMLVideoElement>("video");
        if (!video) return;
        const play = () => {
          if (!reduced) void video.play().catch(() => {});
        };
        const pause = () => {
          if (!card.matches(":hover") && !card.contains(document.activeElement))
            video.pause();
        };
        card.addEventListener("mouseenter", play);
        card.addEventListener("focusin", play);
        card.addEventListener("mouseleave", pause);
        card.addEventListener("focusout", pause);
        cleanups.push(() => {
          card.removeEventListener("mouseenter", play);
          card.removeEventListener("focusin", play);
          card.removeEventListener("mouseleave", pause);
          card.removeEventListener("focusout", pause);
          video.pause();
        });
      });
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
      if (list.closest("#id-contact-popup")) return;
      const tabs = [...list.querySelectorAll<HTMLElement>("[role=tab]")];
      const activate = (tab: HTMLElement, reveal = false) => {
        tabs.forEach((t) => {
          const selected = t === tab;
          t.setAttribute("aria-selected", String(selected));
          t.classList.toggle("activeicons-btn", selected);
          if (t.closest(".tabsteck-logssect"))
            t.classList.toggle("active", selected);
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
        if (reveal && list.closest(".patient-tab")) {
          tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        }
      };
      const click = (e: Event) => {
        const tab = (e.target as Element).closest<HTMLElement>("[role=tab]");
        if (tab && tabs.includes(tab)) activate(tab, true);
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
        activate(tabs[next], true);
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
      .querySelectorAll<HTMLElement>(
        ".swiper:not([data-managed-carousel]),.swiper-container:not([data-managed-carousel])",
      )
      .forEach((container) => {
        const wrapper = container.querySelector<HTMLElement>(
          ":scope > .swiper-wrapper",
        );
        if (!wrapper) return;
        const slides = [...wrapper.children] as HTMLElement[];
        if (!slides.length) return;
        if (container.getAttribute("role") === "list") {
          container.setAttribute("aria-live", wrapper.getAttribute("aria-live") || "off");
          wrapper.removeAttribute("aria-live");
          wrapper.setAttribute("role", "presentation");
          slides.forEach(slide => slide.setAttribute("role", "listitem"));
        }
        const widget = container.closest<HTMLElement>("[data-config]");
        let settings: Record<string, unknown> = {};
        try {
          settings = JSON.parse(widget?.dataset.config || "{}");
        } catch {}
        let current = 0;
        let interacted = false;
        const slidesPerView = () =>
          Math.max(1, Math.min(slides.length,
            innerWidth < 768
              ? Number(settings.slides_to_show_mobile || 1)
              : innerWidth < 1025
                ? Number(
                    settings.slides_to_show_tablet ||
                      settings.slides_to_show ||
                      1,
                  )
                : Number(settings.slides_to_show || 1)));
        const show = () => {
          const n = slidesPerView();
          const gap = parseFloat(getComputedStyle(wrapper).columnGap) || 0;
          const slideWidth = Math.max(0, (container.clientWidth - gap * (n - 1)) / n);
          current = Math.min(current, Math.max(0, slides.length - n));
          slides.forEach((s, index) => {
            s.style.flex = `0 0 ${slideWidth}px`;
            s.style.width = `${slideWidth}px`;
            s.inert = index < current || index >= current + n;
            s.setAttribute("aria-hidden", String(s.inert));
          });
          wrapper.style.transform = `translate3d(${-current * (slideWidth + gap)}px,0,0)`;
          wrapper.style.transitionDuration =
            (reduced ? 0 : Number(settings.speed || 500)) + "ms";
        };
        const advance = (direction: number) => {
          const n = slidesPerView();
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
            if (settings.pause_on_interaction === "yes") interacted = true;
            advance(
              target.getAttribute("aria-label") === "Previous slide" ||
                target.className.toString().includes("prev")
                ? -1
                : 1,
            );
          }
        };
        controls.addEventListener("click", onClick);
        const onControlKey = (event: KeyboardEvent) => {
          if (!["Enter", " "].includes(event.key)) return;
          const arrow = (event.target as Element).closest<HTMLElement>(
            '[aria-label="Next slide"],.swiper-button-next,.migrated-swiper-button-next,[aria-label="Previous slide"],.swiper-button-prev,.migrated-swiper-button-prev',
          );
          if (arrow && !arrow.matches("button,input,a")) {
            event.preventDefault();
            arrow.click();
          }
        };
        controls.addEventListener("keydown", onControlKey);
        let touch: { x: number; y: number } | null = null;
        const touchStart = (event: TouchEvent) => {
          touch = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        };
        const touchEnd = (event: TouchEvent) => {
          if (!touch) return;
          const dx = event.changedTouches[0].clientX - touch.x;
          const dy = event.changedTouches[0].clientY - touch.y;
          touch = null;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
            if (settings.pause_on_interaction === "yes") interacted = true;
            advance(dx < 0 ? 1 : -1);
          }
        };
        container.style.touchAction = "pan-y pinch-zoom";
        container.addEventListener("touchstart", touchStart, { passive: true });
        container.addEventListener("touchend", touchEnd, { passive: true });
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
                  if (!hover && !interacted && !document.hidden && !controls.contains(document.activeElement)) advance(1);
                },
                Number(settings.autoplay_speed) || 5000,
              )
            : null;
        cleanups.push(() => {
          resize.disconnect();
          controls.removeEventListener("click", onClick);
          controls.removeEventListener("keydown", onControlKey);
          container.removeEventListener("touchstart", touchStart);
          container.removeEventListener("touchend", touchEnd);
          container.removeEventListener("mouseenter", enter);
          container.removeEventListener("mouseleave", leave);
          if (timer) clearInterval(timer);
        });
      });
    let previousFocus: HTMLElement | null = null;
    const openPopup = (id: string, trigger?: HTMLElement) => {
      const popup = document.getElementById(id);
      if (!popup) return;
      previousFocus = trigger || document.activeElement as HTMLElement;
      popup.hidden = false;
      popup.classList.add("active", "is-open", "migration-visible");
      popup.setAttribute("aria-hidden", "false");
      document.body.classList.add("id-cp-lock");
      if (id === "schedulePopup") calendar.load();
      else popup
        .querySelectorAll<HTMLIFrameElement>("iframe[data-embed-src]")
        .forEach((f) => {
          if (!f.getAttribute("src")) f.src = f.dataset.embedSrc || "";
        });
      popup.querySelector<HTMLElement>("button,input,a")?.focus();
      if (id === "id-contact-popup") testimonials.open();
    };
    const closePopups = () => {
      testimonials.close();
      for (const id of ["schedulePopup", "id-contact-popup"]) {
        const popup = document.getElementById(id);
        if (popup) {
          popup.hidden = true;
          popup.classList.remove("active", "is-open", "migration-visible");
          popup.setAttribute("aria-hidden", "true");
        }
      }
      document.body.classList.remove("id-cp-lock");
      previousFocus?.focus();
      previousFocus = null;
    };
    const click = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        target.closest(".getintouch") &&
        !target.closest("#id-contact-popup")
      ) {
        e.preventDefault();
        openPopup("id-contact-popup", target.closest<HTMLElement>(".getintouch") || undefined);
        return;
      }
      const card = target.closest<HTMLElement>("[data-cwa-index]");
      if (card) {
        const section = card.closest("[id^='cwa-']");
        const selected = Number(card.dataset.cwaIndex);
        section
          ?.querySelectorAll<HTMLElement>("[data-cwa-index]")
          .forEach((el, i) => {
            el.classList.toggle("is-active", i === selected);
            el.setAttribute("aria-pressed", String(i === selected));
          });
        section
          ?.querySelectorAll<HTMLElement>("[data-cwa-content]")
          .forEach((el, i) => {
            el.hidden = i !== selected;
          });
        const number = section?.querySelector(".cwa-v2-number");
        if (number) number.textContent = String(selected + 1).padStart(2, "0");
      }
      const toggle = target.closest<HTMLElement>(".sitekit-menu-toggler");
      if (toggle) {
        e.preventDefault();
        const menu = root.querySelector<HTMLElement>(".sitekit-menu-container");
        const expanded =
          toggle.matches(".sitekit-menu-hamburger") &&
          !menu?.classList.contains("active");
        root
          .querySelectorAll(".sitekit-menu-toggler")
          .forEach((t) => t.setAttribute("aria-expanded", String(expanded)));
        menu?.classList.toggle("active", expanded);
        document.documentElement.classList.toggle(
          "migration-mobile-menu-open",
          innerWidth < 1025 && !!expanded,
        );
        // This class supplies fixed positioning in both states; only `active` changes.
        menu?.classList.add("sitekit-menu-offcanvas-elements");
        if (expanded && innerWidth < 1025) {
          menu?.querySelector<HTMLElement>(".sitekit-menu-close, a[href], button")?.focus();
        }
        if (!expanded) {
          menu?.querySelectorAll(".migration-menu-open").forEach((item) => {
            item.classList.remove("migration-menu-open");
            item
              .querySelector(":scope > a")
              ?.setAttribute("aria-expanded", "false");
          });
          root.querySelector<HTMLElement>(".sitekit-menu-hamburger")?.focus();
        }
        return;
      }
      const link = target.closest<HTMLAnchorElement>("a");
      const button = target.closest<HTMLElement>("button,a");
      if (button && !button.closest('form') && isCalendarCTA(button.textContent || "")) {
        e.preventDefault();
        openPopup("schedulePopup", button);
        return;
      }
      if (button && isUnwiredEnquiryCTA(button)) {
        e.preventDefault();
        openPopup('id-contact-popup', button);
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
        openPopup("id-contact-popup", button);
        return;
      }
      if (
        target.closest(
          ".schedule-popup-close,.id-cp__close,[data-close-popup],[data-idcp-close],.id-cp-close",
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
      const action = (e.target as Element).closest<HTMLElement>('a[role="button"]');
      if (action && (e.key === " " || (e.key === "Enter" && !action.hasAttribute("href")))) {
        e.preventDefault();
        action.click();
        return;
      }
      if (e.key === "Tab") {
        const drawer = innerWidth < 1025
          ? root.querySelector<HTMLElement>(".sitekit-menu-container.active")
          : null;
        if (drawer) {
          const items = [...drawer.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',
          )].filter(el => el.tabIndex >= 0 && el.getClientRects().length &&
            getComputedStyle(el).visibility !== "hidden" && !el.closest("[hidden],[inert]"));
          const first = items[0], last = items.at(-1);
          if (!drawer.contains(document.activeElement) || (e.shiftKey && document.activeElement === first)) {
            e.preventDefault();
            (e.shiftKey ? last : first)?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
        const popup = document.querySelector<HTMLElement>(
          "#id-contact-popup.is-open,#schedulePopup.is-open",
        );
        if (popup) {
          const items = [
            ...popup.querySelectorAll<HTMLElement>(
              'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),iframe,[tabindex="0"]',
            ),
          ].filter(
            (el) => el.getClientRects().length && !el.closest("[inert]"),
          );
          const first = items[0],
            last = items.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
      if (e.key === "Escape") {
        const mobileMenu = root.querySelector(".sitekit-menu-container.active");
        if (innerWidth < 1025 && mobileMenu) {
          mobileMenu.classList.remove("active");
          document.documentElement.classList.remove(
            "migration-mobile-menu-open",
          );
          root
            .querySelectorAll(".sitekit-menu-toggler")
            .forEach((el) => el.setAttribute("aria-expanded", "false"));
          root.querySelector<HTMLElement>(".sitekit-menu-hamburger")?.focus();
        }
        closePopups();
        root
          .querySelectorAll(".migration-menu-open")
          .forEach((e) => e.classList.remove("migration-menu-open"));
      }
    };
    root.addEventListener("click", click);
    const keepDialogFocus = (event: FocusEvent) => {
      const popup = root.querySelector<HTMLElement>("#id-contact-popup.is-open,#schedulePopup.is-open");
      if (popup && !popup.contains(event.target as Node))
        popup.querySelector<HTMLElement>('button:not([disabled]),input:not([type="hidden"]),a[href],iframe')?.focus();
    };
    document.addEventListener("focusin", keepDialogFocus);
    const toggleDetails = (e: Event) => {
      const details = e.target as HTMLDetailsElement;
      if (!details.matches(".e-n-accordion details")) return;
      const summary = details.querySelector<HTMLElement>(":scope > summary");
      summary?.setAttribute("aria-expanded", String(details.open));
      summary?.classList.toggle("active", details.open);
      if (details.open) {
        const group =
          details.closest(".product-dropdowngrid-section") ||
          details.closest(".e-n-accordion");
        group
          ?.querySelectorAll<HTMLDetailsElement>("details[open]")
          .forEach((other) => {
            if (other !== details) other.open = false;
          });
      }
    };
    root.addEventListener("toggle", toggleDetails, true);
    root.addEventListener("keydown", key);
    root.dataset.interactionsReady = "true";
    cleanups.push(() => {
      document.documentElement.classList.remove("migration-mobile-menu-open");
      delete root.dataset.interactionsReady;
      root.removeEventListener("click", click);
      document.removeEventListener("focusin", keepDialogFocus);
      root.removeEventListener("toggle", toggleDetails, true);
      root.removeEventListener("keydown", key);
    });
    return () => cleanups.forEach((fn) => fn());
  }, [pageKey]);
  return null;
}
