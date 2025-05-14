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

export const deleteInteractionById = async (interactionId: string) => {
  try {
    if (!interactionId || interactionId.length < 3) {
      throw new Error("El id de la interaccion es necesario");
    }

    await prisma.contactInteraction.delete({
      where: {
        id: interactionId,
      },
    });
    return { ok: true };
  } catch (err) {
    throw new Error("Error al eliminar la interaccion");
  }
};

export const editInteractionById = async (
  interactionId: string,
  formData: FormData,
) => {
  // 1. Validación y limpieza de datos
  const content = formData.get("content")?.toString().trim();

  if (!content || content.length === 0) {
    throw new Error("El contenido no puede estar vacío");
  }

  try {
    // 3. Verificar existencia y actualizar en una sola operación
    const updatedInteraction = await prisma.contactInteraction.update({
      where: {
        id: interactionId,
      },
      data: {
        content,
        updatedAt: new Date(), // Buena práctica actualizar timestamp
      },
      include: {
        contacto: true,
        autor: true,
      },
    });

    return updatedInteraction;
  } catch (err) {
    console.error("Error editing interaction:", err);
    // 4. Manejo de errores más específico
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        throw new Error("Interacción no encontrada");
      }
      throw new Error("Error de base de datos");
    }
    throw new Error("Error al actualizar la interacción");
  }
};

export const createInteraction = async (
  formData: FormData,
): Promise<ContactInteractionWithRelations> => {
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
      include: {
        autor: true,
        contacto: true,
      },
    });
    revalidatePath("/list/leads");
    revalidatePath("/leads");
    return interaction;
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
