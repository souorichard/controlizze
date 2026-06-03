'use client'

export function AnimatedBackground({
  variant = 'app',
}: {
  variant?: 'hero' | 'app'
}) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid animate-grid-pulse" />

      {variant === 'hero' && (
        <div className="absolute inset-0 bg-grid-dots opacity-60" />
      )}

      {variant === 'hero' && (
        <div
          aria-hidden
          className="absolute inset-x-0 h-px animate-scan"
          style={{
            background:
              'linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 60%, transparent), transparent)',
          }}
        />
      )}
    </div>
  )
}
