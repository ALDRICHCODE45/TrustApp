"use server";

import { createLeadSchema } from "@/zod/createLeadSchema";
import prisma from "@/lib/db";
import { parseWithZod } from "@conform-to/zod";
import { checkSession } from "@/hooks/auth/checkSession";

export async function createLead(prevState: any, formData: FormData) {
  await checkSession("/sing-in");

  const submission = parseWithZod(formData, {
    schema: createLeadSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  console.log({ formData, status: submission.status });

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
}
