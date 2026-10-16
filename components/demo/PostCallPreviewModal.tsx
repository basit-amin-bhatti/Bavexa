"use client";

import { Info, X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./LiveDemo.module.css";

export function PostCallPreviewModal({ open, onClose, children }: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.postCallModal}
      aria-labelledby="post-call-preview-title"
      aria-describedby="post-call-preview-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClose={onClose}
    >
      <div>
        <div className={styles.modalHeading}>
          <div><p className="eyebrow">BAVEXA / BEYOND THE CALL</p><h2 id="post-call-preview-title">Sample integration previews</h2></div>
          <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close sample integration previews"><X size={21} aria-hidden="true" /></button>
        </div>
        <div className={styles.modalContent}>
          <p id="post-call-preview-description" className={styles.modalDisclosure}><Info size={16} aria-hidden="true" /><span>These are fictional examples, not results from your call. Nothing has been saved or synchronized.</span></p>
          {children}
        </div>
      </div>
    </dialog>
  );
}
