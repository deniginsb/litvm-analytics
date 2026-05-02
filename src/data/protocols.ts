// Protocol & token registry for LitVM LiteForge Testnet
// Addresses are public testnet contracts discovered from LiteForge Explorer.

export interface ProtocolContract {
  name: string
  address: string
}

export interface ProtocolDef {
  name: string
  category: string
  icon: string
  contracts: ProtocolContract[]
  factoryAddress?: string
  routerAddress?: string
}

export interface PricedTokenDef {
  symbol: string
  name: string
  address: string
  decimals: number
  priceUsd: number
  icon: string
}

export const PRICED_TOKENS: PricedTokenDef[] = [
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xd5118dEe968d1533B2A57aB66C266010AD8957fa',
    decimals: 6,
    priceUsd: 1,
    icon: '💵',
  },
  {
    symbol: 'USDC',
    name: 'USD Coin Test',
    address: '0xe1b51EfB42cC9748C8ecf1129705F5d27901261a',
    decimals: 6,
    priceUsd: 1,
    icon: '💵',
  },
  {
    symbol: 'WzkLTC',
    name: 'Wrap zkLTC',
    address: '0x60A84eBC3483fEFB251B76Aea5B8458026Ef4bea',
    decimals: 18,
    priceUsd: 80,
    icon: '🪙',
  },
  {
    symbol: 'wzkLTC',
    name: 'Wrapped zkLTC',
    address: '0x315374AA9b5536037Cc1Efeea2439CCC0913A77e',
    decimals: 18,
    priceUsd: 80,
    icon: '🪙',
  },
]

export const PROTOCOLS: ProtocolDef[] = [
  {
    name: 'LiteSwap',
    category: 'DEX',
    icon: '🔄',
    contracts: [
      { name: 'Router', address: '0xd28967D75750f477E450Df81C73f34E2713B86B4' },
      { name: 'Factory', address: '0x5687FDA3BdE14d38057699c402606ab470EcA873' },
    ],
    factoryAddress: '0x5687FDA3BdE14d38057699c402606ab470EcA873',
    routerAddress: '0xd28967D75750f477E450Df81C73f34E2713B86B4',
  },
  {
    name: 'SilverSwap',
    category: 'DEX',
    icon: '⚡',
    contracts: [
      { name: 'V3 Factory', address: '0x10DC83f364167B3Af69EeF8a3F7399F1123c622f' },
      { name: 'SwapRouter', address: '0x7a44fdbA43051229e15Be18b996161354E177A43' },
    ],
  },
  {
    name: 'Ayni',
    category: 'Lending',
    icon: '🏦',
    contracts: [
      { name: 'Protocol', address: '0x1355680107ab85aD0cD921cB308F552fdCBf4AF3' },
      { name: 'Vault', address: '0x1052Ae30704639E8bA7a77490ddBBb6AB5bF262b' },
      { name: 'Settler', address: '0x16012aB992F97DdAB8f3cDf998F911fDE7777c81' },
    ],
  },
  {
    name: 'MidasPredict',
    category: 'Prediction',
    icon: '🔮',
    contracts: [
      { name: 'Midas Outcome Token', address: '0x57b4b98E9E2bacc4acd53cA0D3B3e4a3e1CE81a9' },
    ],
  },
  {
    name: 'OnmiFun',
    category: 'Launchpad',
    icon: '🚀',
    contracts: [
      { name: 'Onmifun LP 1', address: '0xC6748dC74CED38239d9aC9E37d19345f140b095F' },
      { name: 'Onmifun LP 2', address: '0x72FC5c39DAc596D60515E516022Bf25c6CC65d68' },
      { name: 'Genesis NFT', address: '0x9328D0539edb2d7d54de3a12c19bD2Ba7f785eFB' },
    ],
  },
  {
    name: 'ZNS Connect',
    category: 'NFT',
    icon: '🌐',
    contracts: [],
  },
  {
    name: 'LendVault',
    category: 'RWA',
    icon: '📦',
    contracts: [],
  },
  {
    name: 'Addax',
    category: 'DEX',
    icon: '🦌',
    contracts: [],
  },
]

export const FACTORY_ABI = [
  'function allPairsLength() view returns (uint256)',
  'function allPairs(uint256) view returns (address)',
]

export const PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
]

export const ERC20_ABI = [
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function balanceOf(address) view returns (uint256)',
]
