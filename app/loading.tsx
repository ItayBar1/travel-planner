export default function Loading() {
  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="max-w-xl mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-9 w-28 bg-[var(--color-surface-container-high)] rounded-lg animate-pulse" />
          <div className="h-9 w-32 bg-[var(--color-surface-container-high)] rounded-full animate-pulse" />
        </div>

        {/* Stop cards skeleton */}
        {[1, 2, 3].map(i => (
          <div key={i}>
            <div className="h-20 bg-[var(--color-surface-container)] rounded-[1.5rem_0.75rem_2rem_1rem] animate-pulse" />
            {i < 3 && (
              <div className="flex flex-col items-center py-1 gap-1">
                <div className="w-px h-3 bg-[var(--color-outline-variant)]" />
                <div className="h-7 w-28 bg-[var(--color-surface-container-low)] rounded-full animate-pulse" />
                <div className="w-px h-3 bg-[var(--color-outline-variant)]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
