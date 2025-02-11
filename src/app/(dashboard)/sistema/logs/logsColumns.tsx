"use client";
import { Badge } from "@/components/ui/badge";
import { Log } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import {
  Dot,
  UserCog,
  File,
  Fingerprint,
  SlidersHorizontal,
} from "lucide-react";

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
        <div className="flex gap-2 items-center">
          <Badge variant="destructive">{action}</Badge>
        </div>
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
];
