import { z } from "zod";

export const createLeadPersonSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  position: z.string().min(3, "La posición debe tener al menos 3 caracteres"),
  leadId: z.string(),
  linkedin: z.string().optional().or(z.literal("")),
});

export const editLeadPersonSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .optional(),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  position: z
    .string()
    .min(3, "La posición debe tener al menos 3 caracteres")
    .optional(),
  leadId: z.string().optional(),
  phone: z.string().optional().or(z.literal("")),
  linkedin: z.string().optional().or(z.literal("")),
});
