import { z } from "zod";

export const createLeadSchema = z.object({
  empresa: z.string().min(1, "El nombre de la empresa es requerido"),
  sector: z.string().min(1, "El sector es requerido"),
  link: z.string().url("Debe ser un enlace válido"),
  origen: z.string().min(1, "El origen es requerido"),
  fechaProspeccion: z.date().optional(),
  fechaAConectar: z.date().optional(),

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

  generadorId: z.string().cuid(),
});
