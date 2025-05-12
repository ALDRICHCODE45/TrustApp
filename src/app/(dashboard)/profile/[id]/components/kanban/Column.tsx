"use client";
import { TaskStatus } from "@prisma/client";
import { useDroppable } from "@dnd-kit/core";
import { TasksWithRelations } from "../../page";

interface ColumnProps {
  id: string;
  title: string;
  tasks: TasksWithRelations[];
  status: TaskStatus;
  children: React.ReactNode;
  onDropTask?: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

// Column component with minimalist design
export const Column: React.FC<ColumnProps> = ({
  id,
  title,
  tasks,
  status,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="flex-1 min-w-64 max-w-80 flex flex-col rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-gray-800">{title}</h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
            {tasks.length}
          </span>
        </div>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 overflow-y-auto ${isOver ? "bg-blue-50" : ""}`}
        style={{ minHeight: "400px" }}
      >
        <div className="space-y-2">
          {children}
          {tasks.length === 0 && (
            <div className="p-3 text-center text-gray-400 border border-dashed border-gray-200 rounded-md bg-white text-sm">
              No tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
