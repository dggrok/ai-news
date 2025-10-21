import fs from 'fs/promises'
import path from 'path'
import { Article } from './types'
import { getAggregatedArticles } from './aggregate'

const DATA_DIR = path.join(process.cwd(), 'data')
const CACHE_FILE = path.join(DATA_DIR, 'articles.json')

interface CacheShape {
  updatedAt: string
  articles: Article[]
}

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
  } catch {}
}

export async function readCachedArticles(): Promise<CacheShape | null> {
  try {
    const buf = await fs.readFile(CACHE_FILE, 'utf-8')
    const data = JSON.parse(buf) as CacheShape
    if (!Array.isArray(data.articles)) return null
    return data
  } catch {
    return null
  }
}

export async function writeCachedArticles(articles: Article[]) {
  await ensureDir()
  const payload: CacheShape = { updatedAt: new Date().toISOString(), articles }
  await fs.writeFile(CACHE_FILE, JSON.stringify(payload, null, 2), 'utf-8')
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export async function getDailyCachedArticles(limitPerSource = 20): Promise<Article[]> {
  const cached = await readCachedArticles()
  const now = new Date()
  if (cached?.updatedAt) {
    const last = new Date(cached.updatedAt)
    if (isSameDay(now, last) && cached.articles?.length) {
      return cached.articles
    }
  }
  const fresh = await getAggregatedArticles(limitPerSource)
  await writeCachedArticles(fresh)
  return fresh
}

export async function refreshCacheNow(limitPerSource = 20) {
  const fresh = await getAggregatedArticles(limitPerSource)
  await writeCachedArticles(fresh)
  const updatedAt = new Date().toISOString()
  return { count: fresh.length, updatedAt }
}
