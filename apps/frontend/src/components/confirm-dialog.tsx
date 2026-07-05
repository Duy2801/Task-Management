"use client";

import { AlertTriangle } from "lucide-react";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";

export function ConfirmDialog({ open, title, loading, onCancel, onConfirm }: { open: boolean; title: string; loading: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!open) return null;
  return (
    <ConfirmationDialog
      icon={<AlertTriangle />}
      title="Xóa công việc?"
      description={<>“{title}” sẽ bị xóa vĩnh viễn. Thao tác này không thể hoàn tác.</>}
      cancelLabel="Giữ lại"
      confirmLabel="Xóa"
      confirmVariant="danger"
      loading={loading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
