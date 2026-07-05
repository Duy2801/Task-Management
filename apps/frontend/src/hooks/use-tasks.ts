import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { tasksApi } from "@/api/tasks";
import type { TaskInput, TaskQuery, TaskUpdate } from "@/types/task";

const taskKeys = { all: ["tasks"] as const, list: (query: TaskQuery) => ["tasks", query] as const };

export function useTasks(query: TaskQuery) {
  return useQuery({
    queryKey: taskKeys.list(query),
    queryFn: () => tasksApi.getAll(query),
    placeholderData: (old) => old,
    refetchInterval: 60 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useTaskActions() {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: taskKeys.all });
  const create = useMutation({
    mutationFn: (input: TaskInput) => tasksApi.create(input),
    onSuccess: () => { toast.success("Đã thêm công việc"); void refresh(); },
    onError: () => toast.error("Unable to create the task"),
  });
  const update = useMutation({
    mutationFn: ({ id, input }: { id: number; input: TaskUpdate }) => tasksApi.update(id, input),
    onSuccess: () => { toast.success("Đã cập nhật công việc"); void refresh(); },
    onError: () => toast.error("Unable to update the task"),
  });
  const remove = useMutation({
    mutationFn: (id: number) => tasksApi.remove(id),
    onSuccess: () => { toast.success("Đã xóa công việc"); void refresh(); },
    onError: () => toast.error("Unable to delete the task"),
  });
  return { create, update, remove };
}
