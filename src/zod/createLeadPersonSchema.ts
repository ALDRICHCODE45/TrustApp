import { z } from "zod";

export const createLeadPersonSchema = z.object({
  name: z.string().min(2, "El nombre es obligatorio y de 2 letras min"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  position: z.string().min(3, "Posicion requerida"),
  leadId: z.string(),
});

export const editLeadPersonSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre es obligatorio y de 2 letras min")
    .optional(),
  email: z.string().email().optional(),
  position: z.string().min(3, "Posicion requerida").optional(),
  leadId: z.string().optional(),
  phone: z.string().min(5, "El numero del contacto obligatorio").optional(),
});
