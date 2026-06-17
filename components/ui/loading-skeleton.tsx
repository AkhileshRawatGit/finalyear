export function SkeletonCard() {
  return (
    <div className="p-4 rounded-lg border border-border animate-pulse">
      <div className="h-6 bg-muted rounded-full w-1/3 mb-3"></div>
      <div className="h-4 bg-muted rounded-full w-full mb-2"></div>
      <div className="h-4 bg-muted rounded-full w-2/3"></div>
    </div>
  )
}

export function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
