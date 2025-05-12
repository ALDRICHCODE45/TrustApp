import { z } from "zod";
import { LeadStatus } from "@prisma/client";

export const createLeadSchema = z.object({
  empresa: z.string().min(1, "El nombre de la empresa es requerido"),
  sector: z.string().min(1, "El sector es requerido"),
  link: z.string().url("Debe ser un enlace válido"),
  origen: z.string().min(1, "El origen es requerido"),
  status: z
    .enum([
      LeadStatus.Contacto,
      LeadStatus.SocialSelling,
      LeadStatus.ContactoCalido,
      LeadStatus.Prospecto,
      LeadStatus.CitaAgendada,
      LeadStatus.CitaValidada,
      LeadStatus.Asignadas,
      LeadStatus.StandBy,
    ])
    .optional(),

  generadorId: z.string().cuid(),
});
