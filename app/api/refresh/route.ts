import { NextResponse } from 'next/server'
import { refreshCacheNow } from '@/lib/cache'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? Math.max(1, Math.min(50, parseInt(limitParam, 10))) : 25
    const res = await refreshCacheNow(limit)
    return NextResponse.json({ ok: true, ...res })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  // Allow GET for convenience
  return POST(request)
}
