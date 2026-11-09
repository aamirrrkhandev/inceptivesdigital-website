import { asset, type Asset } from "@/lib/assets";
import dimensions from "@/content/dimensions.json";
export function Picture({
  image,
  className = "",
  eager = false,
}: {
  image: Asset;
  className?: string;
  eager?: boolean;
}) {
  const src = asset(image.src);
  const size = (
    dimensions as Record<
      string,
      { width: number; height: number; srcSet: string }
    >
  )[src];
  return (
    <img
      src={src}
      alt={image.alt}
      width={size?.width}
      height={size?.height}
      srcSet={size?.srcSet || undefined}
      sizes="(max-width:767px) 90vw, (max-width:1199px) 45vw, 600px"
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
export function Video({
  name,
  className = "",
  poster,
  controls = false,
}: {
  name: string;
  className?: string;
  poster?: string;
  controls?: boolean;
}) {
  return (
    <video
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster ? "/assets/" + poster : undefined}
      controls={controls}
    >
      <source src={"/assets/" + name} type="video/mp4" />
    </video>
  );
}
