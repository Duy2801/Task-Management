import { api } from "@/lib/axios";
import type { Task, TaskInput, TaskListResponse, TaskQuery, TaskUpdate } from "@/types/task";

export const tasksApi = {
  async getAll(query: TaskQuery) {
    const { data } = await api.get<TaskListResponse>("/tasks", { params: query });
    return data;
  },

  async create(input: TaskInput) {
    const { data } = await api.post<Task>("/tasks", normalizeDates(input));
    return data;
  },

  async update(id: number, input: TaskUpdate) {
    const { data } = await api.patch<Task>(`/tasks/${id}`, normalizeDates(input));
    return data;
  },

  async remove(id: number) {
    await api.delete(`/tasks/${id}`);
  },
};

function normalizeDates<T extends TaskInput | TaskUpdate>(input: T) {
  return {
    ...input,
    startAt: input.startAt ? new Date(input.startAt).toISOString() : undefined,
    dueAt: input.dueAt ? new Date(input.dueAt).toISOString() : undefined,
  };
}
