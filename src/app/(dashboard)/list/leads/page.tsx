import { ReactElement } from "react";
import { leadsColumns } from "./leadsColumns";
import { CreateLeadForm } from "./components/CreateLeadForm";
import { CommercialTable } from "@/app/(dashboard)/leads/table/CommercialTable";
import { auth } from "@/lib/auth";
import { checkRoleRedirect } from "@/app/helpers/checkRoleRedirect";
import { Role } from "@prisma/client";
import prisma from "@/lib/db";
import { ToastAlerts } from "@/components/ToastAlerts";
import { Metadata } from "next";

interface pageProps {}

export const metadata: Metadata = {
  title: "Trust | Leads",
};

const fetchData = async () => {
  const leads = await prisma.lead.findMany({
    include: {
      generadorLeads: true,
      contactos: true,
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

export default async function LeadsPage({}: pageProps): Promise<ReactElement> {
  const { columns, data } = await fetchData();
  const session = await auth();
  const generadores = await fetchGeneradores();

  checkRoleRedirect(session?.user.role as Role, [Role.Admin, Role.GL, Role.MK]);

  return (
    <>
      {/* LIST */}

      {/* <ToastAlerts /> */}
      <CreateLeadForm generadores={generadores} />
      <CommercialTable
        columns={columns}
        data={data}
        generadores={generadores}
      />
    </>
  );
}
