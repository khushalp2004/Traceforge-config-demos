import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/todo.service';
import { CreateTodoInput, UpdateTodoInput } from '../schemas/todo.schema';
import { TodoFilterType, TodoItemType } from '../types/todo.types';

export const TODO_KEYS = {
  all: ['todos'] as const,
  list: (filter?: TodoFilterType, search?: string) => ['todos', { filter, search }] as const,
};

export function useTodos(filter?: TodoFilterType, search?: string) {
  return useQuery({
    queryKey: TODO_KEYS.list(filter, search),
    queryFn: () => todoService.getTodos(filter, search),
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoInput) => todoService.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.all });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoInput }) => todoService.updateTodo(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.all });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoService.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TODO_KEYS.all });
    },
  });
}
