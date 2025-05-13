"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type ContactInteractionWithRelations =
  Prisma.ContactInteractionGetPayload<{
    include: {
      autor: true;
      contacto: true;
    };
  }>;

export const createInteraction = async (formData: FormData) => {
  const content = formData.get("content") as string;
  const contactoId = formData.get("contactoId") as string;
  const attachment = formData.get("attachment");
  const session = await auth();

  if (!session) {
    throw new Error("No se pudo crear la interaction");
  }

  try {
    const interaction = await prisma.contactInteraction.create({
      data: {
        content: content,
        contactoId: contactoId,
        autorId: session.user.id,
      },
    });
    revalidatePath("/list/leads");
    revalidatePath("/leads");
  } catch (err) {
    throw new Error("No se puede crear la interaccion");
  }
};

export const getAllContactInteractionsByContactId = async (
  contactId: string,
): Promise<ContactInteractionWithRelations[]> => {
  try {
    const result = await prisma.contactInteraction.findMany({
      where: {
        contactoId: contactId,
      },
      include: {
        contacto: true,
        autor: true,
      },
    });

    return result;
  } catch (err) {
    throw new Error("Error al obtener las interacciones");
  }
};
