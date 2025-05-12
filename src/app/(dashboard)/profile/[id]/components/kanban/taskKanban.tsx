"use client";
import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { TaskStatus } from "@prisma/client";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { TasksWithRelations } from "../../page";

interface KanbanBoardProps {
  initialTasks: TasksWithRelations[];
  onTaskUpdate?: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskReorder?: (tasks: TasksWithRelations[]) => Promise<void>;
}
// Main Kanban component

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  initialTasks,
  onTaskUpdate,
  onTaskReorder,
}) => {
  const [tasks, setTasks] = useState<TasksWithRelations[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Reduced activation constraint for easier dragging
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Reduced delay for touch devices
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  const pendingTasks = tasks.filter((task) => task.status === "Pending");
  const doneTasks = tasks.filter((task) => task.status === "Done");

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // If we're dragging over a column
    if (over.id === "Pending" || over.id === "Done") {
      const newStatus = over.id as TaskStatus;

      // Don't do anything if the task is already in this column
      if (activeTask.status === newStatus) return;

      // Update task status
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeTask.id ? { ...task, status: newStatus } : task,
        ),
      );
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Handling drop into a different column
    if (over.id === "Pending" || over.id === "Done") {
      const newStatus = over.id as TaskStatus;

      console.log(`Task ${active.id} moved to ${newStatus}`);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === active.id ? { ...task, status: newStatus } : task,
        ),
      );

      // Call the API update function if provided
      if (onTaskUpdate) {
        try {
          await onTaskUpdate(active.id as string, newStatus);
        } catch (error) {
          console.error("Failed to update task status:", error);
          // Could add error handling/revert state here
        }
      }
    }
    // Handling reordering within the same column
    else if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);

      // Call the API reorder function if provided
      if (onTaskReorder) {
        try {
          await onTaskReorder(newTasks);
        } catch (error) {
          console.error("Failed to reorder tasks:", error);
          // Could add error handling/revert state here
        }
      }
    }

    setActiveId(null);
  }

  return (
    <div className="w-full p-4">
      <h1 className="text-xl font-medium text-gray-800 mb-4">Task Board</h1>

      <div className="flex space-x-4 overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <Column
            id="pending-column"
            title="Pending"
            tasks={pendingTasks}
            status="Pending"
            onDropTask={onTaskUpdate}
          >
            <SortableContext
              items={pendingTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {pendingTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isActive={task.id === activeId}
                />
              ))}
            </SortableContext>
          </Column>

          <Column
            id="done-column"
            title="Done"
            tasks={doneTasks}
            status="Done"
            onDropTask={onTaskUpdate}
          >
            <SortableContext
              items={doneTasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {doneTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isActive={task.id === activeId}
                />
              ))}
            </SortableContext>
          </Column>
        </DndContext>
      </div>
    </div>
  );
};
