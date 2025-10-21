import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/lib/types'

export default function NewsCard({ article }: { article: Article }) {
  const date = article.publishedAt ? new Date(article.publishedAt) : null
  const hostname = (() => {
    try { return new URL(article.url).hostname.replace(/^www\./, '') } catch { return '' }
  })()

  return (
    <div className="card">
      <div className="card-row">
        {article.image && (
          <div className="thumb-wrap">
            <Image src={article.image} alt={article.title} width={112} height={72} className="thumb" />
          </div>
        )}
        <div className="card-body">
          <Link href={article.url} target="_blank" rel="noopener noreferrer">
            <h3>{article.title}</h3>
          </Link>
          {article.summary && <p>{article.summary.slice(0, 140)}</p>}
          <div className="meta">
            <span className="badge">{article.sourceName}</span>
            {hostname && <span>· {hostname}</span>}
            {date && <span>· {date.toLocaleString('zh-CN', { hour12: false })}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
