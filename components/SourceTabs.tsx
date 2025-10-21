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

export default function SourceTabs({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState<SourceID | 'all'>('all')
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const list = active === 'all' ? articles : articles.filter((a) => a.source === active)
    if (!q.trim()) return list
    const kw = q.trim().toLowerCase()
    return list.filter((a) => a.title.toLowerCase().includes(kw) || (a.summary || '').toLowerCase().includes(kw))
  }, [articles, active, q])

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
      <div className="grid">
        {filtered.map((a) => (
          <NewsCard key={`${a.source}:${a.id}`} article={a} />
        ))}
      </div>
    </div>
  )
}
