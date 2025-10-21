import { NextResponse } from 'next/server'
import { fetchAIBaseDailyNews } from '@/lib/aibaseApi'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const articles = await fetchAIBaseDailyNews({ pageNo: 1, langType: 'zh_cn', limit: 25 })
    return NextResponse.json(
      { ok: true, count: articles.length, articles },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
