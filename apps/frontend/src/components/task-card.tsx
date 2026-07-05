"use client";

import { CalendarClock, Pencil, Trash2, UserRound } from "lucide-react";
import type { MouseEvent } from "react";
import { formatDateTime, getScheduleStatusLabel, isTaskOverdue } from "@/utils/task";
import type { Task } from "@/types/task";

export function TaskCard({ task, index, selected, onOpen, onEdit, onDelete }: { task: Task; index: number; selected?: boolean; onOpen: () => void; onToggle?: () => void; onEdit: () => void; onDelete: () => void }) {
  const overdue = isTaskOverdue(task);
  const scheduleLabel = getScheduleStatusLabel(task);
  const action = (callback: () => void) => (event: MouseEvent) => { event.stopPropagation(); callback(); };
  return <article tabIndex={0} role="button" onClick={onOpen} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()} className={`task-card reveal ${task.completed ? "is-complete" : ""} ${overdue ? "is-overdue" : ""} ${selected ? "is-selected" : ""}`} style={{ animationDelay: `${Math.min(index * 55, 300)}ms` }}>
    <div className="task-content"><div className="task-title-row"><h3>{task.title}</h3><span className={`status-badge ${overdue || task.scheduleStatus === "COMPLETED_LATE" ? "overdue" : task.completed ? "done" : "progress"}`}>{scheduleLabel}</span></div>{task.description && <p>{task.description}</p>}<div className="task-meta">{task.assignee && <span><UserRound size={13} />{task.assignee}</span>}{task.dueAt && <span><CalendarClock size={13} />{formatDateTime(task.dueAt)}</span>}</div></div>
    <div className="card-actions">{!task.completed && <button className="icon-button" onClick={action(onEdit)} aria-label="Sửa"><Pencil size={17} /></button>}<button className="icon-button delete" onClick={action(onDelete)} aria-label="Xóa"><Trash2 size={17} /></button></div>
  </article>;
}
