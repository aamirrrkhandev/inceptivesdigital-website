"use client";
import { useEffect, useRef, useState } from "react";
export default function DeferredVideo({
  src,
  poster,
  className,
  controls = false,
}: {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "150px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={active ? "metadata" : "none"}
      poster={poster}
      controls={controls}
    >
      <source
        src={active ? src : undefined}
        data-media-src={src}
        type="video/mp4"
      />
    </video>
  );
}
