// Shown instantly while the next dashboard page (overview, a board, profile)
// loads, so clicking any sidebar link switches the screen right away.
export default function DashboardLoading() {
  return (
    <div className="flex-1 overflow-y-auto" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-16 sm:px-8 lg:px-10 lg:pt-8">
        <div className="h-3.5 w-24 animate-pulse rounded bg-panel-raised" />
        <div className="mt-3 h-8 w-64 max-w-full animate-pulse rounded bg-panel-raised" />
        <div className="mt-3 h-3.5 w-80 max-w-full animate-pulse rounded bg-panel-raised" />

        <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl border border-line-solid bg-panel/60"
            />
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="h-56 animate-pulse rounded-2xl border border-line-solid bg-panel/60 lg:col-span-2" />
          <div className="h-56 animate-pulse rounded-2xl border border-line-solid bg-panel/60" />
        </div>
      </div>
    </div>
  );
}
