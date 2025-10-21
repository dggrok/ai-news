import SourceTabs from '@/components/SourceTabs'
import { getAggregatedArticles } from '@/lib/aggregate'

export const revalidate = 600

export default async function Page() {
  const articles = await getAggregatedArticles(20)
  return (
    <section>
      <SourceTabs articles={articles} />
    </section>
  )
}
