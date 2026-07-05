"use client";

import { AlertTriangle, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, CircleDashed, Funnel, ListTodo, Plus, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { StatusConfirmDialog, type StatusConfirmation } from "@/components/status-confirm-dialog";
import { TaskCard } from "@/components/task-card";
import { TaskDetail } from "@/components/task-detail";
import { TaskForm } from "@/components/task-form";
import { EmptyState, ErrorState, TaskSkeleton } from "@/components/task-states";
import { ThemeToggle } from "@/components/theme-toggle";
import { useDebounce } from "@/hooks/use-debounce";
import { useTaskActions, useTasks } from "@/hooks/use-tasks";
import type { Task, TaskInput, TaskQuery } from "@/types/task";

type Status = "all" | "active" | "completed" | "overdue";
const navItems = [
  { value: "all", label: "Tất cả công việc", icon: ListTodo },
  { value: "active", label: "Chưa hoàn thành", icon: CircleDashed },
  { value: "completed", label: "Đã hoàn thành", icon: CheckCircle2 },
  { value: "overdue", label: "Đang quá hạn", icon: AlertTriangle },
] as const;

export default function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const [status, setStatus] = useState<Status>("all");
  const [sort, setSort] = useState("createdAt-desc");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [viewing, setViewing] = useState<Task | null>(null);
  const [confirmingStatus, setConfirmingStatus] = useState<StatusConfirmation | null>(null);
  const [sortBy, order] = sort.split("-") as [TaskQuery["sortBy"], TaskQuery["order"]];
  const query = useMemo<TaskQuery>(() => ({ search: debouncedSearch || undefined, completed: status === "all" || status === "overdue" ? undefined : status === "completed", overdue: status === "overdue" || undefined, page, limit: 8, sortBy, order }), [debouncedSearch, status, page, sortBy, order]);
  const tasks = useTasks(query);
  const actions = useTaskActions();
  const activeLabel = navItems.find((item) => item.value === status)?.label;

  const openCreate = () => { setEditing(null); setFormOpen(true); };
  const openEdit = (task: Task) => { setEditing(task); setViewing(null); setFormOpen(true); };
  const changeFilter = (value: Status) => { setStatus(value); setPage(1); };
  async function submit(data: TaskInput) { try { if (editing) await actions.update.mutateAsync({ id: editing.id, input: data }); else await actions.create.mutateAsync(data); setFormOpen(false); } catch {} }
  async function confirmDelete() {
    if (!deleting) return;
    try {
      const deletedId = deleting.id;
      await actions.remove.mutateAsync(deletedId);
      setDeleting(null);
      setViewing((current) => current?.id === deletedId ? null : current);
    } catch {}
  }
  function confirmStatusChange() { if (!confirmingStatus) return; actions.update.mutate({ id: confirmingStatus.task.id, input: { completed: confirmingStatus.completed } }, { onSuccess: (updated) => { setViewing(updated); setConfirmingStatus(null); } }); }

  return <main className="dashboard-shell">
    <aside className="sidebar">
      <div className="sidebar-brand"><span><CheckLogo /></span><div><strong>Taskly</strong><small>WORKSPACE</small></div></div>
      <nav className="sidebar-nav"><p>CÔNG VIỆC</p>{navItems.map(({ value, label, icon: Icon }) => <button key={value} className={status === value ? "active" : ""} onClick={() => changeFilter(value)}><Icon size={18} /><span>{label}</span>{value === "all" && tasks.data && <b>{tasks.data.meta.total}</b>}</button>)}</nav>
      <div className="sidebar-tip"><Sparkles size={18} /><strong>Mẹo nhỏ</strong><p>Chọn một công việc để xem đầy đủ tiến độ và thời hạn.</p></div>
      <div className="sidebar-bottom"><ThemeToggle /><span>Giao diện</span></div>
    </aside>

    <section className="main-area">
      <div className="task-board new-board">
        <section className="workspace queue-panel">
          <div className="queue-head"><div><span>DANH SÁCH</span><h2>{activeLabel}</h2></div><div className="queue-actions"><b>{tasks.data?.meta.total ?? 0} công việc</b><button className="button primary" onClick={openCreate}><Plus size={17} /> Tạo công việc</button></div></div>
          <div className="queue-toolbar">
            <div className="search-box"><Search size={18} /><input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm công việc hoặc người phụ trách..." />{search !== debouncedSearch && <span className="searching-dot" />}</div>
            <details className="status-filter">
              <summary aria-label={`Lọc theo trạng thái: ${activeLabel}`}><Funnel size={15} /><span>{status === "all" ? "Trạng thái" : activeLabel}</span><ChevronDown className="filter-chevron" size={14} /></summary>
              <div className="status-filter-menu">{navItems.map(({ value, label, icon: Icon }) => <button key={value} className={status === value ? "active" : ""} onClick={(event) => { changeFilter(value); event.currentTarget.closest("details")?.removeAttribute("open"); }}><Icon size={16} /><span>{label}</span>{status === value && <Check size={15} />}</button>)}</div>
            </details>
            <select aria-label="Sắp xếp công việc" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}><option value="createdAt-desc">Mới nhất</option><option value="dueAt-asc">Hạn gần nhất</option><option value="title-asc">Tên A → Z</option><option value="updatedAt-desc">Vừa cập nhật</option></select>
          </div>
          <div className="list-area">{tasks.isLoading ? <TaskSkeleton /> : tasks.isError ? <ErrorState retry={() => void tasks.refetch()} /> : !tasks.data?.data.length ? <EmptyState searching={!!search || status !== "all"} onCreate={openCreate} /> : <div className={`task-stack ${tasks.isFetching ? "is-refreshing" : ""}`}>{tasks.data.data.map((task, index) => <TaskCard key={task.id} task={task} index={index} selected={viewing?.id === task.id} onOpen={() => setViewing(task)} onToggle={() => setViewing(task)} onEdit={() => openEdit(task)} onDelete={() => setDeleting(task)} />)}</div>}</div>
          {(tasks.data?.meta.totalPages ?? 0) > 1 && <nav className="pagination"><button disabled={page === 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={16} /></button><span>Trang <b>{page}</b> / {tasks.data?.meta.totalPages}</span><button disabled={page === tasks.data?.meta.totalPages} onClick={() => setPage((p) => p + 1)}><ChevronRight size={16} /></button></nav>}
        </section>
        <TaskDetail task={viewing} mobileOpen={!!viewing} loading={actions.update.isPending} onClose={() => setViewing(null)} onEdit={() => viewing && openEdit(viewing)} onRequestStatus={(completed) => viewing && setConfirmingStatus({ task: viewing, completed })} />
      </div>
    </section>
    <TaskForm task={editing} open={formOpen} loading={actions.create.isPending || actions.update.isPending} onClose={() => setFormOpen(false)} onSubmit={(data) => void submit(data)} />
    <ConfirmDialog open={!!deleting} title={deleting?.title ?? ""} loading={actions.remove.isPending} onCancel={() => setDeleting(null)} onConfirm={() => void confirmDelete()} />
    <StatusConfirmDialog confirmation={confirmingStatus} loading={actions.update.isPending} onCancel={() => setConfirmingStatus(null)} onConfirm={confirmStatusChange} />
  </main>;
}

function CheckLogo() { return <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="2.7"><path d="m6.5 12 3.4 3.5L18 7.8" /></svg>; }
