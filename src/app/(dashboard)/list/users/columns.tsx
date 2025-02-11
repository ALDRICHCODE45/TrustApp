"use client";
import { Role, Status, User } from "@/lib/data";
import { ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import Image from "next/image";
import { MoreHorizontal, ArrowUpDown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import { RoleDropDown } from "./components/RoleDropdown";
import { StateDropdown } from "./components/UserStateDropdown";
import Link from "next/link";

const handleCopyTeacherId = (teacherId: string, teacherName: string) => {
  navigator.clipboard.writeText(teacherId);
  toast("Teacher Id has been copied", {
    description: `Teacher's of name ${teacherName} has been copied`,
  });
};

const myCustomFilterFn: FilterFn<User> = (
  row: Row<User>,
  _columnId: string,
  filterValue: string,
  _addMeta: (meta: any) => void
) => {
  filterValue = filterValue.toLowerCase();
  const filterParts = filterValue.split(" ");
  const rowValue =
    `${row.original.address} ${row.original.email} ${row.original.UserId} ${row.original.name} ${row.original.phone} ${row.original.id}`.toLowerCase();

  return filterParts.every((part) => rowValue.includes(part));
};

export const UserColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
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
    accessorKey: "info", // Nombre de la columna combinada
    header: "Info",
    cell: ({ row }) => {
      const name = row.original.name; // Acceder al nombre directamente desde el objeto original
      const email = row.original.email; // Acceder al email directamente desde el objeto original
      const photo = row.original.photo; // Acceder a la foto directamente desde el objeto original
      return (
        <div className="flex items-center gap-4">
          {/* Foto en un círculo */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={photo}
              alt={`${name}'s profile`}
              layout="fill"
              objectFit="cover"
            />
          </div>
          {/* Nombre y email uno debajo del otro */}
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <span className="text-sm text-gray-500">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email", // Columna oculta para filtrar
    header: "", // Encabezado vacío
    enableHiding: false, // Desactiva la opción de ocultar esta columna manualmente
    cell: () => null, // No renderiza nada en las celdas
    filterFn: myCustomFilterFn,
  },
  {
    accessorKey: "phone",
    header: "Celular",
  },
  {
    accessorKey: "rol",
    header: "Role",
    cell: ({ row }) => {
      const actualRole = row.original.rol;
      const [rol, setRole] = useState(actualRole);

      const handleChangeRole = (newRole: Role) => {
        setRole(newRole);
      };
      return <RoleDropDown onRoleChange={handleChangeRole} role={rol} />;
    },
  },
  {
    accessorKey: "status",
    header: "Estado",

    cell: ({ row }) => {
      const actualState = row.original.status;
      const [status, setStatus] = useState(actualState);

      const handleChangeState = (newState: Status) => {
        setStatus(newState);
      };
      return <StateDropdown onStateChange={handleChangeState} state={status} />;
    },
  },
  {
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => {
      const address = row.original.address;
      return (
        <div className="flex gap-2 items-center">
          <MapPin size={17} />
          <span>{address}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const teacherId = row.original.id.toString();
      const teacherName = row.original.name;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleCopyTeacherId(teacherId, teacherName)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/profile/${teacherId}`}>Ver mas</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
