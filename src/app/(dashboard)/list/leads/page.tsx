import { leadsColumns } from "./leadsColumns";
import { CreateLeadForm } from "./components/CreateLeadForm";
import { CommercialTable } from "@/app/(dashboard)/leads/table/CommercialTable";
import { auth } from "@/lib/auth";
import { checkRoleRedirect } from "@/app/helpers/checkRoleRedirect";
import { Role } from "@prisma/client";
import prisma from "@/lib/db";
import { Metadata } from "next";
import { ColumnDef } from "@tanstack/react-table";
import { LeadWithRelations } from "../../leads/kanban/page";

interface pageProps {}

export const metadata: Metadata = {
  title: "Trust | Leads",
};

const fetchData = async (): Promise<{
  data: LeadWithRelations[];
  columns: ColumnDef<LeadWithRelations>[];
}> => {
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

  return {
    columns: leadsColumns,
    data: leads,
  };
};

const fetchGeneradores = async () => {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: [Role.GL, Role.Admin, Role.MK],
      },
    },
  });

  return users;
};

const fetchSectores = async () => {
  try {
    const sectores = await prisma.sector.findMany({
      select: { id: true, nombre: true },
    });
    return sectores;
  } catch (err) {
    throw new Error("No se pueden fetchear los sectores");
  }
};

const fetchOrigenes = async () => {
  try {
    const origenes = await prisma.leadOrigen.findMany({
      select: { id: true, nombre: true },
    });
    return origenes;
  } catch (err) {
    throw new Error("No se pueden fetchear los origenes");
  }
};

export default async function LeadsPage({}: pageProps) {
  const { columns, data } = await fetchData();
  const session = await auth();

  const generadores = await fetchGeneradores();

  const sectores = await fetchSectores();
  const origenes = await fetchOrigenes();

  if (!session) {
    throw new Error("User does not exists");
  }

  checkRoleRedirect(session?.user.role as Role, [Role.Admin, Role.GL, Role.MK]);

  const isAdmin = session?.user.role === Role.Admin;
  const activeUser = {
    name: session.user.name,
    id: session.user.id,
  };

  return (
    <>
      {/* LIST */}

      {/* <ToastAlerts /> */}

      <CreateLeadForm
        isAdmin={isAdmin}
        activeUser={activeUser}
        sectores={sectores}
        generadores={generadores}
        origenes={origenes}
      />
      <CommercialTable
        columns={columns}
        data={data}
        generadores={generadores}
      />
    </>
  );
}
