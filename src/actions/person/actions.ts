"use server";
import { parseWithZod } from "@conform-to/zod";
import { checkSession } from "@/hooks/auth/checkSession";
import {
  createLeadPersonSchema,
  editLeadPersonSchema,
} from "@/zod/createLeadPersonSchema";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export const createLeadPerson = async (prevSate: any, formData: FormData) => {
  try {
    await checkSession();

    const submission = parseWithZod(formData, {
      schema: createLeadPersonSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    await prisma.person.create({
      data: {
        name: submission.value.name,
        email: submission.value.email,
        position: submission.value.position,
        leadId: submission.value.leadId,
      },
    });

    revalidatePath("/leads");
    revalidatePath("/list/leads");
  } catch (error) {
    throw Error("Error creando el lead");
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

    await prisma.person.update({
      where: { id: contactId },
      data: {
        name: submission.value.name || existingContact.name,
        email: submission.value.email || existingContact.email,
        position: submission.value.position || existingContact.position,
        cv: submission.value.cv || existingContact.cv,
        phone: submission.value.phone || existingContact.phone,
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

  try {
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
