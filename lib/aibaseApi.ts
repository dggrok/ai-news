import { Article } from './types'
import { hash, toISODate } from './utils'

function stripHtml(input?: string | null): string | undefined {
  if (!input) return undefined
  try {
    return input.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  } catch {
    return input || undefined
  }
}

export interface AIBaseFetchOptions {
  pageNo?: number
  langType?: 'zh_cn' | 'en_us'
  limit?: number
}

export async function fetchAIBaseDailyNews(options: AIBaseFetchOptions = {}): Promise<Article[]> {
  const { pageNo = 1, langType = 'zh_cn', limit } = options
  const u = new URL('https://mcpapi.aibase.cn/api/aiInfo/dailyNews')
  u.searchParams.set('t', String(Date.now()))
  u.searchParams.set('langType', langType)
  u.searchParams.set('pageNo', String(pageNo))

  const res = await fetch(u.toString(), {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'AI-News-Aggregator/1.0'
    },
    cache: 'no-store',
  })

  if (!res.ok) return []

  let json: any
  try {
    json = await res.json()
  } catch {
    return []
  }

  const rawList: any[] = (() => {
    if (Array.isArray(json)) return json
    const d = json?.data
    if (Array.isArray(d)) return d
    if (Array.isArray(d?.list)) return d.list
    if (Array.isArray(d?.items)) return d.items
    if (Array.isArray(d?.records)) return d.records
    if (Array.isArray(json?.list)) return json.list
    if (Array.isArray(json?.items)) return json.items
    return []
  })()

  const mapped: Article[] = rawList.map((it) => {
    const title: string | undefined = it?.title || it?.name || it?.newsTitle || it?.descTitle
    const url: string | undefined = it?.url || it?.link || it?.newsLink || it?.jumpUrl
    if (!title || !url) return null as any

    const summaryRaw: string | undefined = it?.summary || it?.desc || it?.intro || it?.brief || it?.digest || it?.content
    const image: string | undefined = it?.image || it?.cover || it?.coverUrl || it?.pic || it?.thumbnail
    const publishedAt = toISODate(it?.publishTime || it?.publishedAt || it?.time || it?.date || it?.publish_date)

    return {
      id: hash(url || title),
      title,
      url,
      source: 'aibase',
      sourceName: 'AIBase',
      summary: stripHtml(summaryRaw),
      image,
      publishedAt,
    }
  }).filter(Boolean)

  return typeof limit === 'number' ? mapped.slice(0, limit) : mapped
}
