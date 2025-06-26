import { z } from "zod";
import { LeadStatus } from "@prisma/client";

export const editLeadZodSchema = z.object({
  empresa: z
    .string()
    .min(1, "El nombre de la empresa es requerido")
    .nullable()
    .optional(),
  sector: z.string().min(1, "El sector es requerido").nullable().optional(),
  link: z.string().url("Debe ser un enlace válido").nullable().optional(),
  origen: z.string().min(1, "El origen es requerido").nullable().optional(),

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

  generadorId: z.string().cuid().nullable().optional(),
  numero_empleados: z.string().nullable().optional(),
  ubicacion: z.string().nullable().optional(),
  subSectorId: z.string().nullable().optional(),
});
