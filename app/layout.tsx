import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI 新闻聚合 | AI News Aggregator',
  description: '聚合来自 AIBase、量子位（QbitAI）、机器之心的 AI 新闻资讯',
  metadataBase: new URL('https://example.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="container">
          <h1>AI 新闻聚合</h1>
          <p className="subtitle">数据来源：AIBase、量子位（QbitAI）、机器之心</p>
        </header>
        <main className="container">{children}</main>
        <footer className="container footer">
          <small>
            &copy; {new Date().getFullYear()} AI 新闻聚合 · 本站仅做学习交流，内容版权归原网站所有。
          </small>
        </footer>
      </body>
    </html>
  )
}
