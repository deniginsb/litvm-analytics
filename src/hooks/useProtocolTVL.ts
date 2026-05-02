import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getProvider } from './useChainStats'
import { PROTOCOLS, PRICED_TOKENS, PAIR_ABI, ERC20_ABI, FACTORY_ABI, type ProtocolDef } from '../data/protocols'

export interface ProtocolTVL {
  name: string
  category: string
  icon: string
  tvl: number
  trackedItems: number
  isLive: boolean
  source: string
}

type TokenMeta = { symbol: string; decimals: number; priceUsd: number }

const pricedByAddress = new Map(
  PRICED_TOKENS.map(t => [t.address.toLowerCase(), { symbol: t.symbol, decimals: t.decimals, priceUsd: t.priceUsd }])
)
const tokenCache: Record<string, TokenMeta> = {}

async function getTokenMeta(address: string, provider: ethers.JsonRpcProvider): Promise<TokenMeta> {
  const lower = address.toLowerCase()
  const priced = pricedByAddress.get(lower)
  if (priced) return priced
  if (tokenCache[lower]) return tokenCache[lower]

  try {
    const token = new ethers.Contract(address, ERC20_ABI, provider)
    const [symbol, decimals] = await Promise.all([
      token.symbol().catch(() => 'UNKNOWN'),
      token.decimals().catch(() => 18),
    ])
    tokenCache[lower] = { symbol: String(symbol), decimals: Number(decimals), priceUsd: 0 }
    return tokenCache[lower]
  } catch {
    tokenCache[lower] = { symbol: 'UNKNOWN', decimals: 18, priceUsd: 0 }
    return tokenCache[lower]
  }
}

function valueTokenAmount(amount: bigint, meta: TokenMeta): number {
  if (!meta.priceUsd) return 0
  return Number(ethers.formatUnits(amount, meta.decimals)) * meta.priceUsd
}

async function contractPricedTokenTVL(address: string, provider: ethers.JsonRpcProvider): Promise<number> {
  const values = await Promise.all(PRICED_TOKENS.map(async tokenDef => {
    try {
      const token = new ethers.Contract(tokenDef.address, ERC20_ABI, provider)
      const balance = await token.balanceOf(address)
      return Number(ethers.formatUnits(balance, tokenDef.decimals)) * tokenDef.priceUsd
    } catch {
      return 0
    }
  }))
  return values.reduce((sum, value) => sum + value, 0)
}

async function pairTVL(address: string, provider: ethers.JsonRpcProvider): Promise<number> {
  try {
    const pair = new ethers.Contract(address, PAIR_ABI, provider)
    const [reserves, token0, token1] = await Promise.all([
      pair.getReserves(),
      pair.token0(),
      pair.token1(),
    ])
    const [meta0, meta1] = await Promise.all([
      getTokenMeta(token0, provider),
      getTokenMeta(token1, provider),
    ])
    return valueTokenAmount(reserves[0], meta0) + valueTokenAmount(reserves[1], meta1)
  } catch {
    return 0
  }
}

async function factoryPairAddresses(factoryAddress: string, provider: ethers.JsonRpcProvider): Promise<string[]> {
  try {
    const factory = new ethers.Contract(factoryAddress, FACTORY_ABI, provider)
    const length = Number(await factory.allPairsLength())
    const pairs = await Promise.all(
      Array.from({ length: Math.min(length, 150) }, (_, index) => factory.allPairs(index).catch(() => null))
    )
    return pairs.filter(Boolean) as string[]
  } catch {
    return []
  }
}

async function calculateProtocol(protocol: ProtocolDef, provider: ethers.JsonRpcProvider): Promise<ProtocolTVL> {
  let tvl = 0
  let trackedItems = 0
  const sources: string[] = []

  if (protocol.factoryAddress) {
    const pairs = await factoryPairAddresses(protocol.factoryAddress, provider)
    const pairValues = await Promise.all(pairs.map(addr => pairTVL(addr, provider)))
    tvl += pairValues.reduce((sum, value) => sum + value, 0)
    trackedItems += pairs.length
    sources.push(`${pairs.length} DEX pairs`)
  }

  if (protocol.contracts.length) {
    const contractValues = await Promise.all(protocol.contracts.map(c => contractPricedTokenTVL(c.address, provider)))
    const nonZeroContractValues = contractValues.filter(v => v > 0)
    tvl += nonZeroContractValues.reduce((sum, value) => sum + value, 0)
    trackedItems += nonZeroContractValues.length
    if (nonZeroContractValues.length) sources.push(`${nonZeroContractValues.length} token balances`)
  }

  return {
    name: protocol.name,
    category: protocol.category,
    icon: protocol.icon,
    tvl,
    trackedItems,
    isLive: Boolean(protocol.factoryAddress || protocol.contracts.length),
    source: sources.join(' + ') || 'No priced balances found',
  }
}

export function useProtocolTVL() {
  const [protocols, setProtocols] = useState<ProtocolTVL[]>(
    PROTOCOLS.map(p => ({
      name: p.name,
      category: p.category,
      icon: p.icon,
      tvl: 0,
      trackedItems: 0,
      isLive: false,
      source: 'Loading',
    }))
  )
  const [totalTVL, setTotalTVL] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function calculate() {
      try {
        setIsLoading(true)
        const provider = getProvider()
        const rows = await Promise.all(PROTOCOLS.map(protocol => calculateProtocol(protocol, provider)))
        if (!alive) return
        setProtocols(rows)
        setTotalTVL(rows.reduce((sum, protocol) => sum + protocol.tvl, 0))
      } catch (error) {
        console.error('Failed to calculate protocol TVL', error)
      } finally {
        if (alive) setIsLoading(false)
      }
    }

    calculate()
    const id = setInterval(calculate, 300000)
    return () => { alive = false; clearInterval(id) }
  }, [])

  return { protocols, totalTVL, isLoading }
}
