"use client"

export function SessionExpiry({ exp }: { exp: number }) {
  const until = new Date(exp * 1000).toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  })
  return <span>until {until}</span>
}
