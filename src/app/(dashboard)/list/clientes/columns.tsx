"use client";
import { Cliente } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { RazonSocialPopOver } from "./components/RazonSocialPopOver";
import { ContactosSheet } from "./components/ContactosSheet";
import { ArrowRightToLine } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ComentariosSheet } from "../../cliente/[id]/components/ComentariosSheet";
import { FacturacionSheet } from "./components/Facturacion_instrucciones";
import { ClientesActions } from "./components/ClientesActions";
import { UserClientDropDown } from "./components/UserClientDropDown";

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
    accessorKey: "usuario",
    header: "Usuario",
    cell: ({ row }) => {
      return <UserClientDropDown row={row} />;
    },
  },
  {
    accessorKey: "cuenta",
    header: "Cuenta",
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
      return <span className="font-bold">{perdidas}</span>;
    },
  },
  {
    accessorKey: "canceladas",
    header: "Canceladas",
    cell: ({ row }) => {
      const canceladas = row.original.canceladas;
      return <span className="font-bold">{canceladas}</span>;
    },
  },
  {
    accessorKey: "placements",
    header: "Placements",
    cell: ({ row }) => {
      const placements = row.original.placements;
      return <span className="font-bold">{placements}</span>;
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
    cell: () => {
      return <FacturacionSheet />;
    },
  },
  {
    id: "comentarios",
    header: "Comentarios",
    cell: ({ row }) => <ComentariosSheet comments={row.original.comentarios} />,
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return <ClientesActions row={row} />;
    },
  },
];
