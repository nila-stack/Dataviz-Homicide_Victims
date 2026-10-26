import HeroSection          from '@/components/HeroSection'
import QuestionnaireSection from '@/components/QuestionnaireSection'
import SilhouetteSection    from '@/components/SilhouetteSection'
import RelationshipSection  from '@/components/RelationshipSection'
import WaffleSection        from '@/components/WaffleSection'
import CauseCards           from '@/components/CauseCards'
import BarGraphSection      from '@/components/BarGraphSection'
import FemicideSection      from '@/components/FemicideSection'
import JusticeSection       from '@/components/JusticeSection'
import IndiaSection         from '@/components/IndiaSection'
import LiveCounter          from '@/components/LiveCounter'
import ResearchSnippets     from '@/components/ResearchSnippets'
import SourcesSection       from '@/components/SourcesSection'
import MarqueeFooter        from '@/components/MarqueeFooter'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <QuestionnaireSection />
      <SilhouetteSection />
      <RelationshipSection />
      <WaffleSection />
      <CauseCards />
      <BarGraphSection />
      <FemicideSection />
      <JusticeSection />
      <IndiaSection />
      <LiveCounter />
      <ResearchSnippets />
      <MarqueeFooter />
      <SourcesSection />
    </main>
  )
}
