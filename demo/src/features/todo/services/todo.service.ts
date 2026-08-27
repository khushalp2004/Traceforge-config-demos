import { TodoItemType, TodoFilterType } from '../types/todo.types';
import { CreateTodoInput, UpdateTodoInput } from '../schemas/todo.schema';

export const todoService = {
  async getTodos(filter?: TodoFilterType, search?: string): Promise<TodoItemType[]> {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') params.append('filter', filter);
    if (search) params.append('search', search);

    const queryString = params.toString();
    const url = `/api/todos${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch todos');
    return res.json();
  },

  async createTodo(data: CreateTodoInput): Promise<TodoItemType> {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
  },

  async updateTodo(id: string, data: UpdateTodoInput): Promise<TodoItemType> {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
  },

  async deleteTodo(id: string): Promise<void> {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete todo');
  },
};
