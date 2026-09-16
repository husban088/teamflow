import { initials, cn } from "@/lib/utils";

const PALETTE = ["#8b5cf6", "#2dd4bf", "#fb7185", "#6366f1", "#a855f7", "#f97316"];

function colorFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({
  name,
  size = 28,
  className,
  ring,
  src,
}: {
  name: string | null | undefined;
  size?: number;
  className?: string;
  ring?: boolean;
  // Optional uploaded profile photo (profiles.avatar_url). When present it's
  // shown instead of the initials fallback — every call site that only ever
  // had a name keeps working unchanged since this is opt-in.
  src?: string | null;
}) {
  const label = initials(name);
  const bg = colorFor(name || "?");

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name || "Avatar"}
        title={name || undefined}
        className={cn(
          "shrink-0 rounded-full object-cover",
          ring && "ring-2 ring-ink",
          className
        )}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      title={name || undefined}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white",
        ring && "ring-2 ring-ink",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(135deg, ${bg}, ${bg}99)`,
      }}
    >
      {label}
    </div>
  );
}
