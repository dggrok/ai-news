import Parser from 'rss-parser'
import { Article, SourceID } from './types'
import { hash, toISODate } from './utils'

const parser = new Parser({
  headers: {
    'User-Agent': 'AI-News-Aggregator/1.0 (+https://example.com)'
  },
  requestOptions: { timeout: 10000 },
})

export async function tryParseRSS(source: SourceID, sourceName: string, base: string, candidates: string[], limit = 30): Promise<Article[] | null> {
  for (const path of candidates) {
    const url = path.startsWith('http') ? path : new URL(path, base).toString()
    try {
      const feed = await parser.parseURL(url)
      if (!feed?.items?.length) continue
      const articles: Article[] = feed.items.slice(0, limit).map((item) => ({
        id: hash((item.guid || item.link || item.title || '') + source),
        title: item.title || '无标题',
        url: item.link || base,
        source,
        sourceName,
        summary: item.contentSnippet || item.content || undefined,
        image: undefined,
        publishedAt: toISODate((item.isoDate as string | undefined) || (item.pubDate as string | undefined)),
      }))
      return articles
    } catch (e) {
      // try next candidate
      continue
    }
  }
  return null
}
