"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const ProjectArchitectureModal = dynamic(
  () => import("@/components/sections/project-architecture-modal").then((mod) => mod.ProjectArchitectureModal),
  { ssr: false },
);

const WorksModalContext = createContext<((slug: string) => void) | null>(null);

/** Client boundary that lazy-loads the architecture modal and its dataset only on demand. */
export function WorksShowcaseModalHost({ children }: { children: ReactNode }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openProject = useCallback((slug: string) => {
    setHasOpened(true);
    setSelectedSlug(slug);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedSlug(null);
  }, []);

  return (
    <WorksModalContext.Provider value={openProject}>
      {children}
      {mounted &&
        hasOpened &&
        createPortal(
          <AnimatePresence>
            {selectedSlug && (
              <ProjectArchitectureModal
                key={selectedSlug}
                projectSlug={selectedSlug}
                onClose={closeProject}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </WorksModalContext.Provider>
  );
}

export function ProjectModalTrigger({
  projectSlug,
  className,
  ariaLabel,
  children,
}: {
  projectSlug: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const openProject = useContext(WorksModalContext);

  return (
    <button
      type="button"
      onClick={() => openProject?.(projectSlug)}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}
