"use client";

import { ArrowLeft, CalendarCheck, CalendarClock, CheckCircle2, Circle, Clock3, FileText, Pencil, UserRound, X } from "lucide-react";
import { formatDateTime, getScheduleStatusLabel, isTaskOverdue } from "@/utils/task";
import type { Task } from "@/types/task";

export function TaskDetail({ task, mobileOpen, loading, onClose, onEdit, onRequestStatus }: { task: Task | null; mobileOpen: boolean; loading: boolean; onClose: () => void; onEdit: () => void; onRequestStatus: (completed: boolean) => void }) {
  if (!task) return <aside className="detail-panel detail-placeholder"><div className="empty-detail-icon"><FileText /></div><h2>Chi tiết công việc</h2><p>Chọn một công việc trong danh sách để xem người thực hiện, thời hạn và mô tả.</p></aside>;
  const overdue = isTaskOverdue(task);
  return <aside className={`detail-panel ${mobileOpen ? "mobile-open" : ""}`} aria-label="Chi tiết công việc">
    <div className="detail-panel-head"><button className="detail-back" onClick={onClose} aria-label="Quay lại danh sách"><ArrowLeft size={18} /><span>Quay lại</span></button><span className={`status-badge large ${overdue ? "overdue" : task.completed ? "done" : "progress"}`}>{overdue ? "Quá hạn" : task.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}</span><button className="icon-button detail-close" onClick={onClose} aria-label="Đóng"><X size={19} /></button></div>
    <h2>{task.title}</h2>
    <div className="detail-status-grid"><div><small>TRẠNG THÁI</small><strong className={overdue ? "danger-text" : ""}>{task.completed ? <CheckCircle2 /> : <Circle />}{overdue ? "Quá hạn" : task.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}</strong></div><div><small>NGƯỜI PHỤ TRÁCH</small><strong><UserRound />{task.assignee || "Chưa phân công"}</strong></div></div>
    <div className="timeline-grid detail-timeline"><div><Clock3 /><small>BẮT ĐẦU</small><strong>{task.startAt ? formatDateTime(task.startAt) : "Chưa lên lịch"}</strong></div><div className={overdue ? "deadline-overdue" : ""}><CalendarClock /><small>HẠN HOÀN THÀNH</small><strong>{task.dueAt ? formatDateTime(task.dueAt) : "Chưa có hạn"}</strong></div>{task.completedAt && <div><CalendarCheck /><small>HOÀN THÀNH LÚC</small><strong>{formatDateTime(task.completedAt)}</strong></div>}</div>
    {task.dueAt && <div className="progress-block"><div><small>TIẾN ĐỘ THỜI HẠN</small><b>{getScheduleStatusLabel(task)}</b></div><span><i style={{ width: task.completed ? "100%" : overdue ? "100%" : "55%" }} /></span></div>}
    <div className="detail-section"><h3>Mô tả công việc</h3><p>{task.description || "Chưa có mô tả cho công việc này."}</p></div>
    {overdue && <div className="overdue-note">Công việc đã quá hạn. Hãy hoàn thành hoặc điều chỉnh thời hạn.</div>}
    <div className="status-choice"><span>CẬP NHẬT TRẠNG THÁI</span><div><button className={!task.completed ? "active incomplete" : ""} disabled={loading || !task.completed} onClick={() => onRequestStatus(false)}><Circle size={16} /> Chưa hoàn thành</button><button className={task.completed ? "active complete" : ""} disabled={loading || task.completed} onClick={() => onRequestStatus(true)}><CheckCircle2 size={16} /> Đã hoàn thành</button></div></div>
    {!task.completed && <div className="detail-actions"><button className="button secondary" onClick={onEdit}><Pencil size={16} /> Chỉnh sửa nội dung</button></div>}
  </aside>;
}
