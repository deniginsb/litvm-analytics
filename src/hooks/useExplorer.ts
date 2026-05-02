import { useState, useEffect, useCallback } from 'react'

const EXPLORER_API = 'https://liteforge.explorer.caldera.xyz/api/v2'
const ZKLTC_PRICE_USD = 80
const ARBOS = '0x00000000000000000000000000000000000a4b05'
const WZKLTC = '0x60a84ebc3483fefb251b76aea5b8458026ef4bea'
const USDC = '0xd5118dee968d1533b2a57ab66c266010ad8957fa'
const USDC_TEST = '0xe1b51efb42cc9748c8ecf1129705f5d27901261a'

export interface ExplorerTx {
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  method: string
  status: string
  decodedInput?: any
}

function normalizeTx(tx: any): ExplorerTx {
  return {
    hash: tx.hash || '',
    from: tx.from?.hash || '',
    to: tx.to?.hash || '',
    value: tx.value || '0',
    timestamp: tx.timestamp ? new Date(tx.timestamp).getTime() / 1000 : 0,
    method: tx.method || tx.decoded_input?.method_call?.split('(')[0] || 'transfer',
    status: tx.status || 'ok',
    decodedInput: tx.decoded_input,
  }
}

function isUserTx(tx: ExplorerTx) {
  return tx.from.toLowerCase() !== ARBOS
}

async function fetchTransactionsPage(params?: Record<string, string | number>) {
  const url = new URL(`${EXPLORER_API}/transactions`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)))
  }
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`Explorer API ${res.status}`)
  return res.json()
}

export function useRecentTransactions(limit = 12, refreshMs = 5000) {
  const [transactions, setTransactions] = useState<ExplorerTx[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchTransactionsPage()
      const items = (data.items || []).map(normalizeTx).filter(isUserTx).slice(0, limit)
      setTransactions(prev => {
        const merged = [...items, ...prev]
        const seen = new Set<string>()
        return merged.filter(tx => {
          if (!tx.hash || seen.has(tx.hash)) return false
          seen.add(tx.hash)
          return true
        }).slice(0, limit)
      })
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch recent transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [limit])

  useEffect(() => {
    load()
    const id = setInterval(load, refreshMs)
    return () => clearInterval(id)
  }, [load, refreshMs])

  return { transactions, isLoading, lastUpdated }
}

export interface VolumePoint {
  date: string
  volume: number
}

export interface VolumeStats {
  volume24hUsd: number
  swapCount24h: number
  sampledTxs: number
  points: VolumePoint[]
  isLoading: boolean
  lastUpdated: Date | null
}

function decodedParam(tx: ExplorerTx, name: string): string | undefined {
  const params = tx.decodedInput?.parameters
  if (!Array.isArray(params)) return undefined
  return params.find((p: any) => p.name === name)?.value
}

function estimateSwapVolumeUsd(tx: ExplorerTx): number {
  const method = tx.method.toLowerCase()
  if (!method.includes('swap')) return 0

  const nativeValue = Number(tx.value || '0') / 1e18
  if (nativeValue > 0) return nativeValue * ZKLTC_PRICE_USD

  const amountIn = decodedParam(tx, 'amountIn')
  const path = decodedParam(tx, 'path') as any
  if (!amountIn || !Array.isArray(path) || !path.length) return 0

  const inputToken = String(path[0]).toLowerCase()
  if (inputToken === WZKLTC) return (Number(amountIn) / 1e18) * ZKLTC_PRICE_USD
  if (inputToken === USDC || inputToken === USDC_TEST) return Number(amountIn) / 1e6
  return 0
}

export function useVolume24h(refreshMs = 30000, maxPages = 8): VolumeStats {
  const [state, setState] = useState<VolumeStats>({
    volume24hUsd: 0,
    swapCount24h: 0,
    sampledTxs: 0,
    points: [],
    isLoading: true,
    lastUpdated: null,
  })

  const load = useCallback(async () => {
    try {
      const cutoff = Date.now() / 1000 - 86400
      let params: Record<string, string | number> | undefined
      const txs: ExplorerTx[] = []

      for (let page = 0; page < maxPages; page++) {
        const data = await fetchTransactionsPage(params)
        const items = (data.items || []).map(normalizeTx).filter(isUserTx)
        txs.push(...items)
        const oldest = items[items.length - 1]?.timestamp || Date.now() / 1000
        if (oldest < cutoff || !data.next_page_params) break
        params = data.next_page_params
      }

      const recent = txs.filter(tx => tx.timestamp >= cutoff)
      const swaps = recent.map(tx => ({ tx, value: estimateSwapVolumeUsd(tx) })).filter(x => x.value > 0)
      const volume24hUsd = swaps.reduce((sum, x) => sum + x.value, 0)

      const buckets = new Map<string, number>()
      for (let i = 23; i >= 0; i--) {
        const d = new Date(Date.now() - i * 3600_000)
        const key = d.toISOString().slice(0, 13) + ':00'
        buckets.set(key, 0)
      }
      swaps.forEach(({ tx, value }) => {
        const key = new Date(tx.timestamp * 1000).toISOString().slice(0, 13) + ':00'
        if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + value)
      })

      setState({
        volume24hUsd,
        swapCount24h: swaps.length,
        sampledTxs: recent.length,
        points: Array.from(buckets.entries()).map(([date, volume]) => ({ date, volume })),
        isLoading: false,
        lastUpdated: new Date(),
      })
    } catch (error) {
      console.error('Failed to calculate 24h volume:', error)
      setState(prev => ({ ...prev, isLoading: false }))
    }
  }, [maxPages])

  useEffect(() => {
    load()
    const id = setInterval(load, refreshMs)
    return () => clearInterval(id)
  }, [load, refreshMs])

  return state
}

export interface ExplorerToken {
  name: string
  symbol: string
  address: string
  decimals: number
  totalSupply: string
  holders: number
}

export function useTokenList(limit = 10) {
  const [tokens, setTokens] = useState<ExplorerToken[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        const res = await fetch(`${EXPLORER_API}/tokens?limit=${limit}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()

        if (alive && data.items) {
          setTokens(
            data.items.map((t: any) => ({
              name: t.name || 'Unknown',
              symbol: t.symbol || '???',
              address: t.address || '',
              decimals: parseInt(t.decimals) || 18,
              totalSupply: t.total_supply || '0',
              holders: parseInt(t.holders_count) || 0,
            }))
          )
        }
      } catch {
        // silent
      } finally {
        if (alive) setIsLoading(false)
      }
    }

    load()
    const id = setInterval(load, 60000)
    return () => { alive = false; clearInterval(id) }
  }, [limit])

  return { tokens, isLoading }
}
