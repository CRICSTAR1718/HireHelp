export const LoadingState = () => (
  <div className="grid min-h-48 place-items-center">
    <div className="w-full max-w-2xl space-y-3 px-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 rounded-lg hh-skeleton" style={{ borderRadius: 'var(--hh-radius-sm)' }} />
      ))}
    </div>
  </div>
);