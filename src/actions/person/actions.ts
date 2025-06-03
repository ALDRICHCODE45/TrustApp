"use server";
import { parseWithZod } from "@conform-to/zod";
import { checkSession } from "@/hooks/auth/checkSession";
import {
  createLeadPersonSchema,
  editLeadPersonSchema,
} from "@/zod/createLeadPersonSchema";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { deleteFile } from "../files/actions";

export const createLeadPerson = async (prevState: any, formData: FormData) => {
  try {
    await checkSession();

    const submission = parseWithZod(formData, {
      schema: createLeadPersonSchema,
    });

    if (submission.status !== "success") {
      return {
        status: "error",
        message: "Error en la validación del formulario",
        errors: submission.reply().error?.formErrors || [],
      };
    }

    // Verificar que el lead existe y pertenece al usuario correcto
    const lead = await prisma.lead.findUnique({
      where: {
        id: submission.value.leadId,
      },
      include: {
        generadorLeads: true,
      },
    });

    if (!lead) {
      return {
        status: "error",
        message: "El lead no existe",
      };
    }

    // Crear el contacto
    const contact = await prisma.person.create({
      data: {
        name: submission.value.name,
        position: submission.value.position,
        email: submission.value.email || null,
        phone: submission.value.phone || null,
        leadId: submission.value.leadId,
        linkedin: submission.value.linkedin || null,
      },
      include: {
        interactions: {
          include: {
            autor: true,
            contacto: true,
          },
        },
      },
    });

    // Revalidar las rutas necesarias
    revalidatePath("/leads");
    revalidatePath("/list/leads");

    return {
      status: "success",
      data: contact,
    };
  } catch (error) {
    console.error("Error creating contact:", error);
    return {
      status: "error",
      message: "Error al crear el contacto",
    };
  }
};

export const editLeadPerson = async (contactId: string, formData: FormData) => {
  try {
    await checkSession();

    const submission = parseWithZod(formData, {
      schema: editLeadPersonSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const existingContact = await prisma.person.findUnique({
      where: { id: contactId },
    });

    if (!existingContact) {
      throw Error("Contacto no encontrado");
    }

    const email =
      submission.value.email === undefined ? null : submission.value.email;
    const phone =
      submission.value.phone === undefined ? null : submission.value.phone;

    await prisma.person.update({
      where: { id: contactId },
      data: {
        name: submission.value.name || existingContact.name,
        position: submission.value.position || existingContact.position,
        email,
        phone,
      },
    });

    revalidatePath("/leads");
    revalidatePath("/list/leads");
  } catch (error) {
    throw Error("Error actualizando el contacto");
  }
};

export const deleteContactById = async (contactId: string) => {
  await checkSession();

  //TODO: eliminar archivos si existen dentro del seguimiento
  try {
    const contactToDelete = await prisma.person.findUnique({
      where: {
        id: contactId,
      },
      include: {
        interactions: {
          select: {
            attachmentUrl: true,
            id: true,
          },
        },
      },
    });

    if (contactToDelete?.interactions) {
      for (const interaction of contactToDelete?.interactions) {
        if (interaction.attachmentUrl) {
          const fileKey = interaction.attachmentUrl.split("/").pop();
          if (!fileKey) {
            throw new Error(
              "No se puede generar el fileKey mientras se elimina el contacto",
            );
          }
          await deleteFile(fileKey, interaction.id);
        }
      }
    }

    await prisma.person.delete({
      where: {
        id: contactId,
      },
    });

    revalidatePath("/leads");
    revalidatePath("/list/leads");
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "error al eliminar el lead",
    };
  }
};
