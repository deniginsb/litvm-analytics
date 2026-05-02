import { cn } from '../lib/utils'

interface Transaction {
  hash: string
  type: string
  protocol: string
  amount: string
  time: string
}

interface RecentTransactionsProps {
  data: Transaction[]
  lastUpdated?: Date | null
}

const typeColors: Record<string, string> = {
  Swap: 'bg-blue-muted text-blue',
  Approve: 'bg-amber-muted text-amber',
  Transfer: 'bg-green-muted text-green',
  Withdraw: 'bg-red-muted text-red',
  deposit: 'bg-green-muted text-green',
  mint: 'bg-accent-muted text-accent-light',
  'Add Liquidity': 'bg-green-muted text-green',
  'Register Domain': 'bg-accent-muted text-accent-light',
  'Create Token': 'bg-amber-muted text-amber',
  Lend: 'bg-green-muted text-green',
  Borrow: 'bg-red-muted text-red',
}

export function RecentTransactions({ data, lastUpdated }: RecentTransactionsProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary animate-slide-up stagger-6">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Recent Transactions</h3>
            <p className="text-xs text-text-muted mt-0.5">
              Live on-chain activity · auto-refresh 5s
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-green-muted px-2 py-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-[10px] font-medium text-green">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Live'}
            </span>
          </div>
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {data.map((tx, index) => (
          <div
            key={tx.hash + index}
            className={cn(
              'flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface-tertiary',
              index === 0 && 'bg-accent-muted/20'
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                  typeColors[tx.type] || 'bg-surface-tertiary text-text-secondary'
                )}
              >
                {tx.type}
              </span>
              <div>
                <p className="text-sm font-medium text-text-primary">{tx.protocol}</p>
                <p className="text-xs text-text-muted font-mono">{tx.hash}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">{tx.amount}</p>
              <p className="text-xs text-text-muted">{tx.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
