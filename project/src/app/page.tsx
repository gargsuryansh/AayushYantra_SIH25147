import Hero from '@/components/Hero';
import ProblemSection from '@/components/ProblemSection';
import SolutionSection from '@/components/SolutionSection';
import FeaturesSection from '@/components/FeaturesSection';
import TeamSection from '@/components/TeamSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <div className="w-full">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <TeamSection />
      <ContactSection />
    </div>
  );
}