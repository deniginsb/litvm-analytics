// Protocol & Token registry for LitVM LiteForge Testnet
// Data gathered from explorer API

export interface ProtocolDef {
  name: string
  category: string
  icon: string
  contracts: {
    name: string
    address: string
  }[]
  // For DEX: factory address to enumerate pairs
  factoryAddress?: string
  routerAddress?: string
}

export interface TokenDef {
  symbol: string
  name: string
  address: string
  decimals: number
  icon: string
}

// ===== TOKENS =====
export const TOKENS: Record<string, TokenDef> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xd5118dEe968d1533B2A57aB66C266010AD8957fa',
    decimals: 6,
    icon: '💵',
  },
  WZKLTC: {
    symbol: 'WzkLTC',
    name: 'Wrap zkLTC',
    address: '0x60A84eBC3483fEFB251B76Aea5B8458026Ef4bea',
    decimals: 18,
    icon: '🪙',
  },
  LESTER: {
    symbol: 'Lester',
    name: 'Lester',
    address: '0xFC73cdB75F37B0da829c4e54511f410D525B76b2',
    decimals: 18,
    icon: '🪙',
  },
  PEPE: {
    symbol: 'PEPE',
    name: 'PEPE',
    address: '0x6858790e164a8761a711BAD1178220C5AebcF7eC',
    decimals: 18,
    icon: '🐸',
  },
  USDC_TEST: {
    symbol: 'USDC',
    name: 'USD Coin Test',
    address: '0xe1b51EfB42cC9748C8ecf1129705F5d27901261a',
    decimals: 6,
    icon: '💵',
  },
  WZKLTC2: {
    symbol: 'wzkLTC',
    name: 'Wrapped zkLTC',
    address: '0x315374AA9b5536037Cc1Efeea2439CCC0913A77e',
    decimals: 18,
    icon: '🪙',
  },
}

// ===== PROTOCOLS =====
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
    contracts: [],
  },
  {
    name: 'OnmiFun',
    category: 'Launchpad',
    icon: '🚀',
    contracts: [
      { name: 'LP Token', address: '0xC6748dC74CED38239d9aC9E37d19345f140b095F' },
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

// Known UniswapV2Pair contracts on LitVM
export const KNOWN_PAIRS = [
  '0x02580ba4b52ca612F1625A77127309245A697C25',
  '0x151e0Ba48026c74a133B123775B53AA8d96Ebf1e',
  '0xb3850e35A791f34813fe68EEdf7c8aE15a380536',
  '0xCf4420395e0e3A144A1Da4c5afbA17b4633F3C85',
  '0xfBCbaFaA3D55F79447796465F5fBdd72d55B8422',
]

// ABIs
export const FACTORY_ABI = [
  'function allPairsLength() view returns (uint256)',
  'function allPairs(uint256) view returns (address)',
]

export const PAIR_ABI = [
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() view returns (address)',
  'function token1() view returns (address)',
  'function totalSupply() view returns (uint256)',
]

export const ERC20_ABI = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
]
