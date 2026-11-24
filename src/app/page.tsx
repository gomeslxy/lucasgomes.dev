import { CaseStudies } from "@/components/sections/case-studies";
import { ContactFooter } from "@/components/sections/contact-footer";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { MarqueeBands } from "@/components/sections/marquee-bands";
import { Nav } from "@/components/sections/nav";
import { StackCapabilities } from "@/components/sections/stack-capabilities";
import { Trajectory } from "@/components/sections/trajectory";
import { WorksFan } from "@/components/sections/works-fan";
import { Grain } from "@/components/ui/grain";
import { Preloader } from "@/components/ui/preloader";
import { ScrollChrome } from "@/components/ui/scroll-chrome";
import { ExperienceProvider } from "@/components/providers/experience-provider";

export default function Home() {
  return (
    <ExperienceProvider>
      <Preloader />
      <Grain />
      <ScrollChrome />
      <Nav />

      <main className="relative flex flex-col w-full max-w-full overflow-x-clip">
        <Hero />
        <MarqueeBands />
        <Manifesto />
        <WorksFan />
        <CaseStudies />
        <StackCapabilities />
        <Trajectory />
      </main>

      <ContactFooter />
    </ExperienceProvider>
  );
}
