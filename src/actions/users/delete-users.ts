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

  // Opcional: revalidar página o ruta si es estática
  revalidatePath("/list/users"); // o la ruta que estés usando
}
