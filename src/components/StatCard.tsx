import { cn } from '../lib/utils'

interface StatCardProps {
  label: string
  value: string
  change?: number
  prefix?: string
  suffix?: string
  index?: number
  isLoading?: boolean
  isLive?: boolean
}

export function StatCard({ label, value, change, suffix, index = 0, isLoading = false, isLive = true }: StatCardProps) {
  const isPositive = change !== undefined && change >= 0
  const isNeutral = change === undefined || change === 0

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-surface-secondary p-5',
        'transition-all duration-300 hover:bg-surface-tertiary',
        'animate-slide-up opacity-0',
        isLive ? 'border-border hover:border-border-light' : 'border-red/20',
        `stagger-${index + 1}`
      )}
    >
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {label}
          </p>
          {isLive && (
            <div className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
          )}
        </div>
        
        <div className="mt-2 flex items-baseline gap-1.5">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-surface-tertiary" />
          ) : (
            <>
              <span className="text-2xl font-semibold tracking-tight text-text-primary">
                {value}
              </span>
              {suffix && (
                <span className="text-sm text-text-secondary">{suffix}</span>
              )}
            </>
          )}
        </div>
        
        <div className="mt-2 flex items-center gap-1.5">
          {isLoading ? (
            <div className="h-5 w-16 animate-pulse rounded bg-surface-tertiary" />
          ) : change !== undefined ? (
            <>
              <span
                className={cn(
                  'inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium',
                  isNeutral
                    ? 'bg-surface-tertiary text-text-secondary'
                    : isPositive
                    ? 'bg-green-muted text-green'
                    : 'bg-red-muted text-red'
                )}
              >
                {isPositive ? '↑' : isNeutral ? '→' : '↓'} {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-xs text-text-muted">24h</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
