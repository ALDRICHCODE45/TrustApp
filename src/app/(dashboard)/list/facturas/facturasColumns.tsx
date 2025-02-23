"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clientesData, Factura, vacantes } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { Clipboard, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";

export const facturasColumns: ColumnDef<Factura>[] = [
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
    accessorKey: "folio",
    header: "Folio",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
  {
    accessorKey: "fecha_emision",
    header: "Fecha Emision",
  },
  {
    accessorKey: "fecha_pago",
    header: "Fecha Pago",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
  {
    accessorKey: "complemento",
    header: "Complemento",
    cell: ({ row }) => {
      const complemento = row.original.complemento;
      return <>{complemento ? <span>SI</span> : <span>NO</span>}</>;
    },
  },
  {
    accessorKey: "anticipo",
    header: "Anticipo",
  },
  {
    accessorKey: "banco",
    header: "Banco",
  },
  {
    accessorKey: "clientId",
    header: "Datos Cliente",
    cell: ({ row }) => {
      const clientId = row.original.clientId;
      const client = clientesData.find((cliente) => cliente.id === clientId);

      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Cliente</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="font-semibold text-center">
                Información del Cliente
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground text-center">
                Detalles del cliente seleccionado.
              </DrawerDescription>
            </DrawerHeader>

            {/* Contenido principal del Drawer */}
            <div className="p-4">
              <Card className="w-full max-w-md mx-auto mb-[30px]">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    Cliente #{client?.clienteId}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Régimen Fiscal
                    </span>
                    <span className="text-sm font-semibold">
                      {client?.regimen}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      RFC
                    </span>
                    <span className="text-sm font-semibold">{client?.rfc}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Código Postal
                    </span>
                    <span className="text-sm font-semibold">{client?.cp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Tipo de Persona
                    </span>
                    <span className="text-sm font-semibold">
                      {client?.tipo}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DrawerContent>
        </Drawer>
      );
    },
  },

  {
    accessorKey: "vacanteId",
    header: "Datos Vacante",
    cell: ({ row }) => {
      const vacanteId = row.original.vacanteId;
      const vacante = vacantes.find((v) => v.id === vacanteId);
      return (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Vacante</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-lg font-semibold text-center">
                Información de la Vacante
              </DrawerTitle>
              <DrawerDescription className="text-sm text-muted-foreground text-center">
                Detalles de la vacante seleccionada.
              </DrawerDescription>
            </DrawerHeader>

            {/* Contenido principal del Drawer */}
            <div className="p-4">
              <Card className="w-full max-w-md mx-auto mb-[30px]">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    Vacante #{vacante?.id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Reclutador
                    </span>
                    <span className="text-sm font-semibold">
                      {vacante?.reclutador?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Contratado
                    </span>
                    <span className="text-sm font-semibold">
                      {vacante?.candidatoContratado?.nombre}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Salario
                    </span>
                    <span className="text-sm font-semibold">
                      ${vacante?.salario.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Fee (%)
                    </span>
                    <span className="text-sm font-semibold">
                      {vacante?.fee}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DrawerContent>
        </Drawer>
      );
    },
  },
  {
    id: "actions", // Nueva columna de acciones
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem>
              <Clipboard />
              Copiar Datos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SquarePen />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Trash2 />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
