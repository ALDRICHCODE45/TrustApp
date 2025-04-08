import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { Row } from "@tanstack/react-table";
import { Clipboard, Eye, MoreHorizontal } from "lucide-react";
import Link from "next/link";

interface Props {
  row: Row<User>;
}

export const UserListActions = ({ row }: Props) => {
  const teacherId = row.original.id;
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
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/profile/${teacherId}`} className="cursor-pointer">
            <Eye />
            Ver más
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
