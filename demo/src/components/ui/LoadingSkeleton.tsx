import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <div className="w-6 h-6 rounded border-2 border-gray-200 dark:border-gray-600"></div>
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex space-x-2">
            <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
            <div className="w-8 h-8 rounded-md bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
