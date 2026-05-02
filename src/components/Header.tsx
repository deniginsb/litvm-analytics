import { useState, useEffect } from 'react'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-surface/80 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <span className="text-sm font-bold text-white">L</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-text-primary tracking-tight">
              LitVM Analytics
            </h1>
            <p className="text-[10px] text-text-muted uppercase tracking-widest">
              LiteForge Testnet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-surface-secondary px-3 py-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
            <span className="text-xs text-text-secondary">Live</span>
          </div>
          <a
            href="https://testnet.litvm.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            LitVM Testnet ↗
          </a>
          <a
            href="https://liteforge.explorer.caldera.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Explorer ↗
          </a>
        </div>
      </div>
    </header>
  )
}
