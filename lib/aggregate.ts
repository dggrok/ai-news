import { Article } from './types'
import { uniqBy } from './utils'
import { tryParseRSS } from './rss'
import { scrapeAIBase } from './scrapers/aibase'
import { scrapeQbitAI } from './scrapers/qbitai'
import { scrapeJiqizhixin } from './scrapers/jiqizhixin'

export async function getAggregatedArticles(limitPerSource = 20): Promise<Article[]> {
  const results: Article[][] = await Promise.all([
    // AIBase
    (async () => {
      const rss = await tryParseRSS(
        'aibase',
        'AIBase',
        'https://www.aibase.cn/',
        [
          'https://www.aibase.cn/feed',
          'https://aibase.cn/feed',
          '/feed',
          '/rss',
          '/rss.xml'
        ],
        limitPerSource
      )
      if (rss) return rss
      return await scrapeAIBase(limitPerSource)
    })(),

    // QbitAI 量子位
    (async () => {
      const rss = await tryParseRSS(
        'qbitai',
        '量子位 QbitAI',
        'https://www.qbitai.com/',
        [
          'https://www.qbitai.com/feed',
          'https://qbitai.com/feed',
          '/feed',
          '/rss',
          '/rss.xml'
        ],
        limitPerSource
      )
      if (rss) return rss
      return await scrapeQbitAI(limitPerSource)
    })(),

    // 机器之心
    (async () => {
      const rss = await tryParseRSS(
        'jiqizhixin',
        '机器之心',
        'https://www.jiqizhixin.com/',
        [
          'https://www.jiqizhixin.com/feed',
          'https://jiqizhixin.com/feed',
          '/feed',
          '/rss',
          '/rss.xml'
        ],
        limitPerSource
      )
      if (rss) return rss
      return await scrapeJiqizhixin(limitPerSource)
    })(),
  ])

  const flat = results.flat()

  // Sort by publishedAt when available, otherwise keep order
  flat.sort((a, b) => {
    const t1 = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const t2 = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return t2 - t1
  })

  return uniqBy(flat, (x) => x.url)
}
