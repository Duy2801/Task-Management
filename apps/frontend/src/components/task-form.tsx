"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Task, TaskInput } from "@/types/task";

const schema = z.object({
  title: z.string().trim().min(1, "Task title is required").max(200, "Task title must not exceed 200 characters"),
  description: z.string().trim().max(2000, "Description must not exceed 2000 characters").optional(),
  assignee: z.string().trim().max(120, "Assignee must not exceed 120 characters").optional(),
  startAt: z.string().optional(),
  dueAt: z.string().optional(),
}).refine((data) => !data.startAt || !data.dueAt || new Date(data.dueAt) > new Date(data.startAt), {
  message: "The due date must be later than the start date",
  path: ["dueAt"],
});

const toLocalInput = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export function TaskForm({ task, open, loading, onClose, onSubmit }: {
  task?: Task | null; open: boolean; loading: boolean; onClose: () => void; onSubmit: (data: TaskInput) => void;
}) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskInput>({ resolver: zodResolver(schema) });
  useEffect(() => reset({
    title: task?.title ?? "",
    description: task?.description ?? "",
    assignee: task?.assignee ?? "",
    startAt: toLocalInput(task?.startAt),
    dueAt: toLocalInput(task?.dueAt),
  }), [task, open, reset]);
  if (!open) return null;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <section className="modal-card task-form-modal" role="dialog" aria-modal="true" aria-labelledby="form-title">
      <div className="modal-head"><div><span className="eyebrow">{task ? "CHỈNH SỬA" : "CÔNG VIỆC MỚI"}</span><h2 id="form-title">{task ? "Cập nhật công việc" : "Bạn cần làm gì?"}</h2></div><button className="icon-button" onClick={onClose} aria-label="Đóng"><X size={19} /></button></div>
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <label>Tên công việc<input autoFocus placeholder="Ví dụ: Hoàn thiện giao diện..." {...register("title")} aria-invalid={!!errors.title} /></label>
        {errors.title && <p className="field-error">{errors.title.message}</p>}
        <label>Người thực hiện<input placeholder="Nhập họ tên người phụ trách" {...register("assignee")} /></label>
        {errors.assignee && <p className="field-error">{errors.assignee.message}</p>}
        <label>Mô tả <span>(không bắt buộc)</span><textarea rows={4} placeholder="Mục tiêu và yêu cầu của công việc..." {...register("description")} /></label>
        {errors.description && <p className="field-error">{errors.description.message}</p>}
        <div className="date-grid">
          <label>Thời gian bắt đầu<input type="datetime-local" {...register("startAt")} /></label>
          <label>Hạn hoàn thành<input type="datetime-local" {...register("dueAt")} aria-invalid={!!errors.dueAt} /></label>
        </div>
        {errors.dueAt && <p className="field-error">{errors.dueAt.message}</p>}
        <div className="form-actions"><button type="button" className="button secondary" onClick={onClose}>Hủy</button><button className="button primary" disabled={loading}>{loading && <LoaderCircle className="spin" size={17} />}{task ? "Lưu thay đổi" : "Thêm công việc"}</button></div>
      </form>
    </section>
  </div>;
}
