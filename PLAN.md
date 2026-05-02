# LitVM Analytics Dashboard — Development Plan

## Overview
On-chain analytics dashboard untuk LitVM LiteForge Testnet (Chain ID 4441).
Real-time data dari RPC + contract queries, bukan external API.

**Stack:** React + TypeScript + Tailwind + Recharts + ethers.js
**Deploy:** Vercel (frontend) + optional backend untuk caching
**GitHub:** https://github.com/deniginsb/litvm-analytics

---

## Phase 1: UI Polish & Structure ✅ DONE
**Status:** Completed
**Goal:** Dashboard UI yang elegan dengan mock data

- [x] Scaffold React + Vite + Tailwind
- [x] Stat cards (TVL, Volume, Tx, Active Addresses, Gas, Protocols)
- [x] TVL chart (7D/30D/90D selector)
- [x] Volume chart
- [x] Daily transactions chart
- [x] Protocol table (sortable)
- [x] Top tokens list
- [x] Recent transactions feed
- [x] Dark theme + purple accent
- [x] Deploy ke Vercel
- [x] Push ke GitHub

**Deliverable:** https://litvm-analytics.vercel.app

---

## Phase 2: RPC Connection & Chain Stats
**Status:** Pending
**Goal:** Hubungkan ke LitVM RPC, ambil data chain real

### Tasks:
- [ ] Setup ethers.js provider ke LitVM RPC
  - RPC URL: `https://rpc.litvm.com` atau dari testnet.litvm.com
  - Chain ID: 4441
  - Gas token: zkLTC
- [ ] Create `src/lib/litvm.ts` — RPC provider + helper functions
- [ ] Create `src/hooks/useChainStats.ts` — fetch chain data
  - `eth_blockNumber` → total blocks
  - `eth_gasPrice` → current gas price
  - Hitung tx count dari recent blocks
  - Estimate active addresses dari recent blocks
- [ ] Update StatCard components — ganti mock data dengan real data
- [ ] Add loading states & error handling
- [ ] Auto-refresh setiap 30 detik

### Files to create/modify:
```
src/lib/litvm.ts           — Provider, constants, helpers
src/hooks/useChainStats.ts — Chain stats hook
src/components/StatCard.tsx — Update dengan real data
```

### RPC Methods needed:
```
eth_blockNumber           → latest block number
eth_getBlockByNumber      → block data (tx count, timestamp)
eth_gasPrice              → current gas price
eth_getTransactionCount   → address tx count
```

---

## Phase 3: Protocol Discovery & TVL
**Status:** Pending
**Goal:** Scan dan track TVL dari protocol contracts di LitVM

### Tasks:
- [ ] Research: Cari semua contract address yang relevan
  - LiteSwap router/factory
  - WolfDex router/factory
  - LitVMSwap router/factory
  - Addax router/factory
  - Ayni lending contracts
  - OnmiFun launchpad contract
  - ZNS Connect domain contract
- [ ] Create `src/data/protocols.ts` — protocol registry
  ```typescript
  interface ProtocolConfig {
    name: string
    category: string
    contractAddress: string
    abi: any[]
    tvlMethod: string // atau manual calculation
  }
  ```
- [ ] Create `src/hooks/useProtocolTVL.ts`
  - Query token balances di pool contracts
  - Hitung TVL berdasarkan token price
  - Fallback: query balance zkLTC langsung
- [ ] Update ProtocolTable dengan real TVL data
- [ ] Handle error kalau contract tidak responding

### Approach TVL Calculation:
```
Option A: Query ERC-20 balance di setiap pool contract
  → totalSupply atau balanceOf(poolAddress)

Option B: Query DeFiLlama API (kalau LitVM sudah di-index)
  → https://api.llama.fi/tvl/{protocol}

Option C: Hitung manual dari known token prices
  → zkLTC price × total zkLTC di pools
```

---

## Phase 4: Transaction Volume & Events
**Status:** Pending
**Goal:** Track 24h volume dari DEX swap events

### Tasks:
- [ ] Create `src/hooks/useVolume.ts`
  - Query event logs: `Swap` events dari DEX contracts
  - Hitung total volume 24h dari event data
  - Filter by timestamp (24h window)
- [ ] Create `src/hooks/useRecentTxs.ts`
  - Scan recent blocks untuk tx ke known contracts
  - Parse tx input data untuk identify type (swap, add liq, etc.)
  - Format untuk display
- [ ] Update VolumeChart dengan real data
- [ ] Update RecentTransactions dengan real data

### Event Signatures:
```solidity
// Uniswap V2 style
event Swap(address indexed sender, uint amount0In, uint amount1In, uint amount0Out, uint amount1Out, address indexed to)

// Transfer (ERC-20)
event Transfer(address indexed from, address indexed to, uint256 value)
```

### Approach:
```
1. Get block range (last 24h)
   → currentBlock - (blocksPerDay)
   → blocksPerDay ≈ 86400 / blockTime

2. Query logs
   → eth_getLogs({ fromBlock, toBlock, address: dexContract, topics: [SwapSignature] })

3. Parse events
   → Decode amountIn/amountOut
   → Convert to USD value
```

---

## Phase 5: Token Tracking
**Status:** Pending
**Goal:** Track ERC-20 tokens yang ada di LitVM

