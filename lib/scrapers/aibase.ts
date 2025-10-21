import * as cheerio from 'cheerio'
import { Article } from '../types'
import { absoluteUrl, hash, toISODate, uniqBy } from '../utils'

const BASE = 'https://www.aibase.cn/'

export async function scrapeAIBase(limit = 30): Promise<Article[]> {
  const res = await fetch(BASE, { headers: { 'User-Agent': 'AI-News-Aggregator/1.0' }, cache: 'no-store' })
  if (!res.ok) return []
  const html = await res.text()
  const $ = cheerio.load(html)
  const items: Article[] = []

  $('article, .post, .card, .entry').each((_, el) => {
    const root = $(el)
    const linkEl = root.find('a[href]').first()
    const href = linkEl.attr('href')
    const title = (root.find('h2, h3, .title').first().text() || linkEl.text() || '').trim()
    if (!href || !title) return
    const url = absoluteUrl(href, BASE)
    if (!/aibase\.cn/.test(url)) return
    const time = root.find('time').attr('datetime') || root.find('.date').text().trim()
    const img = root.find('img').attr('src')
    items.push({
      id: hash(url),
      title,
      url,
      source: 'aibase',
      sourceName: 'AIBase',
      summary: root.find('p').first().text().trim() || undefined,
      image: img ? absoluteUrl(img, BASE) : undefined,
      publishedAt: toISODate(time),
    })
  })

  // Fallback: capture prominent links on the page
  if (items.length < 8) {
    $('a[href*="/"], a[href^="http"]').each((_, el) => {
      const href = $(el).attr('href') || ''
      const title = ($(el).text() || '').trim()
      const url = absoluteUrl(href, BASE)
      if (!title || !/aibase\.cn\//.test(url)) return
      items.push({ id: hash(url), title, url, source: 'aibase', sourceName: 'AIBase' })
    })
  }

  return uniqBy(items, (x) => x.url).slice(0, limit)
}
