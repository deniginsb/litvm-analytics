import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { StatCard } from './components/StatCard'
import { TVLChart, VolumeChart, TxChart } from './components/Charts'
import { ProtocolTable } from './components/ProtocolTable'
import { TokenList } from './components/TokenList'
import { RecentTransactions } from './components/RecentTransactions'
import {
  statsCards,
  chartData,
  protocols,
  topTokens,
  recentTransactions,
} from './data/mockData'

export default function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero section */}
        <div className="mb-8 animate-fade-in">
          <h2 className="text-2xl font-bold tracking-tight text-text-primary">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Real-time analytics for the LitVM LiteForge Testnet ecosystem
          </p>
        </div>

        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {statsCards.map((card, index) => (
            <StatCard
              key={card.label}
              label={card.label}
              value={card.value}
              change={card.change}
              prefix={card.prefix}
              suffix={card.suffix}
              index={index}
            />
          ))}
        </div>

        {/* Charts row */}
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <TVLChart data={chartData} />
          <VolumeChart data={chartData} />
        </div>

        {/* Tx chart */}
        <div className="mb-8">
          <TxChart data={chartData} />
        </div>

        {/* Protocol table */}
        <div className="mb-8">
          <ProtocolTable data={protocols} />
        </div>

        {/* Bottom row: Tokens + Recent Transactions */}
        <div className="grid gap-4 lg:grid-cols-2">
          <TokenList data={topTokens} />
          <RecentTransactions data={recentTransactions} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
