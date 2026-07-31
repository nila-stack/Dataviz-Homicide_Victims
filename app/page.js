import HeroSection          from '@/components/HeroSection'
import QuestionnaireSection from '@/components/QuestionnaireSection'
import SilhouetteSection    from '@/components/SilhouetteSection'
import RelationshipSection  from '@/components/RelationshipSection'
import WaffleSection        from '@/components/WaffleSection'
import BarGraphSection      from '@/components/BarGraphSection'
import SankeySection        from '@/components/SankeySection'
import ResearchSnippets     from '@/components/ResearchSnippets'
import MarqueeFooter        from '@/components/MarqueeFooter'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <QuestionnaireSection />
      <SilhouetteSection />
      <RelationshipSection />
      <WaffleSection />
      <BarGraphSection />
      <SankeySection />
      <ResearchSnippets />
      <MarqueeFooter />
    </main>
  )
}
