"use client"

import { useState, useMemo } from 'react'
import { Article, SourceID } from '@/lib/types'
import NewsCard from './NewsCard'

const sources: { id: SourceID | 'all'; name: string }[] = [
  { id: 'all', name: '全部' },
  { id: 'aibase', name: 'AIBase' },
  { id: 'qbitai', name: '量子位 QbitAI' },
  { id: 'jiqizhixin', name: '机器之心' },
]

const timeRanges: { id: 'all' | '24h' | '3d' | '7d' | '30d' | 'custom'; name: string }[] = [
  { id: 'all', name: '全部' },
  { id: '24h', name: '24小时' },
  { id: '3d', name: '3天' },
  { id: '7d', name: '7天' },
  { id: '30d', name: '30天' },
  { id: 'custom', name: '自定义' },
]

export default function SourceTabs({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<SourceID | 'all'>('all')
  const [q, setQ] = useState('')
  const [time, setTime] = useState<'all' | '24h' | '3d' | '7d' | '30d' | 'custom'>('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const filtered = useMemo(() => {
    let list = active === 'all' ? articles : articles.filter((a) => a.source === active)

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
      await fetch('/api/refresh', { method: 'POST' })
      window.location.reload()
    } catch {
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div>
      <div className="controls">
        <div className="tabs">
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
          <button className="refresh" onClick={onRefresh} disabled={refreshing}>{refreshing ? '刷新中…' : '刷新缓存'}</button>
        </div>
      </div>

      <div className="grid">
        {filtered.map((a) => (
          <NewsCard key={`${a.source}:${a.id}`} article={a} />
        ))}
      </div>
    </div>
  )
}
