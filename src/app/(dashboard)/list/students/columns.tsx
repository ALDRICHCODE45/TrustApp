"use client";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Students } from "@/lib/data";
import { ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const handleCopyStudentId = (studentId: string, studentName: string) => {
  navigator.clipboard.writeText(studentId);
  toast("Student Id has been copied", {
    description: `Student id of name ${studentName} has been copied`,
  });
};

const myCustomFilterFn: FilterFn<Students> = (
  row: Row<Students>,
  _columnId: string,
  filterValue: string,
  _addMeta: (meta: any) => void
) => {
  filterValue = filterValue.toLowerCase();
  const filterParts = filterValue.split(" ");
  const rowValue =
    `${row.original.address} ${row.original.email} ${row.original.studentId} ${row.original.name} ${row.original.phone} ${row.original.class}`.toLowerCase();

  return filterParts.every((part) => rowValue.includes(part));
};

export const StudentsColumns: ColumnDef<Students>[] = [
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
    accessorKey: "info", // Nombre de la columna combinada
    header: "Info",
    cell: ({ row }) => {
      const name = row.original.name; // Acceder al nombre directamente desde el objeto original
      const studentClass = row.original.class; // Acceder al email directamente desde el objeto original
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
            <span className="text-sm text-gray-500">{studentClass}</span>
          </div>
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
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
    enableHiding: true,
    filterFn: myCustomFilterFn,
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const studentId = row.original.studentId.toString();
      const studentName = row.original.name;
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
              onClick={() => handleCopyStudentId(studentId, studentName)}
            >
              Copy student ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Student</DropdownMenuItem>
            <DropdownMenuItem>View Student Schedule</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
