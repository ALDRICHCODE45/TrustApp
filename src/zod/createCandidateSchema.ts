import { z } from "zod";

export const createCandidateSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").trim(),
  phone: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .email("Correo electrónico inválido")
    .optional()
    .or(z.literal("")),
  cvFile: z.any().optional(), // El archivo real del CV que se subirá
});

export type CreateCandidateFormData = z.infer<typeof createCandidateSchema>;
