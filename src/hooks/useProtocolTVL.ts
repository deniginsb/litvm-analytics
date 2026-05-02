import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getProvider } from './useChainStats'
import { PROTOCOLS, KNOWN_PAIRS, PAIR_ABI, ERC20_ABI, FACTORY_ABI } from '../data/protocols'

export interface ProtocolTVL {
  name: string
  category: string
  icon: string
  tvl: number
  pairCount: number
  isLive: boolean
}

// Cache token symbols
const tokenCache: Record<string, { symbol: string; decimals: number }> = {}

async function getTokenInfo(address: string, provider: ethers.JsonRpcProvider) {
  const lower = address.toLowerCase()
  if (tokenCache[lower]) return tokenCache[lower]

  try {
    const contract = new ethers.Contract(address, ERC20_ABI, provider)
    const [symbol, decimals] = await Promise.all([
      contract.symbol().catch(() => '???'),
      contract.decimals().catch(() => 18),
    ])
    tokenCache[lower] = { symbol, decimals: Number(decimals) }
    return tokenCache[lower]
  } catch {
    tokenCache[lower] = { symbol: '???', decimals: 18 }
    return tokenCache[lower]
  }
}

// Estimate TVL from pair reserves
// Since we don't have price feeds, we use zkLTC ≈ $80 for estimation
// and USDC ≈ $1
const ZKLTC_PRICE_USD = 80

function estimatePairTVL(
  reserve0: bigint,
  reserve1: bigint,
  token0Decimals: number,
  token1Decimals: number,
  token0Symbol: string,
  token1Symbol: string
): number {
  const r0 = Number(reserve0) / 10 ** token0Decimals
  const r1 = Number(reserve1) / 10 ** token1Decimals

  let tvl = 0

  // Calculate based on known tokens
  const sym0 = token0Symbol.toUpperCase()
  const sym1 = token1Symbol.toUpperCase()

  if (sym0.includes('USD') || sym0 === 'USDC') {
    tvl += r0 * 1 // USDC = $1
    tvl += r1 * ZKLTC_PRICE_USD
  } else if (sym1.includes('USD') || sym1 === 'USDC') {
    tvl += r0 * ZKLTC_PRICE_USD
    tvl += r1 * 1
  } else if (sym0.includes('ZKLTC') || sym0 === 'WZKLTC') {
    tvl += r0 * ZKLTC_PRICE_USD * 2 // Both sides in zkLTC terms
  } else if (sym1.includes('ZKLTC') || sym1 === 'WZKLTC') {
    tvl += r1 * ZKLTC_PRICE_USD * 2
  } else {
    // Unknown pair, estimate conservatively
    tvl = (r0 + r1) * 0.01
  }

  return tvl
}

export function useProtocolTVL() {
  const [protocols, setProtocols] = useState<ProtocolTVL[]>(
    PROTOCOLS.map(p => ({
      name: p.name,
      category: p.category,
      icon: p.icon,
      tvl: 0,
      pairCount: 0,
      isLive: false,
    }))
  )
  const [totalTVL, setTotalTVL] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function calculateTVL() {
      try {
        setIsLoading(true)
        const provider = getProvider()

        // Step 1: Get all pairs from factory
        const factoryAddr = '0x5687FDA3BdE14d38057699c402606ab470EcA873'
        const factory = new ethers.Contract(factoryAddr, FACTORY_ABI, provider)

        let pairAddresses: string[] = [...KNOWN_PAIRS]

        try {
          const pairCount = await factory.allPairsLength()
          const count = Number(pairCount)
          console.log(`Factory has ${count} pairs`)

          // Fetch all pair addresses
          const pairs = await Promise.all(
            Array.from({ length: Math.min(count, 100) }, (_, i) =>
              factory.allPairs(i).catch(() => null)
            )
          )
          pairAddresses = pairs.filter(Boolean) as string[]
        } catch (e) {
          console.log('Could not query factory, using known pairs')
        }

        // Step 2: Query each pair for reserves
        let dexTVL = 0
        let validPairs = 0

        const pairData = await Promise.all(
          pairAddresses.map(async (addr) => {
            try {
              const pair = new ethers.Contract(addr, PAIR_ABI, provider)
              const [reserves, token0, token1] = await Promise.all([
                pair.getReserves(),
                pair.token0(),
                pair.token1(),
              ])

              const [info0, info1] = await Promise.all([
                getTokenInfo(token0, provider),
                getTokenInfo(token1, provider),
              ])

              const tvl = estimatePairTVL(
                reserves[0],
                reserves[1],
                info0.decimals,
                info1.decimals,
                info0.symbol,
                info1.symbol
              )

              return { addr, tvl, token0: info0.symbol, token1: info1.symbol }
            } catch {
              return null
            }
          })
        )

        for (const p of pairData) {
          if (p && p.tvl > 0) {
            dexTVL += p.tvl
            validPairs++
          }
        }

        // Step 3: Update protocols
        if (alive) {
          const updated = PROTOCOLS.map(p => {
            if (p.factoryAddress) {
              return {
                name: p.name,
                category: p.category,
                icon: p.icon,
                tvl: dexTVL,
                pairCount: validPairs,
                isLive: true,
              }
            }
            // Other protocols - check contract balance
            return {
              name: p.name,
              category: p.category,
              icon: p.icon,
              tvl: 0,
              pairCount: 0,
              isLive: p.contracts.length > 0,
            }
          })

          setProtocols(updated)
          setTotalTVL(dexTVL)
        }
      } catch (e) {
        console.error('Failed to calculate TVL:', e)
      } finally {
        if (alive) setIsLoading(false)
      }
    }

    calculateTVL()
    const id = setInterval(calculateTVL, 300000) // 5 min
    return () => { alive = false; clearInterval(id) }
  }, [])

  return { protocols, totalTVL, isLoading }
}
