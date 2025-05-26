import { z } from "zod";
import { LeadStatus } from "@prisma/client";

export const createLeadSchema = z.object({
  empresa: z.string().min(1, "El nombre de la empresa es requerido"),
  sector: z.string().min(1, "El sector es requerido"),
  link: z.string().min(1, "El link debe tener por lo menos 1 character"),
  origen: z.string().min(1, "El origen es requerido"),
  status: z
    .enum([
      LeadStatus.Contacto,
      LeadStatus.SocialSelling,
      LeadStatus.ContactoCalido,
      LeadStatus.CitaAgendada,
      LeadStatus.CitaValidada,
      LeadStatus.Asignadas,
      LeadStatus.StandBy,
      LeadStatus.CitaAtendida,
    ])
    .optional(),

  generadorId: z.string().cuid(),
  createdAt: z.date().optional(),
});
