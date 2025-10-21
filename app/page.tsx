import SourceTabs from '@/components/SourceTabs'
import { fetchAIBaseDailyNews } from '@/lib/aibaseApi'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const articles = await fetchAIBaseDailyNews({ pageNo: 1, langType: 'zh_cn', limit: 20 })
  return (
    <section>
      <SourceTabs articles={articles} />
    </section>
  )
}
