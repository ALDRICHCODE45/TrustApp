import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { ClipboardCheck, Clock, CalendarClock } from "lucide-react";
import { TaskWithRelations } from "./taskKanban";

interface TaskCardProps {
  task: TaskWithRelations;
  isActive: boolean;
}

export const TaskCard = ({ task, isActive }: TaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task: task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  // Determine if the task is overdue
  const isOverdue =
    task.status === "Pending" && new Date(task.dueDate) < new Date();

  // Format the dates
  const formattedDueDate = format(new Date(task.dueDate), "MMM dd, yyyy");
  const formattedCreatedDate = format(new Date(task.createdAt), "MMM dd, yyyy");

  // Calculate days remaining or overdue
  const daysLeft = Math.ceil(
    (new Date(task.dueDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  // Determine badge color based on days left
  let badgeColor = "bg-green-100 text-green-800"; // Default: plenty of time
  if (daysLeft <= 0) {
    badgeColor = "bg-red-100 text-red-800"; // Overdue
  } else if (daysLeft <= 2) {
    badgeColor = "bg-amber-100 text-amber-800"; // Due soon
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-4 bg-white rounded-lg shadow 
        border-l-4 ${isOverdue ? "border-red-500" : task.status === "Done" ? "border-green-500" : "border-blue-500"}
        hover:shadow-md transition-shadow cursor-grab
        ${isActive ? "ring-2 ring-blue-500 ring-opacity-50" : ""}
        ${isDragging ? "shadow-lg" : ""}
      `}
    >
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-800 text-base line-clamp-2">
            {task.title}
          </h3>
          {task.status === "Done" && (
            <span className="ml-2 flex-shrink-0">
              <ClipboardCheck className="h-5 w-5 text-green-500" />
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>

        <div className="flex items-center pt-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {task.assignedTo.image ? (
              <img
                src={task.assignedTo.image}
                alt={task.assignedTo.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {task.assignedTo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            )}
          </div>
          <span className="ml-2 text-xs text-gray-600">
            {task.assignedTo.name}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs mt-2">
          <div
            className={`flex items-center ${badgeColor} px-2 py-1 rounded-full`}
          >
            <CalendarClock className="h-3 w-3 mr-1" />
            <span>
              {daysLeft > 0
                ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
                : `${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} overdue`}
            </span>
          </div>

          <div className="flex items-center bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            <span title={`Created on ${formattedCreatedDate}`}>
              Due {formattedDueDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
