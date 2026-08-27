'use client';

import { useState } from 'react';
import { useTodos, useCreateTodo } from '@/features/todo/hooks/useTodos';
import { TodoFilterType } from '@/features/todo/types/todo.types';
import { TodoStats } from './TodoStats';
import { TodoFilters } from './TodoFilters';
import { TodoList } from './TodoList';
import { Plus } from 'lucide-react';

export function TodoDashboard() {
  const [filter, setFilter] = useState<TodoFilterType>('all');
  const [search, setSearch] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // We use useDebounce or just pass search directly. For simplicity, passing directly here.
  const { data: todos = [], isLoading } = useTodos(filter, search);
  const { data: allTodos = [] } = useTodos(); // For stats, we want to know total numbers ignoring current filter/search
  
  const createTodo = useCreateTodo();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle === 'event crash') {
      // Simulate a realistic error happening inside a user interaction / event handler
      const user: any = undefined;
      user.saveAction(); // Throws TypeError: Cannot read properties of undefined (reading 'saveAction')
    }
    
    if (newTaskTitle.trim()) {
      createTodo.mutate(
        { title: newTaskTitle.trim() },
        {
          onSuccess: () => setNewTaskTitle(''),
        }
      );
    }
  };

  const stats = {
    total: allTodos.length,
    completed: allTodos.filter(t => t.completed).length,
    pending: allTodos.filter(t => !t.completed).length,
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-4xl">
          Task Master
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Organize your day, boost your productivity.
        </p>
      </div>

      <TodoStats {...stats} />

      <form onSubmit={handleCreate} className="mb-8 relative">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          disabled={createTodo.isPending}
          className="w-full pl-5 pr-14 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:text-white"
        />
        <button
          type="submit"
          disabled={!newTaskTitle.trim() || createTodo.isPending}
          className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:hover:bg-blue-500 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      </form>

      <div className="bg-white dark:bg-gray-900/50 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
        <TodoFilters
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
        />
        
        <TodoList todos={todos} isLoading={isLoading} search={search} />
      </div>
    </div>
  );
}
