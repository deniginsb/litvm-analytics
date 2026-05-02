import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatNumber(num: number, decimals = 0): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(decimals || 2) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(decimals || 1) + 'K'
  }
  return num.toFixed(decimals)
}

export function formatCurrency(num: number): string {
  if (num >= 1_000_000) {
    return '$' + (num / 1_000_000).toFixed(2) + 'M'
  }
  if (num >= 1_000) {
    return '$' + (num / 1_000).toFixed(1) + 'K'
  }
  return '$' + num.toFixed(2)
}

export function formatPercent(num: number): string {
  const prefix = num >= 0 ? '+' : ''
  return prefix + num.toFixed(1) + '%'
}

export function shortenHash(hash: string): string {
  if (hash.length <= 12) return hash
  return hash.slice(0, 6) + '...' + hash.slice(-4)
}
