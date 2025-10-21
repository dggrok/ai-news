"use client"

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Article, SourceID } from '@/lib/types'
import NewsCard from './NewsCard'

const sources: { id: SourceID; name: string }[] = [
  { id: 'aibase', name: 'AIBase' },
]

const timeRanges: { id: 'all' | '24h' | '3d' | '7d' | '30d' | 'custom'; name: string }[] = [
  { id: 'all', name: '全部' },
  { id: '24h', name: '24小时' },
  { id: '3d', name: '3天' },
  { id: '7d', name: '7天' },
  { id: '30d', name: '30天' },
  { id: 'custom', name: '自定义' },
]

export default function SourceTabs({ articles, page }: { articles: Article[]; page: number }) {
  const [active, setActive] = useState<SourceID>('aibase')
  const [q, setQ] = useState('')
  const [time, setTime] = useState<'all' | '24h' | '3d' | '7d' | '30d' | 'custom'>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const filtered = useMemo(() => {
    let list = articles

    // time range
    let start: number | null = null
    let end: number | null = null
    const now = Date.now()
    if (time === '24h') start = now - 24 * 60 * 60 * 1000
    if (time === '3d') start = now - 3 * 24 * 60 * 60 * 1000
    if (time === '7d') start = now - 7 * 24 * 60 * 60 * 1000
    if (time === '30d') start = now - 30 * 24 * 60 * 60 * 1000
    if (time === 'custom') {
      if (from) start = new Date(from + 'T00:00:00').getTime()
      if (to) end = new Date(to + 'T23:59:59.999').getTime()
    }
    if (start != null || end != null) {
      list = list.filter((a) => {
        if (!a.publishedAt) return false
        const t = new Date(a.publishedAt).getTime()
        if (Number.isNaN(t)) return false
        if (start != null && t < start) return false
        if (end != null && t > end) return false
        return true
      })
    }

    if (q.trim()) {
      const kw = q.trim().toLowerCase()
      list = list.filter((a) => a.title.toLowerCase().includes(kw) || (a.summary || '').toLowerCase().includes(kw))
    }
    return list
  }, [articles, active, time, from, to, q])

  async function onRefresh() {
    setRefreshing(true)
    try {
      window.location.reload()
    } finally {
      setRefreshing(false)
    }
  }

  const currentPage = Math.max(1, Number(page) || 1)
  const prevPage = currentPage > 1 ? currentPage - 1 : 1
  const nextPage = currentPage + 1

  return (
    <div>
      <div className="controls">
        <div className="tabs tabs-frosted">
          {sources.map((s) => (
            <button key={s.id} className={`tab ${active === s.id ? 'active' : ''}`} onClick={() => setActive(s.id as any)}>
              {s.name}
            </button>
          ))}
        </div>
        <div className="search">
          <input placeholder="搜索标题 / 关键词" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      <div className="controls">
        <div className="tabs">
          {timeRanges.map((t) => (
            <button key={t.id} className={`chip ${time === t.id ? 'active' : ''}`} onClick={() => setTime(t.id)}>
              {t.name}
            </button>
          ))}
        </div>
        <div className="search" style={{ display: 'flex', gap: 8 }}>
          {time === 'custom' && (
            <>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              <span className="muted" style={{ alignSelf: 'center' }}>至</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </>
          )}
          <button className="refresh" onClick={onRefresh} disabled={refreshing}>{refreshing ? '刷新中…' : '刷新列表'}</button>
        </div>
      </div>

      <div className="grid">
        {filtered.map((a) => (
          <NewsCard key={`${a.source}:${a.id}`} article={a} />
        ))}
      </div>

      <div className="pagination">
        <Link className="refresh" href={`/?page=${prevPage}`} aria-disabled={currentPage <= 1} style={{ pointerEvents: currentPage <= 1 ? 'none' : undefined, opacity: currentPage <= 1 ? 0.6 : undefined }}>上一页</Link>
        <span className="muted">第 {currentPage} 页</span>
        <Link className="refresh" href={`/?page=${nextPage}`}>下一页</Link>
      </div>
    </div>
  )
}
