export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-secondary mt-12">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent">
              <span className="text-[10px] font-bold text-white">L</span>
            </div>
            <span className="text-sm text-text-muted">
              LitVM Analytics
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://testnet.litvm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Testnet
            </a>
            <a
              href="https://docs.litvm.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Docs
            </a>
            <a
              href="https://x.com/litecoinvm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Twitter
            </a>
            <a
              href="https://t.me/litecoinvm"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Telegram
            </a>
          </div>
          <p className="text-xs text-text-muted">
            Community-built analytics for LitVM
          </p>
        </div>
      </div>
    </footer>
  )
}
