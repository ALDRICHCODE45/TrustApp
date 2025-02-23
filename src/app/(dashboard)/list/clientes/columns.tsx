"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cliente } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { RazonSocialPopOver } from "./components/RazonSocialPopOver";
import { ContactosSheet } from "./components/ContactosSheet";
import {
  ArrowRightToLine,
  Ban,
  Eye,
  MessageCircleMore,
  MoreHorizontal,
  Trash,
  UserPlus,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const clientesColumns: ColumnDef<Cliente>[] = [
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
    accessorKey: "origen",
    header: "Origen",
    cell: ({ row }) => {
      const origenCompleto = row.original.origen;
      const firstWord = origenCompleto.split(" ").at(0);
      return <span>{firstWord}</span>;
    },
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "cuenta",
    header: "Cuenta",
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => {
      const cliente_completo = row.original.cliente;
      const firstWord = cliente_completo.split(" ").at(0);
      return <span>{firstWord}</span>;
    },
  },
  {
    accessorKey: "asignadas",
    header: "Asignadas",
    cell: ({ row }) => {
      const asignadas = row.original.asignadas;
      return (
        <div className="flex gap-1 items-center">
          <ArrowRightToLine size={15} />
          <span>{asignadas}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "perdidas",
    header: "Perdidas",
    cell: ({ row }) => {
      const perdidas = row.original.perdidas;
      return (
        <div className="flex gap-1 items-center">
          <Trash size={14} className="text-red-500" />
          <span>{perdidas}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "canceladas",
    header: "Canceladas",
    cell: ({ row }) => {
      const canceladas = row.original.canceladas;
      return (
        <div className="flex gap-1 items-center">
          <Ban size={14} className="text-red-500" />
          <span>{canceladas}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "placements",
    header: "Placements",
    cell: ({ row }) => {
      const placements = row.original.placements;
      return (
        <div className="flex gap-1 items-center">
          <UserPlus size={16} className="text-green-500" />
          <span>{placements}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "tp_placement",
    header: "T.P",
    cell: ({ row }) => {
      const tp = row.original.tp_placement;
      return (
        <div className="flex gap-1 items-center">
          $<span>{tp}</span>
        </div>
      );
    },
  },
  {
    id: "contactos",
    header: "Contactos",
    cell: ({ row }) => <ContactosSheet contactos={row.original.contactos} />,
  },
  {
    accessorKey: "modalidad",
    header: "Modalidad",
  },
  {
    accessorKey: "fee",
    header: "Fee",
    cell: ({ row }) => {
      const fee = row.original.fee;
      return (
        <div className="flex items-center gap-1">
          <span>{fee}</span>%
        </div>
      );
    },
  },
  {
    accessorKey: "dias_credito",
    header: "Credito",
    cell: ({ row }) => {
      const credito = row.original.dias_credito;
      return (
        <div className="flex gap-2 items-center">
          <span>{credito}</span>
          dias
        </div>
      );
    },
  },
  {
    accessorKey: "tipo_factura",
    header: "Factura",
  },
  {
    accessorKey: "razon_social",
    header: "RS",
    cell: ({ row }) => {
      const razon_social = row.original.razon_social;
      const firstWord = razon_social.split(" ").at(0);
      return <span>{firstWord}</span>;
    },
  },
  {
    accessorKey: "regimen",
    header: "Regimen",
    cell: ({ row }) => {
      const regimen = row.original.regimen;
      return <RazonSocialPopOver razon_social={regimen} />;
    },
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
  {
    accessorKey: "rfc",
    header: "RFC",
  },
  {
    accessorKey: "cp",
    header: "CP",
  },
  {
    accessorKey: "como_factura",
    header: "CF",
  },
  {
    id: "comentarios",
    header: "Comentarios",
    cell: ({ row }) => (
      <ComentariosSheet comentarios={row.original.comentarios} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clienteId = row.original.id.toString();
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
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/cliente/${clienteId}`} className="cursor-pointer">
                <Eye />
                Ver mas
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function ComentariosSheet({
  comentarios,
}: {
  comentarios: Cliente["comentarios"];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <MessageCircleMore />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comentarios del Cliente</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4 p-2">
          {comentarios.map((comentario, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="fljx justify-between items-center">
                  <div className="text-lg">Salvador Perea</div>
                  <div className="text-sm text-gray-400">23-03-28</div>
                </CardTitle>
              </CardHeader>
              <CardContent>{comentario}</CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
