import SourceTabs from '@/components/SourceTabs'
import { fetchAIBaseDailyNews } from '@/lib/aibaseApi'

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = Math.max(1, Number(searchParams?.page || 1) || 1)
  const articles = await fetchAIBaseDailyNews({ pageNo: currentPage, langType: 'zh_cn', limit: 20 })
  return (
    <section>
      <SourceTabs articles={articles} page={currentPage} />
    </section>
  )
}
