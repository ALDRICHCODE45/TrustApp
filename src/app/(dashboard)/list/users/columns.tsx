"use client";
import { User } from "@/lib/data";
import { ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleDropDown } from "./components/RoleDropdown";
import { StateDropdown } from "./components/UserStateDropdown";
import { AddressPopover } from "./components/AddressPopOver";
import { UserPasswordCell } from "./components/UserPasswordCell";
import { UserInfoCell } from "./components/UserInfoCell";
import { UserListActions } from "./components/UserListActions";
import { OficinaDropDown } from "./components/OficinaDropDown";

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
    id: "info",
    accessorKey: "info",
    header: "Info",
    cell: ({ row }) => <UserInfoCell row={row} />,
  },

  {
    id: "password",
    header: "Contraseñas",
    cell: ({ row }) => {
      return <UserPasswordCell row={row} />;
    },
  },

  {
    accessorKey: "oficina",
    id: "oficina",
    header: "Oficina",
    cell: ({ row }) => {
      return <OficinaDropDown row={row} />;
    },
  },
  {
    accessorKey: "email",
    header: "",
    enableHiding: false,
    cell: () => null,
    filterFn: myCustomFilterFn,
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Celular",
  },
  {
    id: "rol",
    accessorKey: "rol",
    header: "Role",
    cell: ({ row }) => {
      return <RoleDropDown row={row} />;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Estado",

    cell: ({ row }) => {
      return <StateDropdown row={row} />;
    },
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => {
      return <AddressPopover row={row} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserListActions row={row} />,
  },
];
