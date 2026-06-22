"use client"

import { useState } from "react"

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API unavailable — nothing useful to do.
    }
  }

  return (
    <button type="button" className="copy-btn" onClick={handleCopy}>
      {copied ? "Copied" : "Copy"}
    </button>
  )
}
