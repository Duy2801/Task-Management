"use client";

import { LoaderCircle, X } from "lucide-react";
import type { ReactNode } from "react";

type ConfirmationDialogProps = {
  icon: ReactNode;
  iconClassName?: string;
  title: string;
  description: ReactNode;
  cancelLabel: string;
  confirmLabel: string;
  confirmVariant?: "primary" | "danger";
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmationDialog({
  icon,
  iconClassName = "",
  title,
  description,
  cancelLabel,
  confirmLabel,
  confirmVariant = "primary",
  loading,
  onCancel,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <div className="modal-backdrop">
      <section className="confirm-card" role="alertdialog" aria-modal="true">
        <button className="icon-button close" onClick={onCancel} aria-label="Đóng"><X size={18} /></button>
        <div className={`danger-icon ${iconClassName}`}>{icon}</div>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="form-actions">
          <button className="button secondary" onClick={onCancel}>{cancelLabel}</button>
          <button className={`button ${confirmVariant}`} disabled={loading} onClick={onConfirm}>
            {loading && <LoaderCircle className="spin" size={17} />}{confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
