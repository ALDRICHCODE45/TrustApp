import { z } from "zod";

export const createUserSchema = z.object({
  age: z.number(),
  name: z.string().min(3, "El nombre es obligatorio"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "contraseña debe tener al menos 6 caracteres"),
  direccion: z.string().min(5, "La direccion es obligatoria"),
  oficina: z.enum(["Oficina1", "Oficina2"]).default("Oficina1"),
  status: z.enum(["ACTIVO", "INACTIVO"]).default("ACTIVO"),
  celular: z.string().min(6, "El celular es requerido"),
  role: z.enum(["reclutador", "GL", "Admin", "MK"]),
  image: z.string().optional(),
  ingreso: z.coerce.date({
    required_error: "La fecha de ingreso es obligatoria",
    invalid_type_error: "Debe ser una fecha válida",
  }),
});
