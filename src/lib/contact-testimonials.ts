/** Restore the existing WordPress popup testimonial controls and 8-second cycle. */
export function initializeContactTestimonials(page: HTMLElement) {
  const popup = page.querySelector<HTMLElement>("#id-contact-popup");
  const track = popup?.querySelector<HTMLElement>(".id-cp__slide-track");
  const viewport = popup?.querySelector<HTMLElement>(".id-cp__slides");
  const slides = [...(popup?.querySelectorAll<HTMLElement>("[data-idcp-slide]") || [])];
  const dots = [...(popup?.querySelectorAll<HTMLButtonElement>("[data-idcp-dot]") || [])];
  let index = 0, timer: ReturnType<typeof setInterval> | undefined, frame = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const stop = () => { clearInterval(timer); timer = undefined; };
  const measure = () => {
    if (!viewport || !popup?.classList.contains("is-open")) return;
    viewport.style.height = "auto";
    slides.forEach(slide => { slide.style.minHeight = "0"; });
    const height = Math.max(0, ...slides.map(slide => Math.ceil(slide.scrollHeight)));
    if (height) {
      slides.forEach(slide => { slide.style.minHeight = height + "px"; });
      viewport.style.height = height + "px";
    }
  };
  const requestMeasure = () => {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; measure(); });
  };
  const show = (next: number) => {
    if (!slides.length || !track) return;
    index = (next + slides.length) % slides.length;
    track.style.transform = `translate3d(-${index * 100}%,0,0)`;
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
      slide.setAttribute("aria-hidden", String(i !== index));
      slide.inert = i !== index;
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-selected", String(i === index));
      dot.tabIndex = i === index ? 0 : -1;
    });
  };
  const start = () => {
    stop();
    if (slides.length < 2 || !popup?.classList.contains("is-open") || document.hidden ||
      reduced.matches || innerWidth < 768) return;
    timer = setInterval(() => {
      if (!viewport?.matches(":hover") && !popup.querySelector(".id-cp__dots")?.contains(document.activeElement)) show(index + 1);
    }, 8000);
  };
  dots.forEach((dot, i) => {
    const slide = slides[i];
    if (slide) {
      dot.id ||= `idcp-testimonial-tab-${i}`;
      slide.id ||= `idcp-testimonial-panel-${i}`;
      dot.setAttribute("aria-controls", slide.id);
      slide.setAttribute("role", "tabpanel");
      slide.setAttribute("aria-labelledby", dot.id);
    }
  });
  const click = (event: MouseEvent) => {
    const dot = (event.target as Element).closest<HTMLButtonElement>("[data-idcp-dot]");
    if (dot && dots.includes(dot)) { show(dots.indexOf(dot)); start(); }
  };
  const key = (event: KeyboardEvent) => {
    const dot = event.target as HTMLButtonElement;
    if (!dots.includes(dot) || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? dots.length - 1 : index + (event.key === "ArrowRight" ? 1 : -1);
    show(next); dots[index]?.focus(); start();
  };
  const resize = () => { requestMeasure(); start(); };
  const visibility = () => document.hidden ? stop() : start();
  let lastWidth = 0;
  const observer = new ResizeObserver(entries => {
    const width = Math.round(entries[0].contentRect.width);
    if (width !== lastWidth) { lastWidth = width; requestMeasure(); }
  });
  if (popup) {
    popup.addEventListener("click", click);
    popup.addEventListener("keydown", key);
    const panel = popup.querySelector(".id-cp__panel");
    if (panel) observer.observe(panel);
  }
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("visibilitychange", visibility);
  show(0);
  return {
    open: () => { requestMeasure(); start(); }, close: stop,
    dispose: () => {
      stop(); cancelAnimationFrame(frame); observer.disconnect();
      popup?.removeEventListener("click", click); popup?.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", visibility);
    },
  };
}
