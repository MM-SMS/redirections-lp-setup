import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { LP_ROOT } from "../../../lib/lpRoot"

// Serves files straight from src/templates/public/lp at request time, instead
// of relying on Next's build-time public/ asset scan (which doesn't follow
// the symlink to that folder on Vercel). Preview-only — does not touch the
// /go/[code] redirection logic.

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".htm": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".jsonp": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params

  if (!slug?.length || slug.some(seg => seg === ".." || seg.includes("/") || seg.includes("\\")))
    return new NextResponse("Not found", { status: 404 })

  const filePath = path.join(LP_ROOT, ...slug)
  if (!filePath.startsWith(LP_ROOT))
    return new NextResponse("Not found", { status: 404 })

  let data: Buffer
  try {
    data = await fs.promises.readFile(filePath)
  } catch {
    return new NextResponse("Not found", { status: 404 })
  }

  const ext = path.extname(filePath).toLowerCase()
  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: { "Content-Type": MIME_TYPES[ext] ?? "application/octet-stream" },
  })
}
