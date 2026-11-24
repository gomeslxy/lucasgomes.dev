"use client";

import dynamic from "next/dynamic";
import { AnimatePresence } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const CertificateLightbox = dynamic(
  () => import("@/components/sections/certificate-lightbox").then((mod) => mod.CertificateLightbox),
  { ssr: false },
);

const CertificateModalContext = createContext<((certificateId: string) => void) | null>(null);

/** Minimal client boundary so the Trajectory section renders purely on the server. */
export function CertificateModalHost({ children }: { children: ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasOpened, setHasOpened] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openCertificate = useCallback((certificateId: string) => {
    setHasOpened(true);
    setSelectedId(certificateId);
  }, []);

  const closeCertificate = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <CertificateModalContext.Provider value={openCertificate}>
      {children}
      {mounted &&
        hasOpened &&
        createPortal(
          <AnimatePresence>
            {selectedId && (
              <CertificateLightbox
                key={selectedId}
                certificateId={selectedId}
                onClose={closeCertificate}
              />
            )}
          </AnimatePresence>,
          document.body,
        )}
    </CertificateModalContext.Provider>
  );
}

export function CertificateTrigger({
  certificateId,
  className,
  children,
}: {
  certificateId: string;
  className?: string;
  children: ReactNode;
}) {
  const openCertificate = useContext(CertificateModalContext);

  return (
    <button
      type="button"
      onClick={() => openCertificate?.(certificateId)}
      className={className}
    >
      {children}
    </button>
  );
}
