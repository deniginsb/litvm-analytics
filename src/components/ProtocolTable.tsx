import { useState } from 'react'
import type { ProtocolData } from '../data/mockData'
import { formatCurrency, formatNumber, formatPercent, cn } from '../lib/utils'

interface ProtocolTableProps {
  data: ProtocolData[]
  isLoading?: boolean
}

type SortKey = 'tvl' | 'volume24h' | 'change24h' | 'txCount24h'

export function ProtocolTable({ data, isLoading = false }: ProtocolTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('tvl')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const sorted = [...data].sort((a, b) => {
    const mul = sortDir === 'desc' ? -1 : 1
    return (a[sortKey] - b[sortKey]) * mul
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const SortIcon = ({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) => (
    <span className={cn('ml-1 text-[10px]', active ? 'text-accent' : 'text-text-muted')}>
      {active ? (dir === 'desc' ? '↓' : '↑') : '↕'}
    </span>
  )

  const categoryColors: Record<string, string> = {
    DEX: 'bg-blue-muted text-blue',
    Lending: 'bg-green-muted text-green',
    Launchpad: 'bg-amber-muted text-amber',
    NFT: 'bg-accent-muted text-accent-light',
    RWA: 'bg-red-muted text-red',
  }

  return (
    <div className="rounded-xl border border-border bg-surface-secondary animate-slide-up stagger-5">
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">Protocols</h3>
          {isLoading && (
            <div className="h-2 w-2 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          )}
        </div>
        <p className="text-xs text-text-muted mt-0.5">
          {isLoading ? 'Discovering protocols...' : `All deployed protocols on LitVM`}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Protocol
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted">
                Category
              </th>
              <th
                className="cursor-pointer px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted hover:text-text-secondary"
                onClick={() => handleSort('tvl')}
              >
                TVL
                <SortIcon active={sortKey === 'tvl'} dir={sortDir} />
              </th>
              <th
                className="cursor-pointer px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted hover:text-text-secondary"
                onClick={() => handleSort('volume24h')}
              >
                Volume (24h)
                <SortIcon active={sortKey === 'volume24h'} dir={sortDir} />
              </th>
              <th
                className="cursor-pointer px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted hover:text-text-secondary"
                onClick={() => handleSort('change24h')}
              >
                Change (24h)
                <SortIcon active={sortKey === 'change24h'} dir={sortDir} />
              </th>
              <th
                className="cursor-pointer px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted hover:text-text-secondary"
                onClick={() => handleSort('txCount24h')}
              >
                Tracked
                <SortIcon active={sortKey === 'txCount24h'} dir={sortDir} />
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 animate-pulse rounded bg-surface-tertiary" />
                      <div className="h-4 w-24 animate-pulse rounded bg-surface-tertiary" />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="h-5 w-16 animate-pulse rounded bg-surface-tertiary" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-surface-tertiary" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-surface-tertiary" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-surface-tertiary" />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="ml-auto h-4 w-16 animate-pulse rounded bg-surface-tertiary" />
                  </td>
                </tr>
              ))
            ) : sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-sm text-text-muted">
                  No protocols discovered yet. Waiting for on-chain data...
                </td>
              </tr>
            ) : (
              sorted.map((protocol, index) => (
                <tr
                  key={protocol.name}
                  className={cn(
                    'border-b border-border/50 transition-colors hover:bg-surface-tertiary',
                    index === sorted.length - 1 && 'border-b-0'
                  )}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{protocol.icon}</span>
                      <span className="text-sm font-medium text-text-primary">
                        {protocol.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                        categoryColors[protocol.category] || 'bg-surface-tertiary text-text-secondary'
                      )}
                    >
                      {protocol.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm font-medium text-text-primary">
                    {protocol.tvl > 0 ? formatCurrency(protocol.tvl) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm text-text-secondary">
                    {protocol.volume24h > 0 ? formatCurrency(protocol.volume24h) : '—'}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {protocol.change24h !== 0 ? (
                      <span
                        className={cn(
                          'text-sm font-medium',
                          protocol.change24h >= 0 ? 'text-green' : 'text-red'
                        )}
                      >
                        {formatPercent(protocol.change24h)}
                      </span>
                    ) : (
                      <span className="text-sm text-text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm text-text-secondary">
                    {protocol.txCount24h > 0 ? formatNumber(protocol.txCount24h) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
