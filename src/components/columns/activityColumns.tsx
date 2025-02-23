"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Activity } from "../ActivityList";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import {
  Calendar,
  Clipboard,
  MoreHorizontal,
  NotepadText,
  SquarePen,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

const handleCopyTeacherId = (leadId: string, leadName: string) => {
  navigator.clipboard.writeText(leadId);
  toast("Lead Id has been copied", {
    description: `Lead of name ${leadName} has been copied`,
  });
};

export const activityColumns: ColumnDef<Activity>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select All"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "dueDate",
    header: "Fecha limite",
    cell: ({ row }) => {
      const fecha = row.getValue("dueDate") as string;
      return (
        <div className="flex gap-2 items-center">
          <Calendar size={16} />
          <span className="text-sm">{fecha}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Descripcion",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      const shortDescription =
        description.split(" ").slice(0, 5).join(" ") +
        (description.split(" ").length > 5 ? "..." : "");
      return (
        <div className="flex items-center gap-2">
          <NotepadText size={16} />
          <span className="text-sm">{shortDescription}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "completed",
    header: "Completada",
    cell: ({ row }) => {
      const isCompleted = row.getValue("completed") as boolean;
      return (
        <Badge variant={isCompleted ? "outline" : "destructive"}>
          {isCompleted ? "Sí" : "No"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const teacherId = row.original.title;
      const teacherName = row.original.description;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleCopyTeacherId(teacherId, teacherName)}
            >
              <Clipboard />
              Copiar Id
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SquarePen />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