### Tasks:
- [ ] Create `src/data/tokens.ts` — known token registry
  ```typescript
  interface TokenConfig {
    symbol: string
    name: string
    address: string
    decimals: number
  }
  ```
- [ ] Create `src/hooks/useTokens.ts`
  - Query token info: name, symbol, decimals, totalSupply
  - Estimate price dari DEX pools (kalau ada)
  - Track holders count
- [ ] Update TokenList dengan real data
- [ ] Add token search/filter

### Known Tokens:
- zkLTC (native gas token)
- LP tokens dari DEX pools
- Project tokens (LITESWAP, WOLF, dll)
- Tokens created via OnmiFun

---

## Phase 6: Charts & Historical Data
**Status:** Pending
**Goal:** Historical charts dengan data real

### Tasks:
- [ ] Create `src/lib/historicalData.ts`
  - Strategy: Cache data points di localStorage
  - Setiap visit = 1 data point
  - Atau scan historical blocks (slow tapi accurate)
- [ ] Create `src/hooks/useHistoricalTVL.ts`
  - Daily snapshots → localStorage
  - Rebuild chart dari accumulated data
- [ ] Create `src/hooks/useHistoricalVolume.ts`
  - Daily volume dari event logs
  - Cache results
- [ ] Update charts dengan real historical data
- [ ] Add data export (CSV)

### Caching Strategy:
```
localStorage key: litvm_analytics_history
Structure: {
  tvl: [{ date: "2026-05-01", value: 3240000 }, ...],
  volume: [{ date: "2026-05-01", value: 287000 }, ...],
  txCount: [{ date: "2026-05-01", value: 5847 }, ...],
  lastUpdated: timestamp
}
```

---

## Phase 7: Performance & Optimization
**Status:** Pending
**Goal:** Dashboard cepat dan tidak spam RPC

### Tasks:
- [ ] Implement request batching
  - Combine multiple RPC calls
  - Use multicall contract (kalau ada)
- [ ] Add proper caching
  - SWR/React Query untuk data fetching
  - Cache chain stats (30s)
  - Cache TVL (5m)
  - Cache volume (5m)
- [ ] Rate limiting
  - Max 10 requests/second ke RPC
  - Queue system untuk requests
- [ ] Error recovery
  - Retry failed requests
  - Fallback RPC endpoints
  - Graceful degradation (show last known data)
- [ ] Loading states
  - Skeleton loaders
  - Progressive data loading
  - Optimistic updates

### Dependencies to add:
```bash
npm install @tanstack/react-query
```

---

## Phase 8: Backend Caching (Optional)
**Status:** Pending (kalau frontend-only gak cukup)
**Goal:** Backend service untuk pre-process dan cache data

### Tasks:
- [ ] Setup Node.js backend
  - Express/Fastify
  - Redis untuk caching
  - Cron jobs untuk data collection
- [ ] API endpoints:
  ```
  GET /api/stats         → chain stats
  GET /api/protocols     → protocol list + TVL
  GET /api/tokens        → token list
  GET /api/volume        → 24h volume
  GET /api/transactions  → recent txs
  GET /api/history/:type → historical data
  ```
- [ ] Data collector service
  - Poll RPC setiap 30 detik
  - Index events
  - Calculate metrics
- [ ] Deploy backend
  - Railway / Fly.io / VPS

---

## Phase 9: Submission & Launch
**Status:** Pending
**Goal:** Submit ke LitVM ecosystem page

### Tasks:
- [ ] Final UI polish
- [ ] Mobile responsive check
- [ ] Performance audit (Lighthouse)
- [ ] Submit ke testnet.litvm.com
  - Project name: LitVM Analytics
  - Category: Infrastructure
  - Website: https://litvm-analytics.vercel.app
- [ ] Share di Telegram/Discord LitVM
- [ ] Blog post / Twitter thread

---

## Contract Addresses Needed
(Perlu research — belum semua diketahui)

```typescript
// DEX Routers
LITEWAP_ROUTER = "0x..."
WOLFDEX_ROUTER = "0x..."
LITVMSWAP_ROUTER = "0x..."
ADDAX_ROUTER = "0x..."

// DEX Factories
LITEWAP_FACTORY = "0x..."
WOLFDEX_FACTORY = "0x..."

// Other Protocols
AYNI_LENDING = "0x..."
ONMIFUN_LAUNCHPAD = "0x..."
ZNS_DOMAIN = "0x..."

// Tokens
ZKLTC = "0x..." // wrapped native
```

---

## Priority Order
1. **Phase 2** — RPC connection (foundation)
2. **Phase 3** — TVL tracking (most visible metric)
3. **Phase 4** — Volume & txs (activity metrics)
4. **Phase 5** — Token tracking
5. **Phase 6** — Historical charts
6. **Phase 7** — Optimization
7. **Phase 8** — Backend (kalau perlu)
8. **Phase 9** — Launch

---

## Notes
- LitVM pakai Arbitrum Nitro stack, jadi RPC format sama kayak Arbitrum
- Gas token: zkLTC
- Explorer: liteforge.explorer.caldera.xyz
- Faucet: liteforge.hub.caldera.xyz

## Resources
- LitVM Docs: https://docs.litvm.com
- Testnet: https://testnet.litvm.com
- Explorer: https://liteforge.explorer.caldera.xyz
- RPC: https://rpc.litvm.com (perlu verify)
