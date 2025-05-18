"use server";
import prisma from "@/lib/db"; // tu instancia de Prisma
import { UserState } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function desactivateUsers(ids: string[]) {
  if (!ids || ids.length === 0) return;

  await prisma.user.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      State: UserState.INACTIVO,
    },
  });

  revalidatePath("/list/users");
}

//funcion para eliminar permanentemente ususarios y sus relaciones
export const removeUsers = async (ids: string[]) => {
  if (!ids || ids.length === 0) return;

  await prisma.user.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  revalidatePath("/list/users"); // o la ruta que estés usando
};
