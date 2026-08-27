import { useState } from 'react';
import { TodoItemType } from '@/features/todo/types/todo.types';
import { useUpdateTodo, useDeleteTodo } from '@/features/todo/hooks/useTodos';
import { Check, Edit2, Trash2, X } from 'lucide-react';

interface TodoItemProps {
  todo: TodoItemType;
}

export function TodoItem({ todo }: TodoItemProps) {
  if (todo.title === 'render crash') {
    // Simulate a realistic React rendering error (e.g. accessing a property of an undefined object)
    const data: any = null;
    console.log(data.missingField); // This will throw a TypeError during render
  }

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const handleToggle = () => {
    updateTodo.mutate({ id: todo.id, data: { completed: !todo.completed } });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editTitle !== todo.title) {
      updateTodo.mutate({ id: todo.id, data: { title: editTitle.trim() } });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  return (
    <div
      className={`group flex items-center justify-between p-4 mb-3 rounded-xl border transition-all duration-200 ${
        todo.completed
          ? 'bg-gray-50 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-center flex-1 min-w-0 mr-4">
        <button
          onClick={handleToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
            todo.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 dark:border-gray-500 hover:border-green-400'
          }`}
        >
          {todo.completed && <Check className="w-4 h-4" />}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSaveEdit}
            autoFocus
            className="flex-1 bg-transparent border-b-2 border-blue-500 focus:outline-none px-1 py-0.5 text-gray-900 dark:text-white"
          />
        ) : (
          <span
            className={`truncate text-base transition-colors ${
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-200'
            }`}
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <button
            onClick={() => {
              setIsEditing(false);
              setEditTitle(todo.title);
            }}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => deleteTodo.mutate(todo.id)}
          className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
