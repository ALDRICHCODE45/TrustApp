"use server";
import { createLeadSchema } from "@/zod/createLeadSchema";
import prisma from "@/lib/db";
import { parseWithZod } from "@conform-to/zod";
import { checkSession } from "@/hooks/auth/checkSession";
import { editLeadZodSchema } from "@/zod/editLeadSchema";
import { revalidatePath } from "next/cache";
import { User, Role } from "@prisma/client";
import { auth } from "@/lib/auth";

export const createNewOrigen = async (formData: FormData) => {
  const session = await auth();
  if (!session) {
    throw new Error("invalid session");
  }
  const origenName = formData.get("nombre") as string;
  console.log({ origenName });

  if (origenName.length < 3 || !origenName) {
    return {
      ok: false,
      message: "Origen invalido",
    };
  }

  try {
    await prisma.leadOrigen.create({
      data: {
        nombre: origenName,
      },
    });
    revalidatePath("/admin/config/leads");
    return {
      ok: true,
      message: "Origen creado correctamente",
    };
  } catch (err) {
    throw new Error("invalid Origen");
  }
};

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
  let submission;
  try {
    await checkSession();
    submission = parseWithZod(formData, {
      schema: createLeadSchema,
    });
    if (submission.status !== "success") {
      return submission.reply();
    }
    const empresa = submission.value.empresa;

    // Check if lead already exists (exact match, case insensitive)
    const leadExists = await prisma.lead.findFirst({
      where: {
        empresa: {
          equals: empresa,
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
    const origen = await prisma.leadOrigen.findUnique({
      where: {
        id: submission.value.origen,
      },
    });
    const sector = await prisma.sector.findUnique({
      where: {
        id: submission.value.sector,
      },
    });
    // Create the new lead
    const leadCreated = await prisma.lead.create({
      data: {
        empresa: submission.value.empresa,
        link: submission.value.link,
        origenId: origen!.id,
        sectorId: sector!.id,
        status: submission.value.status,
        generadorId: submission.value.generadorId,
        createdAt: submission.value.createdAt,
      },
      include: {
        generadorLeads: true,
        contactos: true,
        sector: true,
        origen: true,
      },
    });
    //crear la trazabilidad para Contacto
    await prisma.leadStatusHistory.create({
      data: {
        leadId: leadCreated.id,
        status: leadCreated.status,
        changedById: submission.value.generadorId,
      },
    });
    //Revalidate necessary paths
    revalidatePath("/leads");
    revalidatePath("/list/leads");
    revalidatePath("/leads/kanban");
    // Return success with the newly created lead data
    return submission.reply();
  } catch (error) {
    console.error("Error creating lead:", error);
    return (
      submission?.reply({
        formErrors: ["Error en la creacion del Lead"],
      }) || {
        status: "error",
        formErrors: ["Error en la creacion del Lead"],
      }
    );
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

    if (submission.value.generadorId && sesion.user.role !== Role.Admin) {
      throw Error("No tienes los privilegios para reasignar el role");
    }

    const existingLead = await prisma.lead.findUnique({
      where: {
        id: leadId,
      },
      include: {
        origen: true,
        sector: true,
      },
    });

    if (!existingLead) {
      throw Error("Lead does not exists");
    }

    // Modificado: Si NO es admin Y además no es el creador del lead, entonces no puede modificarlo
    if (
      sesion.user.role !== Role.Admin &&
      sesion.user.id !== existingLead.generadorId
    ) {
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
        generadorId: submission.value.generadorId || existingLead.generadorId,
        link: submission.value.link || existingLead.link,
        origenId: submission.value.origen || existingLead.origenId,
        sectorId: submission.value.sector || existingLead.sectorId,
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
