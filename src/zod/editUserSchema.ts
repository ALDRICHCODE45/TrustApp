import { z } from "zod";
import { Role, Oficina, UserState } from "@prisma/client";

export const editUserSchema = z.object({
  age: z.number().optional(),
  name: z.string().min(3, "El nombre es obligatorio").optional(),
  email: z.string().email("Correo inválido").optional(),
  password: z
    .string()
    .min(6, "Contraseña debe tener al menos 6 caracteres")
    .optional(),
  direccion: z.string().min(5, "La direccion es obligatoria").optional(),
  oficina: z.enum([Oficina.Oficina1, Oficina.Oficina2]).optional(),
  status: z
    .enum([UserState.ACTIVO, UserState.INACTIVO])
    .default("ACTIVO")
    .optional(),
  celular: z.string().min(6, "El celular es requerido").optional(),
  role: z.enum(["reclutador", "GL", "Admin", "MK"]).optional(),
  image: z.string().optional(),
  ingreso: z.coerce
    .date({
      invalid_type_error: "Debe ser una fecha válida",
    })
    .optional(),
});
