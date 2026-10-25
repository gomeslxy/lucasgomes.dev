import { ContactFooter } from "@/components/sections/contact-footer";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { MarqueeBands } from "@/components/sections/marquee-bands";
import { Nav } from "@/components/sections/nav";
import { StackCapabilities } from "@/components/sections/stack-capabilities";
import { Trajectory } from "@/components/sections/trajectory";
import { WorksShowcase } from "@/components/sections/works-showcase";
import { Grain } from "@/components/ui/grain";
import { ScrollChrome } from "@/components/ui/scroll-chrome";
import { ExperienceProvider } from "@/components/providers/experience-provider";
import { SpatialSection } from "@/components/spatial/spatial-section";
import { AmbientEnvironment } from "@/components/experience/ambient-environment";

export default function Home() {
  return (
    <ExperienceProvider>
      <a
        href="#main-content"
        className="fixed top-3 left-4 z-[100] -translate-y-24 rounded-full bg-bone px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-ink transition-transform focus:translate-y-0 shadow-lg"
      >
        Pular para o conteúdo principal
      </a>
      <Grain />
      <AmbientEnvironment />
      <ScrollChrome />
      <Nav />

      <main id="main-content" tabIndex={-1} className="relative flex flex-col w-full max-w-full overflow-x-clip outline-none">
        <Hero />
        <SpatialSection index="01" label="PROJETOS"><WorksShowcase /></SpatialSection>
        <SpatialSection index="02" label="SOBRE"><Manifesto /></SpatialSection>
        <SpatialSection index="03" label="CONEXÕES" fold={false}><MarqueeBands /></SpatialSection>
        <SpatialSection index="04" label="STACK"><StackCapabilities /></SpatialSection>
        <SpatialSection index="05" label="TRAJETÓRIA" fold={false} light><Trajectory /></SpatialSection>
      </main>

      <ContactFooter />
    </ExperienceProvider>
  );
}
