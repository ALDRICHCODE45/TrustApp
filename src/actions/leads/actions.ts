"use server";

import { createLeadSchema } from "@/zod/createLeadSchema";
import prisma from "@/lib/db";
import { parseWithZod } from "@conform-to/zod";
import { checkSession } from "@/hooks/auth/checkSession";
import { editLeadZodSchema } from "@/zod/editLeadSchema";
import { revalidatePath } from "next/cache";
import { User, Role } from "@prisma/client";

export const deleteLeadById = async (leadId: string) => {
  try {
    await prisma.lead.delete({
      where: {
        id: leadId,
      },
    });
  } catch (error) {
    console.log(error);
    throw Error("Error al eliminar el lead");
  }
  revalidatePath("/leads");
};

export const getRecruiters = async (): Promise<User[]> => {
  try {
    const recruiters = await prisma.user.findMany({
      where: {
        role: {
          in: ["GL", "Admin", "MK"],
        },
      },
    });
    return recruiters;
  } catch (error) {
    console.log(error);
    throw Error("error");
  }
};

export async function createLead(prevState: any, formData: FormData) {
  await checkSession("/sing-in");

  const submission = parseWithZod(formData, {
    schema: createLeadSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const leadExists = await prisma.lead.findFirst({
    where: {
      empresa: {
        // Usamos `contains` y aplicamos una función `lowercase` en ambos valores
        contains: formData.get("empresa") as string,
        mode: "insensitive",
      },
    },
  });

  // Return custom error for duplicate lead
  if (leadExists) {
    return submission.reply({
      formErrors: ["Error al crear el Lead"],
    });
  }

  await prisma.lead.create({
    data: {
      empresa: submission.value.empresa,
      fechaAConectar: submission.value.fechaAConectar,
      fechaProspeccion: submission.value.fechaProspeccion,
      link: submission.value.link,
      origen: submission.value.origen,
      sector: submission.value.sector,
      status: submission.value.status,
      generadorId: submission.value.generadorId,
    },
  });

  revalidatePath("/leads");
  revalidatePath("/list/leads");
  revalidatePath("/list");
}

export const editLeadById = async (leadId: string, formData: FormData) => {
  const sesion = await checkSession("/sing-in");

  if (sesion.user.role != Role.Admin) {
    throw Error("No tienes los privilegios para editar");
  }

  const submission = parseWithZod(formData, {
    schema: editLeadZodSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const existingLead = await prisma.lead.findUnique({
    where: {
      id: leadId,
    },
  });

  if (!existingLead) {
    throw Error("User does not exists");
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      empresa: submission.value.empresa || existingLead.empresa,
      fechaAConectar:
        submission.value.fechaAConectar || existingLead.fechaAConectar,
      fechaProspeccion:
        submission.value.fechaProspeccion || existingLead.fechaProspeccion,
      generadorId: submission.value.generadorId || existingLead.generadorId,
      link: submission.value.link || existingLead.link,
      origen: submission.value.origen || existingLead.origen,
      sector: submission.value.sector || existingLead.sector,
      status: submission.value.status || existingLead.status,
    },
  });
  revalidatePath("/leads");
};
