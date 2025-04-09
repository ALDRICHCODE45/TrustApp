"use server";

import { createLeadSchema } from "@/zod/createLeadSchema";
import prisma from "@/lib/db";
import { parseWithZod } from "@conform-to/zod";
import { checkSession } from "@/hooks/auth/checkSession";
import { editLeadZodSchema } from "../../zod/editLeadSchema";
import { revalidatePath } from "next/cache";

export async function createLead(prevState: any, formData: FormData) {
  await checkSession("/sing-in");

  const submission = parseWithZod(formData, {
    schema: createLeadSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
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
}

export const editLeadById = async (leadId: string, formData: FormData) => {
  await checkSession("/sing-in");

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
