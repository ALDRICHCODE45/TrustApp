"use server";
import { Attachment } from "@/app/(dashboard)/leads/components/ContactCard";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { deleteFile } from "../files/actions";

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

    const fileToDelete = await prisma.contactInteraction.delete({
      where: {
        id: interactionId,
      },
      select: {
        attachmentUrl: true,
      },
    });
    console.log({ fileToDelete });
    //TODO: al eliminar la interaccion, se deben eliminar tambien los archivos de digital ocean
    if (fileToDelete.attachmentUrl) {
      const fileKey = fileToDelete.attachmentUrl.split("/").pop();
      if (!fileKey) {
        throw new Error(
          "Error al obtener el fileKey en deleteInteraccionById action",
        );
      }
      const fileDeleted = await deleteFile(fileKey, interactionId);
    }

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
  const rawAttachment = formData.get("attachment");

  const session = await auth();
  if (!session) {
    throw new Error("No se pudo crear la interaction");
  }

  // Datos opcionales del archivo
  let attachmentUrl: string | undefined;
  let attachmentName: string | undefined;
  let attachmentType: string | undefined;

  // Solo si el campo existe y no es una cadena vacía
  if (
    rawAttachment &&
    typeof rawAttachment === "string" &&
    rawAttachment !== ""
  ) {
    try {
      const attachment = JSON.parse(rawAttachment) as Attachment;
      attachmentUrl = attachment.attachmentUrl;
      attachmentName = attachment.attachmentName;
      attachmentType = attachment.attachmentType;
    } catch (error) {
      console.error("Error parsing attachment JSON:", error);
    }
  }

  try {
    const interaction = await prisma.contactInteraction.create({
      data: {
        content,
        contactoId,
        autorId: session.user.id,
        attachmentUrl,
        attachmentName,
        attachmentType,
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
    console.error(err);
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

// Nueva función para obtener todas las interacciones de un lead
export const getAllInteractionsByLeadId = async (
  leadId: string,
): Promise<ContactInteractionWithRelations[]> => {
  try {
    const result = await prisma.contactInteraction.findMany({
      where: {
        contacto: {
          leadId: leadId,
        },
      },
      include: {
        contacto: true,
        autor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return result;
  } catch (err) {
    throw new Error("Error al obtener las interacciones del lead");
  }
};
