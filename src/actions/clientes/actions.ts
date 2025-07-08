"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const deleteClientByid = async (id: string) => {
  try {
    await prisma.client.delete({
      where: { id },
    });
    revalidatePath("/list/clientes");
    revalidatePath(`/cliente/${id}`);
  } catch (error) {
    throw new Error("Error al eliminar el cliente");
  }
};
