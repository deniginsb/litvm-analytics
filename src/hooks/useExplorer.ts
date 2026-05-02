import { useState, useEffect } from 'react'

const EXPLORER_API = 'https://liteforge.explorer.caldera.xyz/api'

export interface ExplorerTx {
  hash: string
  from: string
  to: string
  value: string
  timestamp: number
  method: string
  status: string
}

export function useRecentTransactions(limit = 8) {
  const [transactions, setTransactions] = useState<ExplorerTx[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      try {
        const res = await fetch(`${EXPLORER_API}/transactions?limit=${limit}&sort=desc`)
        if (!res.ok) return
        const data = await res.json()

        if (alive && data.items) {
          setTransactions(
            data.items.map((tx: any) => ({
              hash: tx.hash || '',
              from: tx.from?.hash || '',
              to: tx.to?.hash || '',
              value: tx.value || '0',
              timestamp: tx.timestamp ? new Date(tx.timestamp).getTime() / 1000 : 0,
              method: tx.method || 'transfer',
              status: tx.status || 'ok',
            }))
          )
        }
      } catch {
        // silent fail
      } finally {
        if (alive) setIsLoading(false)
      }
    }

    load()
    const id = setInterval(load, 15000)
    return () => { alive = false; clearInterval(id) }
  }, [limit])

  return { transactions, isLoading }
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
        const res = await fetch(`${EXPLORER_API}/tokens?limit=${limit}&sort=holders_count`)
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
        // silent fail
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
