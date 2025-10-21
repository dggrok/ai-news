import Link from 'next/link'
import { Article } from '@/lib/types'

export default function NewsCard({ article }: { article: Article }) {
  const date = article.publishedAt ? new Date(article.publishedAt) : null
  const hostname = (() => {
    try { return new URL(article.url).hostname.replace(/^www\./, '') } catch { return '' }
  })()

  return (
    <div className="card">
      <Link href={article.url} target="_blank" rel="noopener noreferrer">
        <h3>{article.title}</h3>
      </Link>
      {article.summary && <p>{article.summary.slice(0, 160)}</p>}
      <div className="meta">
        <span className="badge">{article.sourceName}</span>
        {hostname && <span>· {hostname}</span>}
        {date && <span>· {date.toLocaleString('zh-CN', { hour12: false })}</span>}
      </div>
    </div>
  )
}
