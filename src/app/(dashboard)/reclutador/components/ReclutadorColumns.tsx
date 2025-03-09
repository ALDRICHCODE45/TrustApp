"use client";
import { Vacante } from "@/lib/data";
import { ColumnDef } from "@tanstack/react-table";
import { FinalTernaSheet } from "../../list/reclutamiento/components/FinalTernaSheet";
import { CommentSheet } from "../../list/reclutamiento/components/CommentSheet";
import { Button } from "@/components/ui/button";
import { BookCheck } from "lucide-react";

export const reclutadorColumns: ColumnDef<Vacante>[] = [
  {
    accessorKey: "año",
    header: "Año",
  },
  {
    accessorKey: "estado",
    header: "Estado",
  },
  {
    accessorKey: "puesto",
    header: "Puesto",
  },
  {
    accessorKey: "tiempoTranscurrido",
    header: "Tiempo",
    cell: ({ row }) => {
      const tiempo = row.original.tiempoTranscurrido;
      return <span>{tiempo} dias</span>;
    },
  },
  {
    accessorKey: "mesAsignado",
    header: "Mes asignación",
  },
  {
    accessorKey: "prioridad",
    header: "Prioridad",
  },
  {
    accessorKey: "fechaEntrega",
    header: "Placement",
  },
  {
    accessorKey: "comentarios",
    header: "Comentarios",
    cell: ({ row }) => <CommentSheet comments={row.original.comentarios} />,
  },
  {
    accessorKey: "salario",
    header: "Salario",
    cell: ({ row }) => {
      const salario = row.original.salario;
      return (
        <>
          <span>${salario}</span>
        </>
      );
    },
  },
  {
    accessorKey: "checklist",
    header: "Checklist",
    cell: ({ row }) => (
      <a
        href={row.original.checklist}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="outline">
          <BookCheck />
        </Button>
      </a>
    ),
  },
  {
    accessorKey: "ternaFinal",
    header: "Terna Final",
    cell: ({ row }) => <FinalTernaSheet ternaFinal={row.original.ternaFinal} />,
  },
];
