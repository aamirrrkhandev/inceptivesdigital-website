"use client";
import { useEffect } from "react";

// Ported from the published WordPress blog snippet: URL-based category/search/view state.
export default function BlogInteractions() {
  useEffect(() => {
    const listing = document.querySelector<HTMLElement>(
      '[data-id-blog-listing="1"]',
    );
    if (!listing) return;
    const categories: Record<string, string> = {
      all: "all",
      android: "android-app-development",
      dating: "dating-app-development",
      fintech: "fintech-app-development",
      fitness: "fitness-app-development",
      ios: "ios-app-development",
      "mobile-app": "mobile-app-development",
      "mobile-game": "mobile-game-development",
      software: "software-development",
      web: "web-development",
      blockchain: "blockchain-development",
      healthcare: "healthcare-app-development",
      digital: "digital-products",
      ai: "artificial-intelligence",
      "artificial intelligence": "artificial-intelligence",
    };
    const normalize = (value: string) =>
      categories[value.toLowerCase().trim()] ||
      value.toLowerCase().trim() ||
      "all";
    const tabs = [...document.querySelectorAll<HTMLElement>(".btn-tabs")];
    for (const tab of tabs) {
      const active =
        normalize(tab.dataset.filter || "") === listing.dataset.category;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", String(active));
    }
    const form = document.querySelector<HTMLFormElement>(
      ".blogssearch-inner .e-search-form",
    );
    const input = form?.querySelector<HTMLInputElement>(".e-search-input");
    if (input) input.value = listing.dataset.search || "";
    function navigate(changes: Record<string, string>, replace = false) {
      const target = new URL(window.location.href);
      for (const [key, value] of Object.entries(changes)) {
        if (!value || value === "all") target.searchParams.delete(key);
        else target.searchParams.set(key, value);
      }
      target.searchParams.delete("pagination_page");
      if (replace) window.location.replace(target.href);
      else window.location.assign(target.href);
    }
    const click = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(".btn-tabs")
          : null;
      if (!target || !tabs.includes(target)) return;
      event.preventDefault();
      navigate({
        blog_cat: normalize(target.dataset.filter || ""),
        blog_search: "",
      });
    };
    const submit = (event: SubmitEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      navigate({ blog_search: input?.value.trim() || "", blog_cat: "all" });
    };
    const matchView = () => {
      const view =
        window.innerWidth <= 767
          ? "mobile"
          : window.innerWidth <= 1024
            ? "tablet"
            : "desktop";
      if (listing.dataset.view !== view) navigate({ blog_view: view }, true);
    };
    document.addEventListener("click", click);
    form?.addEventListener("submit", submit, true);
    window.addEventListener("resize", matchView);
    listing.dataset.blogInteractionsReady = "true";
    matchView();
    return () => {
      document.removeEventListener("click", click);
      form?.removeEventListener("submit", submit, true);
      window.removeEventListener("resize", matchView);
      delete listing.dataset.blogInteractionsReady;
    };
  }, []);
  return null;
}
