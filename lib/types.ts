export type SourceID = 'aibase' | 'qbitai' | 'jiqizhixin'

export interface Article {
  id: string
  title: string
  url: string
  source: SourceID
  sourceName: string
  summary?: string
  image?: string
  publishedAt?: string // ISO string
}

export interface FetchOptions {
  limit?: number
}
