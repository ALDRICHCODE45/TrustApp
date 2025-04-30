import { auth } from "@/lib/auth";
import KanbanLeadsBoard from "./ClientPage";
import { log } from "console";
import { Role } from "@prisma/client";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";

export type LeadWithRelations = Prisma.LeadGetPayload<{
  include: {
    generadorLeads: true;
    contactos: true;
    statusHistory: {
      include: {
        changedBy: true;
      };
    };
  };
}>;

const getInitialLeads = async (): Promise<LeadWithRelations[]> => {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        generadorLeads: true,
        contactos: true,
        statusHistory: {
          include: {
            changedBy: true,
          },
        },
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

export const metadata: Metadata = {
  title: "Kanban | Leads",
};

const page = async () => {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Id is required");
  }

  const leads = await getInitialLeads();
  const generadores = await getGeneradores();

  return (
    <>
      <KanbanLeadsBoard initialLeads={leads} generadores={generadores} />
    </>
  );
};

export default page;
