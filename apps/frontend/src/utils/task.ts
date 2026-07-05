import type { Task } from "@/types/task";

const scheduleStatusLabels: Record<Task["scheduleStatus"], string> = {
  NO_DEADLINE: "Chưa có hạn",
  ON_TRACK: "Đúng tiến độ",
  OVERDUE: "Quá hạn",
  COMPLETED_ON_TIME: "Hoàn thành đúng hạn",
  COMPLETED_LATE: "Hoàn thành trễ hạn",
};

export function isTaskOverdue(task: Task) {
  return task.scheduleStatus === "OVERDUE";
}

export function getScheduleStatusLabel(task: Task) {
  return scheduleStatusLabels[task.scheduleStatus];
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
