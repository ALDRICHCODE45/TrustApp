"use client";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Row } from "@tanstack/react-table";
import { LogWithRelations } from "./logsColumns";
import { toast } from "sonner";

export const LogsColumnsActions = ({ row }: { row: Row<LogWithRelations> }) => {
  const log = row.original;

  const handleCopyLogId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Acción completada", {
      description: "Id Copiado con exito",
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Actions</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleCopyLogId(log.id)}
          >
            Copiar Id
          </DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
