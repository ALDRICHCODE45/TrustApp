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

export const clientesColumns: ColumnDef<Cliente>[] = [
  {
    accessorKey: "origen",
    header: "Origen",
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
  },
  {
    accessorKey: "asignadas",
    header: "Asignadas",
  },
  {
    accessorKey: "perdidas",
    header: "Perdidas",
  },
  {
    accessorKey: "canceladas",
    header: "Canceladas",
  },
  {
    accessorKey: "placements",
    header: "Placements",
  },
  {
    accessorKey: "tp_placement",
    header: "TP Placement",
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
  },
  {
    accessorKey: "dias_credito",
    header: "Dias credito",
  },
  {
    accessorKey: "tipo_factura",
    header: "Tipo Factura",
  },
  {
    accessorKey: "razon_social",
    header: "RS",
  },
  {
    accessorKey: "regimen",
    header: "Regimen",
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
];

function ContactosSheet({ contactos }: { contactos: Cliente["contactos"] }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Contactos</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Lista de Contactos</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {contactos.map((contacto, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{contacto.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📌 {contacto.puesto}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📧 {contacto.correo}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  📞 {contacto.celular}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ComentariosSheet({
  comentarios,
}: {
  comentarios: Cliente["comentarios"];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Comentarios</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Comentarios del Cliente</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {comentarios.map((comentario, index) => (
            <Card key={index}>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {comentario}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
