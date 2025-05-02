"use server";
import { createLeadSchema } from "@/zod/createLeadSchema";
import prisma from "@/lib/db";
import { parseWithZod } from "@conform-to/zod";
import { checkSession } from "@/hooks/auth/checkSession";
import { editLeadZodSchema } from "@/zod/editLeadSchema";
import { revalidatePath } from "next/cache";
import { User, Role } from "@prisma/client";
import { auth } from "@/lib/auth";

export const deleteLeadById = async (leadId: string) => {
  const session = await auth();

  try {
    const leadIndb = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
    });

    if (!leadIndb || leadIndb.generadorId != session?.user.id) {
      throw new Error("No tienes los permisos para eliminar este lead");
    }

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
          in: [Role.GL, Role.Admin, Role.MK],
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
  try {
    await checkSession();

    const submission = parseWithZod(formData, {
      schema: createLeadSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const empresa = submission.value.empresa;

    // Check if lead already exists (case insensitive)
    const leadExists = await prisma.lead.findFirst({
      where: {
        empresa: {
          contains: empresa,
          mode: "insensitive",
        },
      },
    });

    // Return custom error for duplicate lead
    if (leadExists) {
      return submission.reply({
        formErrors: [
          `La empresa "${empresa}" ya existe como lead en el sistema`,
        ],
      });
    }

    // Create the new lead
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
      // Optionally include the generador relationship for a more complete response
      include: {
        generadorLeads: true,
      },
    });

    // Revalidate necessary paths
    revalidatePath("/leads");
    revalidatePath("/list/leads");
    revalidatePath("/leads/kanban");

    // Return success with the newly created lead data
  } catch (error) {
    console.error("Error creating lead:", error);
    throw new Error("Error en la creacion del Lead");
  }
}

export const editLeadById = async (leadId: string, formData: FormData) => {
  const sesion = await checkSession();

  try {
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

    if (sesion.user.id !== existingLead.generadorId) {
      throw new Error("No puedes modificar este lead");
    }

    // Verificamos si el status está cambiando
    const newStatus = submission.value.status;
    const statusChanged = newStatus && newStatus !== existingLead.status;

    // Actualizamos el lead
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

    // Si el estado cambió, registramos en el historial
    if (statusChanged) {
      await prisma.leadStatusHistory.create({
        data: {
          leadId: leadId,
          status: newStatus,
          changedById: sesion.user.id,
          // La fecha se establecerá automáticamente con @default(now())
        },
      });
    }

    revalidatePath("/leads");
    revalidatePath("/list/leads");
  } catch (err) {
    console.log(err);
    throw new Error("Error al editar el lead");
  }
};
