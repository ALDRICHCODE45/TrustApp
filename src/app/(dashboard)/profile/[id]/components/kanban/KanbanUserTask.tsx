"use client";
import React from "react";
import { TaskStatus } from "@prisma/client";
import TaskKanban from "./taskKanban";
import { TaskWithRelations } from "./taskKanban";

// Sample data for the demo
interface Props {
  initialTasks: TaskWithRelations[];
}

export default function KanbanUserTasks({ initialTasks }: Props) {
  // This function would call your API to update task status
  const handleTaskUpdate = async (taskId: string, newStatus: TaskStatus) => {
    console.log(`Task ${taskId} status updated to ${newStatus}`);
    // Here you would call your API
    // const response = await fetch('/api/tasks/update-status', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ taskId, status: newStatus })
    // });
    // if (!response.ok) throw new Error('Failed to update task');
  };

  // This function would call your API to update task order
  const handleTaskReorder = async (
    tasks: TaskWithRelations[],
  ): Promise<void> => {
    // Here you would call your API
    // const response = await fetch('/api/tasks/reorder', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ tasks: tasks.map(t => ({ id: t.id, order: tasks.indexOf(t) })) })
    // });
    // if (!response.ok) throw new Error('Failed to reorder tasks');
  };

  return (
    <div className="min-w-full flex justify-center items-center">
      <TaskKanban
        tasks={initialTasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskReorder={handleTaskReorder}
      />
    </div>
  );
}
