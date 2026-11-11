"use client";
import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LayoutNode } from "@/lib/site-model";

type Filters = { category: string; search: string; view: string; page: number };
type Listing = Filters & { nodes: LayoutNode[] };
type Props = {
  wrapperProps: Record<string, unknown>;
  initialContent: ReactNode;
};
const categoryMap: Record<string, string> = {
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
const categoryName = (value: string) =>
  categoryMap[value.toLowerCase().trim()] ||
  value.toLowerCase().trim() ||
  "all";
const viewport = () =>
  innerWidth <= 767 ? "mobile" : innerWidth <= 1024 ? "tablet" : "desktop";
const same = (a: Filters, b: Filters) =>
  JSON.stringify(a) === JSON.stringify(b);
function normalize(value: Partial<Filters>): Filters {
  return {
    category:
      typeof value.category === "string" && /^[a-z0-9-]+$/.test(value.category)
        ? value.category.slice(0, 80)
        : "all",
    search: typeof value.search === "string" ? value.search.slice(0, 200) : "",
    view: ["mobile", "tablet"].includes(value.view || "")
      ? value.view!
      : "desktop",
    page: Math.max(1, Math.min(1000, Number(value.page) || 1)),
  };
}
function cleanUrl() {
  const url = new URL(location.href);
  for (const key of ["blog_cat", "blog_search", "blog_view", "pagination_page"])
    url.searchParams.delete(key);
  return url.pathname + url.search + url.hash;
}
function remember(filters: Filters, mode: "push" | "replace" | "none") {
  const state = { ...(history.state || {}), inceptivesBlog: filters };
  if (mode === "push") history.pushState(state, "", cleanUrl());
  else history.replaceState(state, "", cleanUrl());
}
function render(node: LayoutNode, index: number): ReactNode {
  if (typeof node === "string") return node;
  return createElement(
    node.tag,
    { ...node.props, key: index },
    ["img", "br", "hr", "input", "source", "wbr"].includes(node.tag)
      ? undefined
      : node.children.map(render),
  );
}
export default function BlogInteractions({
  wrapperProps,
  initialContent,
}: Props) {
  const initial = useRef(
    normalize({
      category: String(wrapperProps["data-category"] || "all"),
      search: String(wrapperProps["data-search"] || ""),
      view: String(wrapperProps["data-view"] || "desktop"),
      page: Number(wrapperProps["data-page"] || 1),
    }),
  );
  const [filters, setFilters] = useState(initial.current),
    [listing, setListing] = useState<Listing | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [ready, setReady] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    current = useRef(filters),
    applied = useRef(filters),
    desired = useRef(filters),
    request = useRef<AbortController | null>(null),
    cache = useRef(new Map<string, { time: number; data: Listing }>());
  const load = useCallback(
    async (value: Filters, mode: "push" | "replace" | "none" = "push") => {
      const target = normalize(value);
      request.current?.abort();
      const controller = new AbortController();
      request.current = controller;
      desired.current = target;
      current.current = target;
      setFilters(target);
      setBusy(true);
      setError("");
      try {
        const key = JSON.stringify(target),
          cached = cache.current.get(key);
        let data: Listing;
        if (cached && Date.now() - cached.time < 500) data = cached.data;
        else {
          const query = new URLSearchParams({
            blog_cat: target.category,
            blog_search: target.search,
            blog_view: target.view,
            pagination_page: String(target.page),
          });
          const response = await fetch("/api/blog-listing?" + query, {
            signal: controller.signal,
            cache: "no-store",
          });
          if (!response.ok) throw new Error("Listing unavailable");
          data = await response.json();
          if (!Array.isArray(data.nodes) || !same(normalize(data), target))
            throw new Error("Invalid listing");
          if (cache.current.size >= 32)
            cache.current.delete(cache.current.keys().next().value!);
          cache.current.set(key, { time: Date.now(), data });
        }
        if (controller.signal.aborted) return;
        applied.current = target;
        setListing(data);
        remember(target, mode);
      } catch (error) {
        if (!controller.signal.aborted) {
          current.current = applied.current;
          setFilters(applied.current);
          setError("Posts could not load. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    },
    [],
  );
  useEffect(() => {
    const tabs = [...document.querySelectorAll<HTMLElement>(".btn-tabs")];
    for (const tab of tabs) {
      const active =
        categoryName(tab.dataset.filter || "") === filters.category;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", String(active));
    }
    const input = document.querySelector<HTMLInputElement>(
      ".blogssearch-inner .e-search-input",
    );
    if (input) input.value = filters.search;
    root.current
      ?.querySelector("[data-blog-grid]")
      ?.setAttribute("aria-busy", String(busy));
  }, [filters, busy, listing]);
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>(
      ".blogssearch-inner .e-search-form",
    );
    const click = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      )
        return;
      const tab = event.target.closest<HTMLElement>(".btn-tabs");
      if (tab) {
        event.preventDefault();
        const next = {
          ...current.current,
          category: categoryName(tab.dataset.filter || ""),
          search: "",
          page: 1,
        };
        void load(next);
        return;
      }
      const page = event.target.closest<HTMLElement>("[data-blog-page]");
      if (page && root.current?.contains(page)) {
        event.preventDefault();
        void load({
          ...current.current,
          page: Number(page.dataset.blogPage) || 1,
        });
      }
    };
    const submit = (event: SubmitEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      void load({
        ...current.current,
        category: "all",
        search:
          form
            ?.querySelector<HTMLInputElement>(".e-search-input")
            ?.value.trim() || "",
        page: 1,
      });
    };
    const resize = () => {
      const view = viewport();
      if (current.current.view !== view)
        void load({ ...current.current, view, page: 1 }, "replace");
    };
    const back = () => {
      if (location.pathname.replace(/\/$/, "") === "/blog")
        void load(
          normalize(history.state?.inceptivesBlog || initial.current),
          "none",
        );
    };
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      cache.current.clear();
      void load(current.current, "none");
    };
    document.addEventListener("visibilitychange", refresh);
    document.addEventListener("click", click);
    form?.addEventListener("submit", submit, true);
    window.addEventListener("resize", resize);
    window.addEventListener("popstate", back);
    setReady(true);
    const hasLegacy =
      new URLSearchParams(location.search).has("blog_cat") ||
      new URLSearchParams(location.search).has("blog_search") ||
      new URLSearchParams(location.search).has("pagination_page");
    const restored = normalize(
      !hasLegacy && history.state?.inceptivesBlog
        ? history.state.inceptivesBlog
        : initial.current,
    );
    restored.view = viewport();
    remember(restored, "replace");
    if (!same(restored, initial.current)) void load(restored, "replace");
    return () => {
      request.current?.abort();
      document.removeEventListener("visibilitychange", refresh);
      document.removeEventListener("click", click);
      form?.removeEventListener("submit", submit, true);
      window.removeEventListener("resize", resize);
      window.removeEventListener("popstate", back);
    };
  }, [load]);
  return (
    <div
      {...wrapperProps}
      ref={root}
      data-view={filters.view}
      data-category={filters.category}
      data-search={filters.search}
      data-page={filters.page}
      data-blog-interactions-ready={ready ? "true" : undefined}
      aria-busy={busy}
    >
      {listing ? listing.nodes.map(render) : initialContent}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => void load(desired.current)}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
