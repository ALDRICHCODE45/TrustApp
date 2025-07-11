import { z } from "zod";

export const editClientSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  usuarioId: z.string().min(1, "Usuario es requerido"),
  etiqueta: z.enum(["PreCliente", "Cliente", "Inactivo"]).default("PreCliente"),
  cuenta: z.string().optional(),
  asignadas: z.number().min(0, "Debe ser un número positivo").optional(),
  perdidas: z.number().min(0, "Debe ser un número positivo").optional(),
  canceladas: z.number().min(0, "Debe ser un número positivo").optional(),
  placements: z.number().min(0, "Debe ser un número positivo").optional(),
  tp_placement: z.number().min(0, "Debe ser un número positivo").optional(),
  modalidad: z.enum(["Exito", "Anticipo"]).optional(),
  fee: z
    .number()
    .min(0, "Fee debe ser positivo")
    .max(100, "Fee no puede ser mayor a 100%")
    .optional(),
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
  origenId: z.string().optional(),
});

export type EditClientFormData = z.infer<typeof editClientSchema>;
