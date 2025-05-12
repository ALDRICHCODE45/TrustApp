import { TaskStatus } from "@prisma/client";
import { KanbanBoard } from "./taskKanban";
import { TasksWithRelations } from "../../page";

// Create a wrapper component that will use the initialTasks provided by the parent
export function TaskKanbanBoard({
  initialTasks,
}: {
  initialTasks: TasksWithRelations[];
}) {
  // This function would call your API to update task status
  const handleTaskUpdate = async (
    taskId: string,
    newStatus: TaskStatus,
  ): Promise<void> => {
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
    tasks: TasksWithRelations[],
  ): Promise<void> => {
    console.log(
      "Tasks reordered:",
      tasks.map((t) => t.id),
    );
    // Here you would call your API
    // const response = await fetch('/api/tasks/reorder', {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ tasks: tasks.map((t, index) => ({ id: t.id, order: index })) })
    // });
    // if (!response.ok) throw new Error('Failed to reorder tasks');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <KanbanBoard
          initialTasks={initialTasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskReorder={handleTaskReorder}
        />
      </div>
    </div>
  );
}
