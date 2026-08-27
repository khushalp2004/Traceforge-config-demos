import { CheckCircle2, Circle, ListTodo } from 'lucide-react';

interface TodoStatsProps {
  total: number;
  completed: number;
  pending: number;
}

export function TodoStats({ total, completed, pending }: TodoStatsProps) {
  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      icon: ListTodo,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-500/20',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-500/20',
    },
    {
      label: 'Pending',
      value: pending,
      icon: Circle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100 dark:bg-orange-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center sm:flex-row sm:justify-between transition-transform hover:scale-[1.02]"
          >
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-xl mt-3 sm:mt-0 ${stat.bgColor}`}>
              <Icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
