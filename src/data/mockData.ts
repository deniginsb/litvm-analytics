// Mock data for LitVM Analytics Dashboard

export interface ProtocolData {
  name: string
  category: string
  tvl: number
  volume24h: number
  change24h: number
  txCount24h: number
  icon: string
}

export interface TokenData {
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  icon: string
}

export interface ChartDataPoint {
  date: string
  tvl: number
  volume: number
  txCount: number
  activeAddresses: number
}

export interface StatCard {
  label: string
  value: string
  change: number
  prefix?: string
  suffix?: string
}

// Generate realistic-looking chart data
function generateChartData(days: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  const now = new Date()
  let tvl = 2_400_000
  let volume = 180_000
  let txCount = 4200
  let activeAddresses = 890

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Simulate growth with some volatility
    const tvlChange = (Math.random() - 0.45) * 0.08
    const volumeChange = (Math.random() - 0.5) * 0.25
    const txChange = (Math.random() - 0.45) * 0.12
    const addrChange = (Math.random() - 0.45) * 0.1

    tvl = Math.max(1_000_000, tvl * (1 + tvlChange))
    volume = Math.max(50_000, volume * (1 + volumeChange))
    txCount = Math.max(1000, Math.round(txCount * (1 + txChange)))
    activeAddresses = Math.max(200, Math.round(activeAddresses * (1 + addrChange)))

    data.push({
      date: date.toISOString().split('T')[0],
      tvl: Math.round(tvl),
      volume: Math.round(volume),
      txCount,
      activeAddresses,
    })
  }
  return data
}

export const chartData = generateChartData(90)

export const statsCards: StatCard[] = [
  {
    label: 'Total Value Locked',
    value: '$3.24M',
    change: 12.4,
    prefix: '$',
  },
  {
    label: '24h Volume',
    value: '$287K',
    change: -3.2,
  },
  {
    label: 'Transactions (24h)',
    value: '5,847',
    change: 8.7,
  },
  {
    label: 'Active Addresses',
    value: '1,234',
    change: 15.2,
  },
  {
    label: 'Avg Gas Price',
    value: '0.0012',
    suffix: 'zkLTC',
    change: -5.1,
  },
  {
    label: 'Total Protocols',
    value: '28',
    change: 3,
  },
]

export const protocols: ProtocolData[] = [
  {
    name: 'LiteSwap',
    category: 'DEX',
    tvl: 1_240_000,
    volume24h: 124_000,
    change24h: 5.2,
    txCount24h: 1847,
    icon: '🔄',
  },
  {
    name: 'Ayni',
    category: 'Lending',
    tvl: 890_000,
    volume24h: 67_000,
    change24h: 12.8,
    txCount24h: 423,
    icon: '🏦',
  },
  {
    name: 'OnmiFun',
    category: 'Launchpad',
    tvl: 340_000,
    volume24h: 89_000,
    change24h: -2.4,
    txCount24h: 2103,
    icon: '🚀',
  },
  {
    name: 'WolfDex',
    category: 'DEX',
    tvl: 287_000,
    volume24h: 43_000,
    change24h: 8.1,
    txCount24h: 634,
    icon: '🐺',
  },
  {
    name: 'LitVMSwap',
    category: 'DEX',
    tvl: 198_000,
    volume24h: 31_000,
    change24h: -1.3,
    txCount24h: 412,
    icon: '⚡',
  },
  {
    name: 'ZNS Connect',
    category: 'NFT',
    tvl: 156_000,
    volume24h: 12_000,
    change24h: 34.5,
    txCount24h: 287,
    icon: '🌐',
  },
  {
    name: 'LendVault',
    category: 'RWA',
    tvl: 89_000,
    volume24h: 8_400,
    change24h: 6.7,
    txCount24h: 156,
    icon: '📦',
  },
  {
    name: 'Addax',
    category: 'DEX',
    tvl: 67_000,
    volume24h: 23_000,
    change24h: -4.2,
    txCount24h: 534,
    icon: '🦌',
  },
]

export const topTokens: TokenData[] = [
  {
    symbol: 'zkLTC',
    name: 'zkLitecoin',
    price: 1.0,
    change24h: 0.0,
    volume24h: 287_000,
    marketCap: 3_240_000,
    icon: '🪙',
  },
  {
    symbol: 'LITESWAP',
    name: 'LiteSwap Token',
    price: 0.042,
    change24h: 12.4,
    volume24h: 45_000,
    marketCap: 420_000,
    icon: '🔄',
  },
  {
    symbol: 'AYNI',
    name: 'Ayni Token',
    price: 0.18,
    change24h: -3.7,
    volume24h: 23_000,
    marketCap: 180_000,
    icon: '🏦',
  },
  {
    symbol: 'ONMI',
    name: 'OnmiFun Token',
    price: 0.0089,
    change24h: 45.2,
    volume24h: 89_000,
    marketCap: 89_000,
    icon: '🚀',
  },
  {
    symbol: 'WOLF',
    name: 'WolfDex Token',
    price: 0.0034,
    change24h: -8.1,
    volume24h: 12_000,
    marketCap: 34_000,
    icon: '🐺',
  },
]

export const recentTransactions = [
  { hash: '0x7a3f...8b2e', type: 'Swap', protocol: 'LiteSwap', amount: '1,240 zkLTC', time: '2m ago' },
  { hash: '0x1b4c...9d1a', type: 'Add Liquidity', protocol: 'WolfDex', amount: '500 zkLTC', time: '3m ago' },
  { hash: '0x8e2d...4c7f', type: 'Register Domain', protocol: 'ZNS Connect', amount: '50 zkLTC', time: '5m ago' },
  { hash: '0x3f1a...6e8b', type: 'Swap', protocol: 'LitVMSwap', amount: '2,100 zkLTC', time: '6m ago' },
  { hash: '0x5c9b...2a4d', type: 'Create Token', protocol: 'OnmiFun', amount: '100 zkLTC', time: '8m ago' },
  { hash: '0x9d4e...7f3c', type: 'Lend', protocol: 'Ayni', amount: '3,500 zkLTC', time: '11m ago' },
  { hash: '0x2a8f...1b6e', type: 'Swap', protocol: 'Addax', amount: '890 zkLTC', time: '14m ago' },
  { hash: '0x6c1d...5a9f', type: 'Borrow', protocol: 'LendVault', amount: '1,200 zkLTC', time: '18m ago' },
]
