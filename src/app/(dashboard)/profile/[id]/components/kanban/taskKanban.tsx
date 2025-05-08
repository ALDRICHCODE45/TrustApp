"use client";
import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import { LeadStatus, TaskStatus } from "@prisma/client";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { Prisma } from "@prisma/client";

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    assignedTo: true;
  };
}>;

interface TaskKanbanProps {
  tasks: TaskWithRelations[];
  onTaskUpdate?: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskReorder?: (tasks: TaskWithRelations[]) => Promise<void>;
}

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  onTaskUpdate,
  onTaskReorder,
}) => {
  const [localTasks, setLocalTasks] = useState<TaskWithRelations[]>(
    tasks || [],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [previousState, setPreviousState] = useState<TaskWithRelations[]>([]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    }),
  );

  const pendingTasks = localTasks.filter(
    (task) => task.status === TaskStatus.Pending,
  );
  const doneTasks = localTasks.filter(
    (task) => task.status === TaskStatus.Done,
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = localTasks.find((t) => t.id === active.id);
    if (task) {
      setActiveId(active.id as string);
      setPreviousState([...localTasks]);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Extract the column ID where the task is being dragged over
    const overId = over.id.toString();
    // Find the task that's being dragged
    const activeTask = localTasks.find((task) => task.id === active.id);

    if (!activeTask) return;

    // If we're dragging over a different column (not over another task in the same column)
    if (overId === TaskStatus.Pending || overId === TaskStatus.Done) {
      const newStatus =
        overId === TaskStatus.Pending ? TaskStatus.Pending : TaskStatus.Done;

      // Don't do anything if the task is already in this column
      if (activeTask.status === newStatus) return;

      // Update local state to move the task to the new column
      setLocalTasks((prev) =>
        prev.map((task) =>
          task.id === activeTask.id ? { ...task, status: newStatus } : task,
        ),
      );
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeTask = localTasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Handling drop into a different column
    if (over.id === TaskStatus.Pending || over.id === TaskStatus.Done) {
      const newStatus =
        over.id === TaskStatus.Pending ? TaskStatus.Pending : TaskStatus.Done;

      try {
        if (onTaskUpdate) {
          await onTaskUpdate(active.id as string, newStatus);
        }
      } catch (error) {
        console.error("Failed to update task status:", error);
        setLocalTasks(previousState); // Revert on error
      }
      return;
    }

    // Handling reordering within the same column
    if (active.id !== over.id) {
      const oldIndex = localTasks.findIndex((task) => task.id === active.id);
      const newIndex = localTasks.findIndex((task) => task.id === over.id);

      const newTasks = arrayMove(localTasks, oldIndex, newIndex);
      setLocalTasks(newTasks);

      try {
        if (onTaskReorder) {
          await onTaskReorder(newTasks);
        }
      } catch (error) {
        console.error("Failed to update task order:", error);
        setLocalTasks(previousState); // Revert on error
      }
    }

    setActiveId(null);
  }

  async function handleDropInColumn(taskId: string, newStatus: TaskStatus) {
    // This function is now used for programmatic drops, not DnD events
    const prevTasksState = [...localTasks];

    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );

    try {
      if (onTaskUpdate) {
        await onTaskUpdate(taskId, newStatus);
      }
    } catch (error) {
      console.error("Failed to update task status:", error);
      setLocalTasks(prevTasksState);
    }
  }

  return (
    <div className="flex flex-col p-6 min-h-svh min-w-full">
      <div className="flex space-x-6 overflow-x-auto pb-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          id="task"
        >
          <Column
            id="pending-column"
            title="Pending"
            tasks={pendingTasks}
            status={TaskStatus.Pending}
            onDropTask={handleDropInColumn}
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
            status={TaskStatus.Done}
            onDropTask={handleDropInColumn}
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

export default TaskKanban;
