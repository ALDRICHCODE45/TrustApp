import { z } from "zod";

export const editLeadZodSchema = z.object({
  empresa: z
    .string()
    .min(1, "El nombre de la empresa es requerido")
    .nullable()
    .optional(),
  sector: z.string().min(1, "El sector es requerido").nullable().optional(),
  link: z.string().url("Debe ser un enlace válido").nullable().optional(),
  origen: z.string().min(1, "El origen es requerido").nullable().optional(),
  fechaProspeccion: z.date().optional().nullable().optional(),
  fechaAConectar: z.date().optional().nullable().optional(),

  status: z
    .enum([
      "Contacto",
      "SocialSelling",
      "ContactoCalido",
      "Prospecto",
      "CitaAgendada",
      "CitaValidada",
      "Cliente",
      "Eliminado"
    ])
    .optional(),

  generadorId: z.string().cuid().nullable().optional(),
});
