import { FloatingDock } from "@/components/floating-dock";
import { SmoothScroll } from "@/components/smooth-scroll";
import {
  ContactSection,
  FeaturedFlagshipsSection,
  HeroSection,
  PhilosophySection,
  ProjectsTimelineSection,
  TechStackSection
} from "@/components/sections";

export default function Page() {
  return (
    <main className="relative overflow-x-clip">
      <SmoothScroll />
      <HeroSection />
      <FeaturedFlagshipsSection />
      <ProjectsTimelineSection />
      <TechStackSection />
      <PhilosophySection />
      <ContactSection />
      <FloatingDock />
    </main>
  );
}