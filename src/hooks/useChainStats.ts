import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

// LitVM Config
const RPC_URL = 'https://liteforge.rpc.caldera.xyz/http'
const CHAIN_ID = 4441
const BLOCK_TIME = 0.25 // Arbitrum Nitro ~0.25s blocks

// Provider
let _provider: ethers.JsonRpcProvider | null = null
function getProvider() {
  if (!_provider) {
    _provider = new ethers.JsonRpcProvider(RPC_URL, { chainId: CHAIN_ID, name: 'LitVM' })
  }
  return _provider
}

function fmt(num: number): string {
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toFixed(0)
}

export interface ChainStats {
  latestBlock: number
  gasPrice: string
  txCount24h: number
  activeAddresses: number
  isLive: boolean
}

export function useChainStats(interval = 30000) {
  const [stats, setStats] = useState<ChainStats>({
    latestBlock: 0,
    gasPrice: '0',
    txCount24h: 0,
    activeAddresses: 0,
    isLive: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetch = useCallback(async () => {
    try {
      const provider = getProvider()
      const [blockNum, feeData] = await Promise.all([
        provider.getBlockNumber(),
        provider.getFeeData(),
      ])

      // Sample 50 recent blocks for activity estimation
      const sampleSize = 50
      const blocks = await Promise.all(
        Array.from({ length: sampleSize }, (_, i) => provider.getBlock(blockNum - i, true))
      )

      const valid = blocks.filter(Boolean) as NonNullable<Awaited<ReturnType<typeof provider.getBlock>>>[]
      
      // Estimate tx count per day from sample
      const totalTxs = valid.reduce((s, b) => s + b.transactions.length, 0)
      const avgTx = totalTxs / valid.length
      const blocksPerDay = 86400 / BLOCK_TIME
      const txCount24h = Math.round(avgTx * blocksPerDay)

      // Unique miners as lower bound for active addresses
      const miners = new Set(valid.map(b => b.miner.toLowerCase()))
      const activeAddresses = Math.round(miners.size * (blocksPerDay / sampleSize))

      const gasPrice = feeData.gasPrice ?? 0n
      const gasPriceStr = parseFloat(ethers.formatEther(gasPrice)).toFixed(6)

      setStats({
        latestBlock: blockNum,
        gasPrice: gasPriceStr,
        txCount24h,
        activeAddresses,
        isLive: true,
      })
      setLoading(false)
      setError(null)
      setLastUpdated(new Date())
    } catch (e: any) {
      setError(e.message || 'RPC error')
      setLoading(false)
      setStats(s => ({ ...s, isLive: false }))
    }
  }, [])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, interval)
    return () => clearInterval(id)
  }, [fetch, interval])

  return { stats, loading, error, lastUpdated, refetch: fetch }
}

// Export helpers for use in other components
export { getProvider, fmt, RPC_URL, CHAIN_ID }
