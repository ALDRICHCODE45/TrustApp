"use client";
import { ColumnDef } from "@tanstack/react-table";
import { RazonSocialPopOver } from "./components/RazonSocialPopOver";
import { ContactosSheet } from "./components/ContactosSheet";
import {
  ArrowDownToLine,
  ArrowRightToLine,
  CircleCheck,
  CircleOff,
  HandCoins,
  Link as LinkIcon,
  ThumbsUp,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ComentariosSheet } from "../../cliente/[id]/components/ComentariosSheet";
import { FacturacionSheet } from "./components/Facturacion_instrucciones";
import { ClientesActions } from "./components/ClientesActions";
import { UserClientDropDown } from "./components/UserClientDropDown";
import { Client, ClienteModalidad, Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

export type ClientWithRelations = Prisma.ClientGetPayload<{
  include: {
    lead: {
      include: {
        origen: true;
      };
    };
    contactos: true;
    usuario: true;
  };
}>;

export const clientesColumns: ColumnDef<ClientWithRelations>[] = [
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
    id: "origen",
    header: "Origen",
    cell: ({ row }) => {
      const origenCompleto = row.original.lead?.origen?.nombre ?? "N/A";
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
    cell: ({ row }) => {
      const cuenta = row.original.cuenta;
      return (
        <Button variant="outline">
          <p className="text-foreground">{cuenta}</p>
        </Button>
      );
    },
  },
  {
    accessorKey: "asignadas",
    header: "Asignadas",
    cell: ({ row }) => {
      const asignadas = row.original.asignadas;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" className="flex gap-1 items-center">
              <ArrowRightToLine size={15} className="text-gray-500" />
              <span>
                {asignadas ?? <span className="text-red-500">N/A</span>}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vacantes asignadas</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "perdidas",
    header: "Perdidas",
    cell: ({ row }) => {
      const perdidas = row.original.perdidas;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <p className="text-foreground flex gap-1 items-center">
                <ArrowDownToLine size={15} className="text-gray-500" />
                {perdidas ?? <span className="text-red-500">N/A</span>}
              </p>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vacantes perdidas</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "canceladas",
    header: "Canceladas",
    cell: ({ row }) => {
      const canceladas = row.original.canceladas;

      return (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">
                <p className="text-foreground flex gap-1 items-center">
                  <CircleOff size={15} className="text-gray-500" />
                  {canceladas ?? <span className="text-red-500">N/A</span>}
                </p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Vacantes canceladas</p>
            </TooltipContent>
          </Tooltip>
        </>
      );
    },
  },
  {
    accessorKey: "placements",
    header: "Placements",
    cell: ({ row }) => {
      const placements = row.original.placements;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <p className="text-foreground flex gap-1 items-center">
                <CircleCheck size={15} className="text-gray-500" />
                {placements ?? <span className="text-red-500">N/A</span>}
              </p>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Vacantes reclutadas</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "tp_placement",
    header: "T.P",
    cell: ({ row }) => {
      const tp = row.original.tp_placement ?? 0;
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
    cell: ({ row }) => {
      const modalidad = row.original.modalidad as ClienteModalidad;
      const modalidadIcon = {
        Exito: <ThumbsUp size={15} className="text-gray-500" />,
        Anticipo: <HandCoins size={15} className="text-gray-500" />,
      };

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <div className="flex gap-2 items-center">
                {modalidadIcon[modalidad]}
                <span>{modalidad ?? "N/A"}</span>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Modalidad de pago</p>
          </TooltipContent>
        </Tooltip>
      );
    },
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
          <span>{credito ?? "N/A"}</span>
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
      const razon_social = row.original.razon_social ?? "N/A";
      const firstWord = razon_social?.split(" ").at(0);
      return <span>{firstWord}</span>;
    },
  },
  {
    accessorKey: "regimen",
    header: "Regimen",
    cell: ({ row }) => {
      const regimen = row.original?.regimen ?? "N/A";
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
    //TODO: Agregar comentarios
    cell: ({ row }) => <ComentariosSheet comments={[]} />,
  },
  {
    accessorKey: "portal_site",
    header: "Portal",
    //TODO: Agregar comentarios
    cell: ({ row }) => {
      const portal_site = row.original.portal_site;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <p className="text-foreground flex gap-1 items-center">
                {portal_site ? (
                  <Link href={portal_site} target="_blank">
                    <LinkIcon size={15} className="text-gray-500" />
                    <span className="text-foreground">{portal_site}</span>
                  </Link>
                ) : (
                  <span className="text-red-500">N/A</span>
                )}
              </p>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Portal del cliente</p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "actions",
    header: "Acciones",
    cell: ({ row }) => {
      return <ClientesActions row={row} />;
    },
  },
];
