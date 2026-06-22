export const AVATAR_COLORS = [
  { bg: "#efeafc", fg: "#7c6fe0" },
  { bg: "#eaf1fe", fg: "#4f8ef7" },
  { bg: "#e8f8ef", fg: "#2bb673" },
  { bg: "#fdeaf3", fg: "#e85d9c" },
  { bg: "#fff3e3", fg: "#dd8a1f" },
  { bg: "#e7faf9", fg: "#1aa6a6" },
]

export function colorForKey(key: string) {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}
