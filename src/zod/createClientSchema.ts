import { z } from "zod";

export const createClientSchema = z.object({
  // Campos obligatorios
  usuarioId: z.string().min(1, "Usuario es requerido"),
  origenId: z.string().min(1, "Origen es requerido"),
  cuenta: z.string().min(1, "Nombre de la cuenta es requerido"),

  // Campos opcionales - alineados con el schema de Prisma
  leadId: z.string().optional(),
  etiqueta: z.enum(["PreCliente", "Cliente"]).default("PreCliente").optional(),
  asignadas: z.number().min(0, "Debe ser un número positivo").optional(),
  perdidas: z.number().min(0, "Debe ser un número positivo").optional(),
  canceladas: z.number().min(0, "Debe ser un número positivo").optional(),
  placements: z.number().min(0, "Debe ser un número positivo").optional(),
  tp_placement: z.number().min(0, "Debe ser un número positivo").optional(),
  modalidad: z.enum(["Exito", "Anticipo"]).optional(),
  fee: z.number().min(0, "Fee debe ser positivo").optional(),
  dias_credito: z
    .number()
    .min(0, "Días de crédito debe ser positivo")
    .optional(),
  tipo_factura: z.string().optional(),
  razon_social: z.string().optional(),
  regimen: z.string().optional(),
  rfc: z.string().optional(),
  codigo_postal: z.string().optional(),
  como_factura: z.string().optional(),
  portal_site: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
});

export type CreateClientFormData = z.infer<typeof createClientSchema>;
