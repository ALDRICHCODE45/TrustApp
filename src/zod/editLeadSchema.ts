import { z } from "zod";

export const editLeadZodSchema = z.object({
  empresa: z.string().min(1, "El nombre de la empresa es requerido").optional(),
  sector: z.string().min(1, "El sector es requerido").optional(),
  link: z.string().url("Debe ser un enlace válido").optional(),
  origen: z.string().min(1, "El origen es requerido").optional(),
  fechaProspeccion: z.date().optional().optional(),
  fechaAConectar: z.date().optional().optional(),

  status: z
    .enum([
      "Contacto",
      "SocialSelling",
      "ContactoCalido",
      "Prospecto",
      "CitaAgendada",
      "CitaValidada",
      "Cliente",
    ])
    .optional(),

  generadorId: z.string().cuid().optional(),
});
