import type { TokenData } from '../data/mockData'
import { formatCurrency, formatPercent, cn } from '../lib/utils'

interface TokenListProps {
  data: TokenData[]
}

export function TokenList({ data }: TokenListProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-secondary animate-slide-up stagger-6">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-text-primary">Top Tokens</h3>
        <p className="text-xs text-text-muted mt-0.5">By market cap on LitVM</p>
      </div>
      <div className="divide-y divide-border/50">
        {data.map((token) => (
          <div
            key={token.symbol}
            className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface-tertiary"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{token.icon}</span>
              <div>
                <p className="text-sm font-medium text-text-primary">{token.symbol}</p>
                <p className="text-xs text-text-muted">{token.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-text-primary">
                {token.price < 0.01 ? '$' + token.price.toFixed(4) : formatCurrency(token.price)}
              </p>
              <p
                className={cn(
                  'text-xs font-medium',
                  token.change24h >= 0 ? 'text-green' : 'text-red'
                )}
              >
                {formatPercent(token.change24h)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
