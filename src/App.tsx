import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { StatCard } from './components/StatCard'
import { TVLChart, VolumeChart, TxChart } from './components/Charts'
import { ProtocolTable } from './components/ProtocolTable'
import { TokenList } from './components/TokenList'
import { RecentTransactions } from './components/RecentTransactions'
import { useChainStats } from './hooks/useChainStats'
import { useRecentTransactions, useTokenList } from './hooks/useExplorer'
import { useProtocolTVL } from './hooks/useProtocolTVL'
import { chartData, topTokens as mockTokens } from './data/mockData'

function timeAgo(ts: number): string {
  const diff = Date.now() / 1000 - ts
  if (diff < 60) return `${Math.floor(diff)}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function shortAddr(a: string): string {
  if (!a || a.length < 10) return a || '—'
  return a.slice(0, 6) + '...' + a.slice(-4)
}

function fmtNum(n: number): string {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toFixed(0)
}

function fmtUSD(n: number): string {
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K'
  if (n > 0) return '$' + n.toFixed(0)
  return '—'
}

export default function App() {
  const { stats, loading, error, lastUpdated } = useChainStats(30000)
  const { transactions } = useRecentTransactions(8)
  const { tokens: explorerTokens } = useTokenList(10)
  const { protocols, totalTVL, isLoading: tvlLoading } = useProtocolTVL()

  const displayTokens = explorerTokens.length > 0
    ? explorerTokens.map(t => ({
        symbol: t.symbol,
        name: t.name,
        price: 0,
        change24h: 0,
        volume24h: 0,
        marketCap: 0,
        icon: '🪙',
      }))
    : mockTokens

  const displayTxs = transactions.length > 0
    ? transactions.map(tx => ({
        hash: shortAddr(tx.hash),
        type: tx.method === 'transfer' ? 'Transfer'
          : tx.method === 'approve' ? 'Approve'
          : tx.method === 'swapExactETHForTokens' ? 'Swap'
          : tx.method === 'swapExactTokensForTokens' ? 'Swap'
          : tx.method === 'withdraw' ? 'Withdraw'
          : tx.method,
        protocol: tx.to ? `→ ${shortAddr(tx.to)}` : 'Contract',
        amount: tx.value !== '0'
          ? `${(parseFloat(tx.value) / 1e18).toFixed(4)} zkLTC`
          : '—',
        time: timeAgo(tx.timestamp),
      }))
    : [{ hash: '—', type: '—', protocol: 'Connecting...', amount: '—', time: '—' }]

  const displayProtocols = protocols.map(p => ({
    name: p.name,
    category: p.category,
    tvl: p.tvl,
    volume24h: 0,
    change24h: 0,
    txCount24h: p.trackedItems,
    icon: p.icon,
  }))

  const statCards = [
    { label: 'Tracked TVL', value: totalTVL > 0 ? fmtUSD(totalTVL) : '—', isLoading: tvlLoading },
    { label: '24h Volume', value: '—', isLoading: false },
    { label: 'Transactions (24h)', value: stats.txCount24h > 0 ? fmtNum(stats.txCount24h) : '—', isLoading: loading },
    { label: 'Active Addresses', value: stats.activeAddresses > 0 ? fmtNum(stats.activeAddresses) : '—', isLoading: loading },
    { label: 'Gas Price', value: stats.gasPrice !== '0' ? stats.gasPrice : '—', suffix: 'zkLTC', isLoading: loading },
    { label: 'Latest Block', value: stats.latestBlock > 0 ? fmtNum(stats.latestBlock) : '—', isLoading: loading },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-4 flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${stats.isLive ? 'bg-green animate-pulse' : 'bg-red'}`} />
          <span className="text-xs text-text-muted">
            {stats.isLive ? 'Connected to LitVM LiteForge (Chain ID 4441)' : 'Connecting...'}
          </span>
          {lastUpdated && <span className="text-xs text-text-muted">· Updated {lastUpdated.toLocaleTimeString()}</span>}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red/20 bg-red-muted p-3">
            <p className="text-xs text-red">⚠️ {error}</p>
          </div>
        )}

        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">Dashboard</h2>
          <p className="mt-1 text-sm text-text-secondary">Real-time analytics for the LitVM LiteForge Testnet ecosystem</p>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statCards.map((card, i) => (
            <StatCard key={card.label} label={card.label} value={card.value} suffix={card.suffix} index={i} isLoading={card.isLoading} isLive={stats.isLive} />
          ))}
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <TVLChart data={chartData} />
          <VolumeChart data={chartData} />
        </div>

        <div className="mb-8"><TxChart data={chartData} /></div>
        <div className="mb-8"><ProtocolTable data={displayProtocols} isLoading={tvlLoading} /></div>

        <div className="grid gap-4 lg:grid-cols-2">
          <TokenList data={displayTokens} />
          <RecentTransactions data={displayTxs} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
