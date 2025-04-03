import { z } from "zod";

export const editUserSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio").optional(),
  email: z.string().email("Correo inválido").optional(),
  password: z
    .string()
    .min(6, "Contraseña debe tener al menos 6 caracteres")
    .optional(),
  direccion: z.string().min(5, "La direccion es obligatoria").optional(),
  oficina: z.enum(["Oficina1", "Oficina2"]).default("Oficina1").optional(),
  status: z.enum(["ACTIVO", "INACTIVO"]).default("ACTIVO").optional(),
  celular: z.string().min(6, "El celular es requerido").optional(),
  role: z.enum(["reclutador", "GL", "Admin", "MK"]).optional(),
  image: z.string().optional(),
});
