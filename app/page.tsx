import { FloatingDock } from "@/components/floating-dock";
import { SmoothScroll } from "@/components/smooth-scroll";
import {
  ContactSection,
  FeaturedFlagshipsSection,
  FocusSection,
  HeroSection,
  PhilosophySection,
  ProjectsSection,
  TechStackSection
} from "@/components/sections";

export default function Page() {
  return (
    <main className="relative overflow-x-clip">
      <SmoothScroll />
      <HeroSection />
      <FeaturedFlagshipsSection />
      <ProjectsSection />
      <FocusSection />
      <TechStackSection />
      <PhilosophySection />
      <ContactSection />
      <FloatingDock />
    </main>
  );
}
