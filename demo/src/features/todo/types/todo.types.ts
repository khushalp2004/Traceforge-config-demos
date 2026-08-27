import { Todo } from '@prisma/client';

export type TodoItemType = Todo;

export type TodoFilterType = 'all' | 'active' | 'completed';

export interface TodoStatsType {
  total: number;
  completed: number;
  pending: number;
}
