export default function SkeletonLoader() {
  return (
    <div className="mt-8 space-y-4">
      {/* sources skeleton: thin rows */}
      <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-3">
        Sources
      </p>
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton h-9 w-full" />
        ))}
      </div>

      {/* divider */}
      <div className="border-t border-border-accent opacity-20 my-6" />

      {/* answer skeleton */}
      <p className="text-xs font-mono uppercase tracking-widest text-text-secondary mb-3">
        Answer
      </p>
      <div className="space-y-3">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-4/5" />
      </div>
    </div>
  )
}
