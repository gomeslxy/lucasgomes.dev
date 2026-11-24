"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { Download, FileCheck, X } from "lucide-react";
import { certificates } from "@/lib/data";
import { useEnhancedMotion } from "@/lib/use-animation-policy";
import { useDialogA11y } from "@/lib/use-dialog-a11y";
import { EASE_EXPO } from "@/lib/utils";

export function CertificateLightbox({
  certificateId,
  onClose,
}: {
  certificateId: string;
  onClose: () => void;
}) {
  const enhancedMotion = useEnhancedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const certificate = certificates.find((item) => item.id === certificateId);

  useDialogA11y({ open: !!certificate, dialogRef, onClose });

  if (!certificate) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-ink/95 cursor-pointer"
      data-lenis-prevent
    >
      <motion.div
        initial={enhancedMotion ? { opacity: 0, scale: 0.96, y: 10 } : false}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={enhancedMotion ? { opacity: 0, scale: 0.96, y: 10 } : undefined}
        transition={{ duration: enhancedMotion ? 0.25 : 0, ease: EASE_EXPO }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[90svh] flex flex-col bg-bone text-ink rounded-lg overflow-y-auto border border-white/20 cursor-default"
      >
        {/* Modal Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 border-b border-ink/15 bg-bone md:px-6">
          <div className="min-w-0 flex-1 basis-48">
            <span className="font-mono text-[0.65rem] text-crimson-deep font-bold uppercase tracking-widest flex items-center gap-1.5">
              <FileCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Certificado
            </span>
            <h4 id="cert-modal-title" className="break-words text-lg font-bold text-ink tracking-tight mt-0.5">
              {certificate.title}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={certificate.downloadUrl}
              download
              className="press inline-flex min-h-[44px] items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-ink hover:text-crimson-deep border border-ink/20 hover:border-crimson-deep rounded"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              {certificate.downloadLabel}
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar comprovante (ESC)"
              className="press flex min-h-[44px] min-w-[44px] items-center justify-center p-2 rounded-full hover:bg-black/5 text-ink"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Reserve viewing area before image decodes */}
        <div className="shrink-0 p-4 md:p-6 bg-coal/10">
          <div className="relative h-[min(54svh,36rem)] w-full overflow-hidden rounded border border-black/10 bg-bone">
            <Image
              src={certificate.previewImageUrl}
              alt={`Comprovante de ${certificate.title}`}
              fill
              sizes="(min-width: 896px) 848px, calc(100vw - 64px)"
              priority
              quality={90}
              className="object-contain"
            />
          </div>
        </div>

        {/* Modal Footer Info */}
        <div className="px-6 py-3 border-t border-ink/10 bg-bone/90 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-smoke">
          <span>Emitido por: {certificate.issuer}</span>
          <span className="text-[0.68rem] text-smoke">Pressione ESC ou clique fora para fechar</span>
        </div>
      </motion.div>
    </div>
  );
}
