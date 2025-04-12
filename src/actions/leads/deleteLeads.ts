"use server";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { checkSession } from "@/hooks/auth/checkSession";

export const deleteMayLeads = async (ids: string[]) => {
  await checkSession();
  if (!ids || ids.length === 0) return;

  try {
    await prisma.lead.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  } catch (error) {
    throw new Error("erorr eliminando muchos leads");
  }

  revalidatePath("/list/leads"); // o la ruta que estés usando
  revalidatePath("/leads"); // o la ruta que estés usando
};
