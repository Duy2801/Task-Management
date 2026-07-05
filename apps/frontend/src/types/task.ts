export type Task = {
  id: number;
  title: string;
  description: string | null;
  assignee: string | null;
  startAt: string | null;
  dueAt: string | null;
  completed: boolean;
  completedAt: string | null;
  scheduleStatus: "NO_DEADLINE" | "ON_TRACK" | "OVERDUE" | "COMPLETED_ON_TIME" | "COMPLETED_LATE";
  createdAt: string;
  updatedAt: string;
};

export type TaskInput = {
  title: string;
  description?: string;
  assignee?: string;
  startAt?: string;
  dueAt?: string;
};
export type TaskUpdate = Partial<TaskInput> & { completed?: boolean };
export type TaskQuery = {
  search?: string;
  completed?: boolean;
  overdue?: boolean;
  page: number;
  limit: number;
  sortBy: "createdAt" | "updatedAt" | "title" | "dueAt";
  order: "asc" | "desc";
};
export type TaskListResponse = {
  data: Task[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
