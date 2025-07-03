"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { ClientWithRelations } from "../columns";

export const UserClientDropDown = ({
  row,
}: {
  row: Row<ClientWithRelations>;
}) => {
  const router = useRouter();

  return (
    <Button variant="outline" className="flex gap-2">
      <User />
      <span className="truncate">{row.original.usuario.name}</span>
    </Button>
  );
};
