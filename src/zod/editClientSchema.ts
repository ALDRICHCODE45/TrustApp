import { ClienteEtiqueta } from "@prisma/client";
import { z } from "zod";

export const editClientSchema = z.object({
  id: z.string(),
  usuarioId: z.string(),
  etiqueta: z
    .enum([ClienteEtiqueta.PreCliente, ClienteEtiqueta.Cliente])
    .optional(),
  cuenta: z.string().optional(),
  asignadas: z.number().optional(),
  perdidas: z.number().optional(),
  canceladas: z.number().optional(),
  placements: z.number().optional(),
  tp_placement: z.number().optional(),
  modalidad: z.enum(["Exito", "Anticipo"]).optional(),
  fee: z.number().optional(),
  dias_credito: z.number().optional(),
  tipo_factura: z.string().optional(),
  razon_social: z.string().optional(),
  regimen: z.string().optional(),
  rfc: z.string().optional(),
  codigo_postal: z.string().optional(),
  como_factura: z.string().optional(),
  portal_site: z.string().optional(),
  origenId: z.string().optional(),
});

export type EditClientFormData = z.infer<typeof editClientSchema>;
