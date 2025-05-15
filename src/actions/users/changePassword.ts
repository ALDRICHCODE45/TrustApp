"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { hash } from "bcryptjs";

export const changePasswordAction = async (
  userId: string,
  formData: FormData,
) => {
  const newPassword = formData.get("newPassword") as string;
  const session = await auth();
  if (!session) {
    return {
      ok: false,
      error: "No tienes session en el sistema",
    };
  }

  if (!newPassword || newPassword.length < 6) {
    return {
      ok: false,
      error: "La contraseña debe tener al menos 6 caracteres",
    };
  }

  // Verificar que el usuario actual es admin
  if (!session?.user || session.user.role !== "Admin") {
    return { ok: false, error: "No tienes permisos para realizar esta acción" };
  }

  // Hashear la nueva contraseña
  const hashedPassword = await hash(newPassword, 10);

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return { ok: true, message: "Contraseña actualizada correctamente" };
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    return { error: "Error al actualizar la contraseña" };
  }
};
