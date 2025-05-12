import { auth } from "@/lib/auth";
import { AdminPage } from "./components/AdminPage";
import { Role } from "@prisma/client";
import { checkRoleRedirect } from "../../helpers/checkRoleRedirect";
import prisma from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trust | Dashboard",
};

export default async function Dashboardpage() {
  const session = await auth();
  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);
  const userCount = await prisma.user.count();

  // const clientsCount = await prisma.lead.count({
  //   where: {
  //     status: LeadStatus.Asignadas,
  //   },
  // });

  return (
    <>
      <div>
        <AdminPage
          userCount={userCount}
          clientsCount={0}
          userId={session?.user.id as string}
        />
      </div>
    </>
  );
}
