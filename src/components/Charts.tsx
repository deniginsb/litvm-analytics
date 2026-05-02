import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartDataPoint } from '../data/mockData'
import { formatNumber, formatCurrency } from '../lib/utils'
import { useState } from 'react'

interface TVLChartProps {
  data: ChartDataPoint[]
}

const timeRanges = ['7D', '30D', '90D'] as const

export function TVLChart({ data }: TVLChartProps) {
  const [range, setRange] = useState<(typeof timeRanges)[number]>('30D')

  const filteredData = (() => {
    const days = range === '7D' ? 7 : range === '30D' ? 30 : 90
    return data.slice(-days)
  })()

  return (
    <div className="rounded-xl border border-border bg-surface-secondary p-5 animate-slide-up stagger-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Tracked TVL</h3>
          <p className="text-xs text-text-muted mt-0.5">Current priced asset balances tracked on-chain</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-surface p-0.5">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                range === r
                  ? 'bg-accent text-white'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tvlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                const d = new Date(val)
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => formatCurrency(val)}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-tertiary)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--color-text-primary)',
              }}
              formatter={(value: any) => [formatCurrency(value), 'TVL']}
              labelFormatter={(label) => {
                const d = new Date(label)
                return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              }}
            />
            <Area
              type="monotone"
              dataKey="tvl"
              stroke="#7c3aed"
              strokeWidth={2}
              fill="url(#tvlGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#7c3aed', strokeWidth: 2, stroke: 'var(--color-surface)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

interface VolumeChartProps {
  data: ChartDataPoint[]
}

export function VolumeChart({ data }: VolumeChartProps) {
  const [range, setRange] = useState<(typeof timeRanges)[number]>('30D')

  const filteredData = (() => {
    const days = range === '7D' ? 7 : range === '30D' ? 30 : 90
    return data.slice(-days)
  })()

  return (
    <div className="rounded-xl border border-border bg-surface-secondary p-5 animate-slide-up stagger-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">24h Swap Volume</h3>
          <p className="text-xs text-text-muted mt-0.5">Live estimate from recent swap transactions</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-surface p-0.5">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                range === r
                  ? 'bg-blue text-white'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                const d = new Date(val)
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => formatCurrency(val)}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-tertiary)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--color-text-primary)',
              }}
              formatter={(value: any) => [formatCurrency(value), 'Volume']}
              labelFormatter={(label) => {
                const d = new Date(label)
                return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              }}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#volumeGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'var(--color-surface)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

interface TxChartProps {
  data: ChartDataPoint[]
}

export function TxChart({ data }: TxChartProps) {
  const filteredData = data.slice(-30)

  return (
    <div className="rounded-xl border border-border bg-surface-secondary p-5 animate-slide-up stagger-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Daily Transactions Trend (Phase 6)</h3>
        <p className="text-xs text-text-muted mt-0.5">Historical backfill coming after realtime metrics</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="txGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                const d = new Date(val)
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => formatNumber(val)}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-tertiary)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '12px',
                color: 'var(--color-text-primary)',
              }}
              formatter={(value: any) => [formatNumber(value), 'Transactions']}
              labelFormatter={(label) => {
                const d = new Date(label)
                return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              }}
            />
            <Area
              type="monotone"
              dataKey="txCount"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#txGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: 'var(--color-surface)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
