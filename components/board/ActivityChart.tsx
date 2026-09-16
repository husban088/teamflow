"use client";

export function ActivityChart({ data }: { data: { label: string; count: number }[] }) {
  const w = 640;
  const h = 180;
  const padY = 18;
  const max = Math.max(1, ...data.map((d) => d.count));
  const stepX = data.length > 1 ? w / (data.length - 1) : 0;

  const points = data.map((d, i) => ({
    x: i * stepX,
    y: h - padY - (d.count / max) * (h - padY * 2),
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(" ");
  const areaPath = `${linePath} L ${w} ${h} L 0 ${h} Z`;
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full overflow-visible"
        preserveAspectRatio="none"
        role="img"
        aria-label="Tasks created over the last 7 days"
      >
        <defs>
          <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--violet)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--violet)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={0}
            x2={w}
            y1={padY + (h - padY * 2) * f}
            y2={padY + (h - padY * 2) * f}
            stroke="var(--line-solid)"
            strokeWidth={1}
          />
        ))}

        {total > 0 && (
          <>
            <path d={areaPath} fill="url(#activityFill)" style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both" }} />
            <path
              d={linePath}
              fill="none"
              stroke="var(--violet)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: 0, animation: "draw-line 1s cubic-bezier(0.16,1,0.3,1) both" }}
            />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={4}
                fill="var(--panel)"
                stroke="var(--violet)"
                strokeWidth={2}
                className="transition-[r] duration-200 hover:r-[6px]"
              >
                <title>{`${p.label}: ${p.count} task${p.count === 1 ? "" : "s"}`}</title>
              </circle>
            ))}
          </>
        )}

        {total === 0 && (
          <text x={w / 2} y={h / 2} textAnchor="middle" fill="var(--muted-dim)" fontSize={13}>
            No tasks created this week yet
          </text>
        )}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-muted-dim">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
