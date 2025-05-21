import { z } from "zod";

export const createLeadPersonSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio y de 2 letras min"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  position: z.string().min(3, "Posicion requerida"),
  leadId: z.string(),
});

export const editLeadPersonSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre es obligatorio y de 2 letras min")
    .optional(),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  position: z.string().min(3, "Posicion requerida").optional(),
  leadId: z.string().optional(),
  phone: z.string().optional().or(z.literal("")),
});