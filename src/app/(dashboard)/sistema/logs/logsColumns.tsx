"use client";
import { Badge } from "@/components/ui/badge";
import { Log } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { UserCog, File, Fingerprint, Clock, Calendar } from "lucide-react";

export const logsColumns: ColumnDef<Log>[] = [
  {
    accessorKey: "userId",
    header: "User Id",
    cell: ({ row }) => {
      const userId = row.original.userId as number;
      return (
        <div className="flex flex-row gap-2 items-center">
          <Fingerprint size={18} />
          <span>{userId}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "username",
    header: "Nombre del Usuario",
    cell: ({ row }) => {
      const username = row.original.username as string;
      return (
        <div className="flex flex-row gap-2 items-center">
          <UserCog size={18} />
          <span>{username}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Accion Realizada",
    cell: ({ row }) => {
      const action = row.original.action;
      return (
        <Badge variant="outline" className="gap-1.5">
          <span
            className="size-1.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          ></span>
          {action}
        </Badge>
      );
    },
  },
  {
    accessorKey: "fileName",
    header: "Archivo",
    cell: ({ row }) => {
      const fileName = row.original.fileName;
      return (
        <div className="flex gap-2 items-center">
          <File size={18} />
          <span>{fileName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
    cell: ({ row }) => {
      const fecha = row.original.fecha;
      return (
        <div className="flex gap-2 items-center">
          <Calendar size={18} />
          <span>{fecha}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "hora",
    header: "Hora",
    cell: ({ row }) => {
      const hora = row.original.hora;
      return (
        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span>{hora}</span>
        </div>
      );
    },
  },
];
