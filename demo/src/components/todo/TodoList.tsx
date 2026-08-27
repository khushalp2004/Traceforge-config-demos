import { TodoItemType } from '@/features/todo/types/todo.types';
import { TodoItem } from './TodoItem';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';

interface TodoListProps {
  todos: TodoItemType[];
  isLoading: boolean;
  search: string;
}

export function TodoList({ todos, isLoading, search }: TodoListProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (todos.length === 0) {
    if (search) {
      return (
        <EmptyState
          title="No results found"
          description={`We couldn't find any tasks matching "${search}"`}
        />
      );
    }
    return <EmptyState />;
  }

  return (
    <div className="space-y-1">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
