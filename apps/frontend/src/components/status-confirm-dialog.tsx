"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import type { Task } from "@/types/task";

export type StatusConfirmation = { task: Task; completed: boolean };

export function StatusConfirmDialog({ confirmation, loading, onCancel, onConfirm }: { confirmation: StatusConfirmation | null; loading: boolean; onCancel: () => void; onConfirm: () => void }) {
  if (!confirmation) return null;
  const { task, completed } = confirmation;
  return (
    <ConfirmationDialog
      icon={completed ? <CheckCircle2 /> : <Circle />}
      iconClassName={`status-confirm-icon ${completed ? "complete" : ""}`}
      title={completed ? "Xác nhận hoàn thành?" : "Chuyển về chưa hoàn thành?"}
      description={<>“{task.title}” sẽ được cập nhật thành <b>{completed ? "Đã hoàn thành" : "Chưa hoàn thành"}</b>.</>}
      cancelLabel="Hủy"
      confirmLabel="Xác nhận"
      loading={loading}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
