import { auth } from "@/lib/auth";
import KanbanLeadsBoard from "./ClientPage";
import { log } from "console";
import { Role } from "@prisma/client";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";

export type LeadWithRelations = Prisma.LeadGetPayload<{
  include: {
    generadorLeads: true;
    contactos: true;
  };
}>;

const getInitialLeads = async (
  userId: string,
): Promise<LeadWithRelations[]> => {
  if (!userId || userId.length < 2) {
    throw new Error("UserId is required");
  }

  try {
    const leads = await prisma.lead.findMany({
      where: {
        generadorId: userId,
      },
      include: {
        generadorLeads: true,
        contactos: true,
      },
    });

    return leads;
  } catch (error) {
    log(error);
    throw new Error("Error trayendo las tareas");
  }
};

const getGeneradores = async () => {
  try {
    const generadores = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.MK, Role.GL, Role.Admin],
        },
      },
    });
    return generadores;
  } catch (error) {
    log("Error");

    throw new Error("Generadores");
  }
};

const page = async () => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Id is required");
  }

  const leads = await getInitialLeads(session?.user.id);
  const generadores = await getGeneradores();

  return (
    <>
      <KanbanLeadsBoard initialLeads={leads} generadores={generadores} />
    </>
  );
};

export default page;
