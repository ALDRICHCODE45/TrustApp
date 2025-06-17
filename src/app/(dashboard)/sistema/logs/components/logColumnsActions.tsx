"use client";
import { Copy, Loader2, MoreHorizontal, Trash } from "lucide-react";
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
import { deleteLog } from "@/actions/logs/actions";
import { useState } from "react";

export const LogsColumnsActions = ({ row }: { row: Row<LogWithRelations> }) => {
  const log = row.original;
  const [isDeleting, setisDeleting] = useState<boolean>(false);

  const handleCopyLogId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Acción completada", {
      description: "Id Copiado con exito",
    });
  };

  const handleDeleteLog = async (logId: string) => {
    if (isDeleting) return;
    try {
      setisDeleting(true);
      const { ok } = await deleteLog(logId);
      if (!ok) {
        toast.error("Error al eliminar el Log");
        return;
      }
      toast.success("Log Eliminado satisfactoriamente");
    } catch (err) {
      toast.error("Error al eliminar el Log");
    } finally {
      setisDeleting(false);
    }
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => handleCopyLogId(log.id)}
          >
            <Copy />
            Copiar Id
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              handleDeleteLog(log.id);
            }}
          >
            {isDeleting ? <Loader2 className="animate-spin" /> : <Trash />}
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
