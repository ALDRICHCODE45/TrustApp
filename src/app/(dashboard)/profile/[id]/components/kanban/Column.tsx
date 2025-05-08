import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { TaskStatus } from "@prisma/client";
import { TaskWithRelations } from "./taskKanban";

interface ColumnProps {
  id: string;
  title: string;
  tasks: TaskWithRelations[];
  status: TaskStatus;
  children: React.ReactNode;
  onDropTask: (taskId: string, newStatus: TaskStatus) => Promise<void>;
}

export const Column = ({
  id,
  title,
  tasks,
  status,
  children,
  onDropTask,
}: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      className={`flex-1 min-w-80 max-w-96 flex flex-col rounded-lg shadow-lg bg-white overflow-hidden ${
        isOver ? "ring-2 ring-blue-500 ring-opacity-50" : ""
      }`}
    >
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 p-3 overflow-y-auto bg-gray-50 min-h-96 ${
          isOver ? "bg-blue-50" : ""
        }`}
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        <div className="space-y-3">
          {children}
          {tasks.length === 0 && (
            <div className="p-4 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              No hay tareas
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
