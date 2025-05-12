import { auth } from "@/lib/auth";
import KanbanLeadsBoard from "./ClientPage";
import { log } from "console";
import { Role } from "@prisma/client";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadHistory from "./components/LeadHistory";

export type LeadWithRelations = Prisma.LeadGetPayload<{
  include: {
    sector: true;
    origen: true;
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
        sector: true,
        origen: true,
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
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban">
          <KanbanLeadsBoard initialLeads={leads} generadores={generadores} />
        </TabsContent>
        <TabsContent value="history">
          <LeadHistory generadores={generadores} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default page;
