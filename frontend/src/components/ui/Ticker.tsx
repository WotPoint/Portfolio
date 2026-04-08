interface TickerProps {
  items: string[]
}

export default function Ticker({ items }: TickerProps) {
  const repeated = [...items, ...items, ...items]

  return (
    <div className="overflow-hidden border-y border-border py-3 bg-surface select-none">
      <div
        className="flex gap-8 whitespace-nowrap ticker-track"
        style={{
          animation: 'ticker 25s linear infinite',
          width: 'max-content',
        }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="flex items-center gap-8 font-mono text-xs text-muted">
            <span className="text-accent/40">◆</span>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        .overflow-hidden:hover .ticker-track {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
