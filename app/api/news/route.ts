import { NextResponse } from 'next/server'
import { getAggregatedArticles } from '@/lib/aggregate'

export const revalidate = 600
export const runtime = 'nodejs'

export async function GET() {
  try {
    const articles = await getAggregatedArticles(25)
    return NextResponse.json({ ok: true, count: articles.length, articles }, { headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=3600' } })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
