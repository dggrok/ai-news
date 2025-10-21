import SourceTabs from '@/components/SourceTabs'
import { getDailyCachedArticles } from '@/lib/cache'

export const revalidate = 600

export default async function Page() {
  const articles = await getDailyCachedArticles(20)
  return (
    <section>
      <SourceTabs articles={articles} />
    </section>
  )
}
