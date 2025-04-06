"use client";
import { ColumnDef, FilterFn, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { RoleDropDown } from "./components/RoleDropdown";
import { StateDropdown } from "./components/UserStateDropdown";
import { AddressPopover } from "./components/AddressPopOver";
import { UserInfoCell } from "./components/UserInfoCell";
import { UserListActions } from "./components/UserListActions";
import { OficinaDropDown } from "./components/OficinaDropDown";
import { User } from "@prisma/client";

const myCustomFilterFn: FilterFn<User> = (
  row: Row<any>,
  _columnId: string,
  filterValue: string,
  _addMeta: (meta: any) => void,
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
    enableGlobalFilter: true,
  },

  // {
  //id: "password",
  //header: "Contraseñas",
  //cell: ({ row }) => {
  // return <UserPasswordCell row={row} />;
  //},
  //},

  {
    accessorKey: "oficina",
    id: "oficina",
    header: "Oficina",
    cell: ({ row }) => {
      return <OficinaDropDown row={row} />;
    },
    enableGlobalFilter: true,
    filterFn: (row, _id, filterValue) => {
      return row.original.Oficina === filterValue;
    },
  },
  {
    accessorKey: "email",
    header: "",
    enableHiding: false,
    cell: () => null,
    enableGlobalFilter: true,
  },
  {
    id: "phone",
    accessorKey: "celular",
    enableGlobalFilter: true,
    header: "Celular",
  },
  {
    id: "role",
    accessorKey: "rol",
    header: "Role",
    cell: ({ row }) => {
      return <RoleDropDown row={row} />;
    },
    enableGlobalFilter: true,
    filterFn: (row, _id, filterValue) => {
      return row.original.role === filterValue;
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Estado",

    cell: ({ row }) => {
      return <StateDropdown row={row} />;
    },
    enableGlobalFilter: true,
    filterFn: (row, _id, filterValue) => {
      return row.original.State === filterValue;
    },
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Dirección",
    cell: ({ row }) => {
      return <AddressPopover row={row} />;
    },
    enableGlobalFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <UserListActions row={row} />,
  },
];
