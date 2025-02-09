"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Parent } from "@/lib/data";
import { Phone, MapPin, UsersIcon } from "lucide-react";
import { ColumnDef, FilterFn, Row } from "@tanstack/react-table";

const myCustomFilterFn: FilterFn<Parent> = (
  row: Row<Parent>,
  _columnId: string,
  filterValue: string,
  _addMeta: (meta: any) => void
) => {
  filterValue = filterValue.toLowerCase();
  const filterParts = filterValue.split(" ");
  const rowValue =
    `${row.original.address} ${row.original.email} ${row.original.phone} ${row.original.name}`.toLowerCase();

  return filterParts.every((part) => rowValue.includes(part));
};

export const parentsColumns: ColumnDef<Parent>[] = [
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
    id: "Info",
    header: "Info",
    cell: ({ row }) => {
      const parentName = row.original.name;
      const parentEmail = row.original.email;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{parentName}</span>
          <span className="text-sm text-gray-500">{parentEmail}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "",
    enableHiding: true,
    cell: () => null,
    filterFn: myCustomFilterFn,
  },
  {
    accessorKey: "students",
    header: "Students",
    cell: ({ row }) => {
      const students = row.original.students.join(", ");
      return (
        <div className="flex items-center gap-2">
          <UsersIcon size={17} className="hidden md:block" />
          {students}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    filterFn: myCustomFilterFn,
    cell: ({ row }) => {
      const address = row.getValue("address") as string;
      return (
        <div className="flex items-center gap-2">
          <MapPin size={17} className="hidden md:block" />
          {address}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return (
        <div className="flex items-center gap-2 ">
          <Phone size={17} className="hidden md:block" />
          {phone}
        </div>
      );
    },
  },
];
