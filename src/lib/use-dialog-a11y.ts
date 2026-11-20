"use client";

import { useEffect, type RefObject } from "react";
import { useScrollLock } from "@/lib/use-scroll-lock";

type UseDialogA11yOptions = {
  open: boolean;
  dialogRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  restoreFocusTo?: RefObject<HTMLElement | null> | string;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared accessibility lifecycle for modals and fullscreen drawers:
 * locks page scroll, marks non-ancestor siblings inert, traps Tab focus,
 * handles Escape, and restores focus cleanly when closed.
 */
export function useDialogA11y({ open, dialogRef, onClose, restoreFocusTo }: UseDialogA11yOptions) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousInert = new Map<HTMLElement, boolean>();

    let branch: HTMLElement = dialog;
    while (branch.parentElement) {
      const parent = branch.parentElement;
      for (const sibling of parent.children) {
        if (
          sibling === branch ||
          !(sibling instanceof HTMLElement) ||
          /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)
        ) {
          continue;
        }
        previousInert.set(sibling, sibling.inert);
        sibling.inert = true;
      }
      if (parent === document.body) break;
      branch = parent;
    }

    const focusInitial = () => {
      const firstFocusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus({ preventScroll: true });
    };
    const rafId = requestAnimationFrame(focusInitial);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const items = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (!dialog.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const focusTargetId = typeof restoreFocusTo === "string" ? restoreFocusTo : null;
    const focusTargetEl = typeof restoreFocusTo === "object" ? restoreFocusTo?.current : null;

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", handleKeyDown);
      previousInert.forEach((value, element) => {
        element.inert = value;
      });

      const explicitTarget = focusTargetId ? document.getElementById(focusTargetId) : focusTargetEl;

      const candidate =
        explicitTarget && explicitTarget.isConnected && explicitTarget.getClientRects().length > 0
          ? explicitTarget
          : previousFocus && previousFocus.isConnected && previousFocus.getClientRects().length > 0
            ? previousFocus
            : explicitTarget && explicitTarget.isConnected
              ? explicitTarget
              : null;

      candidate?.focus({ preventScroll: true });
    };
  }, [open, dialogRef, onClose, restoreFocusTo]);
}
