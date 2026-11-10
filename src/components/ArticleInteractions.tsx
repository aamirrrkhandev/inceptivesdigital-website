"use client";
import { useEffect } from "react";

export default function ArticleInteractions({
  canonical,
  title,
}: {
  canonical: string;
  title: string;
}) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".migrated-page");
    if (!root) return;
    const cleanups: (() => void)[] = [];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    root
      .querySelectorAll<HTMLElement>('[id^="id-blog-"]')
      .forEach((article) => {
        const headings = [
          ...article.querySelectorAll<HTMLElement>(
            ".id-article-body h2,.id-article-body h3",
          ),
        ];
        if (!headings.length) return;
        const sync = () => {
          let current = headings[0];
          for (const h of headings) {
            if (h.getBoundingClientRect().top <= 150) current = h;
            else break;
          }
          article
            .querySelectorAll<HTMLAnchorElement>(
              ".id-toc-links a,.id-mobile-toc-links a",
            )
            .forEach((a) => {
              const active = a.hash === "#" + current.id;
              a.classList.toggle("active", active);
              if (active) a.setAttribute("aria-current", "location");
              else a.removeAttribute("aria-current");
            });
        };
        let raf = 0;
        const schedule = () => {
          if (!raf)
            raf = requestAnimationFrame(() => {
              raf = 0;
              sync();
            });
        };
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        sync();
        cleanups.push(() => {
          window.removeEventListener("scroll", schedule);
          window.removeEventListener("resize", schedule);
          cancelAnimationFrame(raf);
        });
      });
    const press = [
      ...root.querySelectorAll<HTMLElement>(
        ".press-content-head h2,.press-content-head h3",
      ),
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          root
            .querySelectorAll(".press-content-head.active")
            .forEach((e) => e.classList.remove("active"));
          entry.target.parentElement?.classList.add("active");
          root
            .querySelectorAll<HTMLAnchorElement>(".press-content-headings a")
            .forEach((a) =>
              a.classList.toggle("active", a.hash === "#" + entry.target.id),
            );
        }
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    press.forEach((e) => observer.observe(e));
    cleanups.push(() => observer.disconnect());
    const activate = (target: Element, event: Event) => {
      const question = target.closest<HTMLElement>(".schema-faq-question");
      if (question) {
        event.preventDefault();
        const item = question.closest(".schema-faq-section");
        const open = !item?.classList.contains("is-open");
        question
          .closest(".schema-faq")
          ?.querySelectorAll(".schema-faq-section")
          .forEach((e) => {
            e.classList.remove("is-open");
            e.querySelector(".schema-faq-question")?.setAttribute(
              "aria-expanded",
              "false",
            );
          });
        if (open) {
          item?.classList.add("is-open");
          question.setAttribute("aria-expanded", "true");
        }
        return;
      }
      const header = target.closest<HTMLElement>(".accordion-header");
      if (header) {
        event.preventDefault();
        const item = header.closest(".accordion-item");
        const open = item?.classList.toggle("active");
        header.setAttribute("aria-expanded", String(!!open));
        item
          ?.querySelector(".accordion-content")
          ?.setAttribute("aria-hidden", String(!open));
        const icon = item?.querySelector(".accordion-icon");
        if (icon) icon.textContent = open ? "−" : "+";
        return;
      }
      const toc = target.closest<HTMLAnchorElement>(
        ".id-toc-links a,.id-mobile-toc-links a,.press-content-headings a",
      );
      if (toc) {
        const heading = document.getElementById(
          decodeURIComponent(toc.hash.slice(1)),
        );
        if (heading) {
          event.preventDefault();
          heading.scrollIntoView({
            behavior: reduced ? "instant" : "smooth",
            block: "start",
          });
          const blog = toc.closest('[id^="id-blog-"]');
          const panel = blog?.querySelector<HTMLElement>(
            ".id-mobile-toc-panel",
          );
          if (panel) panel.hidden = true;
          blog
            ?.querySelector(".id-mobile-toc-button")
            ?.setAttribute("aria-expanded", "false");
          if (toc.closest(".press-content-headings"))
            history.pushState(null, "", toc.hash);
        }
        return;
      }
      const toggle = target.closest<HTMLElement>(".id-mobile-toc-button");
      if (toggle) {
        const panel = toggle
          .closest('[id^="id-blog-"]')
          ?.querySelector<HTMLElement>(".id-mobile-toc-panel");
        if (panel) {
          panel.hidden = !panel.hidden;
          toggle.setAttribute("aria-expanded", String(!panel.hidden));
        }
        return;
      }
      const ai = target.closest<HTMLElement>("[data-ai]");
      if (ai) {
        event.preventDefault();
        const prompt =
          "Please summarize this article and explain its key points. Article title: " +
          title +
          "\nArticle URL: " +
          canonical +
          "\nPlease access the article and summarize its main ideas, important details, and key takeaways. If you cannot access the URL, tell me to paste the article text.";
        const encoded = encodeURIComponent(prompt);
        const urls: Record<string, string> = {
          chatgpt: "https://chatgpt.com/?q=" + encoded,
          claude: "https://claude.ai/new?q=" + encoded,
          perplexity: "https://www.perplexity.ai/search?q=" + encoded,
          gemini:
            "https://www.google.com/search?udm=50&q=" +
            encodeURIComponent(
              "Summarize and analyze the key insights from " +
                title +
                " " +
                canonical,
            ),
          grok: "https://grok.com/?q=" + encoded,
        };
        if (urls[ai.dataset.ai || ""])
          window.open(
            urls[ai.dataset.ai || ""],
            "_blank",
            "noopener,noreferrer",
          );
      }
    };
    const click = (e: MouseEvent) => activate(e.target as Element, e);
    const key = (e: KeyboardEvent) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        (e.target as Element).matches(".schema-faq-question")
      )
        activate(e.target as Element, e);
    };
    root.addEventListener("click", click);
    root.addEventListener("keydown", key);
    cleanups.push(() => {
      root.removeEventListener("click", click);
      root.removeEventListener("keydown", key);
    });
    return () => cleanups.forEach((fn) => fn());
  }, [canonical, title]);
  return null;
}
