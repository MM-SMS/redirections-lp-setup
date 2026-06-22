export function MonitorIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  )
}

export function LinkIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.07 0l1.93-1.93a5 5 0 1 0-7.07-7.07L10.5 5.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0L5 12.93a5 5 0 1 0 7.07 7.07L13.5 18.5" />
    </svg>
  )
}
