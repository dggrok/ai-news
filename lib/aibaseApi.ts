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
    const d = json?.data ?? json?.result ?? json?.response
    if (Array.isArray(d)) return d
    const candidates = [
      d?.list,
      d?.items,
      d?.records,
      d?.rows,
      d?.newsList,
      d?.pageList,
      d?.dataList,
      d?.datas,
      d?.resultList,
    ]
    for (const c of candidates) {
      if (Array.isArray(c)) return c
    }
    const rootCandidates = [
      json?.list,
      json?.items,
      json?.records,
      json?.rows,
      json?.newsList,
      json?.pageList,
      json?.dataList,
      json?.datas,
      json?.resultList,
    ]
    for (const c of rootCandidates) {
      if (Array.isArray(c)) return c
    }

    const pickFirstArray = (obj: any): any[] | null => {
      if (!obj || typeof obj !== 'object') return null
      for (const v of Object.values(obj)) {
        if (Array.isArray(v) && v.length && typeof v[0] === 'object') return v
        if (v && typeof v === 'object') {
          const found = pickFirstArray(v)
          if (found) return found
        }
      }
      return null
    }
    const found = pickFirstArray(json)
    if (Array.isArray(found)) return found
    return []
  })()
  const mapped: Article[] = rawList.map((it) => {
    const title: string | undefined = it?.title || it?.name || it?.newsTitle || it?.descTitle || it?.subTitle || it?.headline || it?.subject
    const url: string | undefined = 'https://news.aibase.com/zh/daily/'+ it?.oid
    if (!title || !url) return null as any

    const summaryRaw: string | undefined = it?.summary || it?.desc || it?.intro || it?.brief || it?.digest || it?.content || it?.abstract || it?.subTitle
    const image: string | undefined = it?.image || it?.cover || it?.coverUrl || it?.pic || it?.thumb || it?.img || it?.imageUrl || it?.thumbUrl || it?.coverImg || it?.cover_image
    const publishedAt = toISODate(
      it?.publishTime ||
      it?.publishedAt ||
      it?.time ||
      it?.date ||
      it?.publish_date ||
      it?.publish_time ||
      it?.ctime ||
      it?.createdAt ||
      it?.createTime ||
      it?.updateTime
    )
    return ({
      id: hash(url || title),
      title,
      url,
      source: 'aibase',
      sourceName: 'AIBase',
      summary: stripHtml(summaryRaw),
      image,
      publishedAt,
    })
  }).filter(Boolean)

  return typeof limit === 'number' ? mapped.slice(0, limit) : mapped
}
