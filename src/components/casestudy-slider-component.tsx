"use client";
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Props = {
  wrapperProps: Record<string, unknown>;
  slides: ReactNode[];
  previousIcon: ReactNode;
  nextIcon: ReactNode;
};
export default function CaseStudySliderComponent({
  wrapperProps,
  slides,
  previousIcon,
  nextIcon,
}: Props) {
  const [active, setActive] = useState(0),
    [paused, setPaused] = useState(false),
    [visible, setVisible] = useState(false),
    [reduced, setReduced] = useState(true),
    [interacted, setInteracted] = useState(false),
    [height, setHeight] = useState<number>();
  const viewport = useRef<HTMLDivElement>(null),
    track = useRef<HTMLDivElement>(null),
    touch = useRef<{ x: number; y: number } | null>(null);
  const count = slides.length;
  useEffect(() => {
    if (!visible || !track.current) return;
    for (const index of [active, (active + 1) % count]) {
      track.current.children[index]
        ?.querySelectorAll('img[loading="lazy"]')
        .forEach((image) => image.setAttribute("loading", "eager"));
    }
  }, [active, visible, count]);
  const advance = (direction: number) => {
    setInteracted(true);
    setActive((index) => (index + direction + count) % count);
  };
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media.matches);
    motion();
    media.addEventListener("change", motion);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    if (viewport.current) observer.observe(viewport.current);
    const visibility = () => {
      if (document.hidden) setVisible(false);
      else if (viewport.current) {
        const rect = viewport.current.getBoundingClientRect();
        setVisible(rect.bottom > 0 && rect.top < innerHeight);
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", motion);
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (reduced || paused || !visible || interacted || count < 2) return;
    const timer = setInterval(
      () => setActive((index) => (index + 1) % count),
      5000,
    );
    return () => clearInterval(timer);
  }, [reduced, paused, visible, interacted, count]);
  useEffect(() => {
    const slide = track.current?.children[active] as HTMLElement | undefined;
    if (!slide) return;
    const resize = () => {
      const value = slide.getBoundingClientRect().height;
      if (value > 0) setHeight(value);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(slide);
    resize();
    return () => observer.disconnect();
  }, [active, count]);
  const content = Children.toArray(slides).map((slide, index) =>
    isValidElement<Record<string, unknown>>(slide)
      ? cloneElement(slide, {
          className:
            String(slide.props.className || "") +
            (index === active ? " swiper-slide-active" : ""),
          style: {
            ...((slide.props.style as Record<string, unknown>) || {}),
            flex: "0 0 100%",
            width: "100%",
            minWidth: 0,
            height: "auto",
          },
          inert: index !== active,
          "aria-hidden": index !== active,
          "aria-label": `${index + 1} of ${count}`,
        })
      : slide,
  );
  return (
    <div
      {...wrapperProps}
      data-component="casestudy-slider-component"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node))
          setPaused(false);
      }}
    >
      <div
        ref={viewport}
        className="e-n-carousel swiper"
        data-managed-carousel="case-study"
        role="region"
        aria-roledescription="carousel"
        aria-label="Case studies"
        style={{
          height: height ? `${height}px` : undefined,
          touchAction: "pan-y pinch-zoom",
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            advance(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            advance(-1);
          }
        }}
        onTouchStart={(event) => {
          touch.current = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY,
          };
        }}
        onTouchEnd={(event) => {
          if (!touch.current) return;
          const dx = event.changedTouches[0].clientX - touch.current.x,
            dy = event.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2)
            advance(dx < 0 ? 1 : -1);
        }}
      >
        <div
          ref={track}
          className="swiper-wrapper"
          style={{
            transform: `translate3d(-${active * 100}%,0,0)`,
            transitionDuration: reduced ? "0ms" : "500ms",
            alignItems: "flex-start",
          }}
          aria-live={paused || interacted ? "polite" : "off"}
        >
          {content}
        </div>
      </div>
      <button
        type="button"
        className="migrated-swiper-button migrated-swiper-button-prev"
        aria-label="Previous case study"
        onClick={() => advance(-1)}
      >
        {previousIcon}
      </button>
      <button
        type="button"
        className="migrated-swiper-button migrated-swiper-button-next"
        aria-label="Next case study"
        onClick={() => advance(1)}
      >
        {nextIcon}
      </button>
      <span
        className="case-study-slide-status"
        role="status"
        aria-live="polite"
      >
        Case study {active + 1} of {count}
      </span>
    </div>
  );
}
