import React, { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ClientLayout } from "./ClientLayout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

interface LayoutProps {
  children: ReactNode;
}

const getUser = async (userEmail: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  return user;
};

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();

  if (!session) redirect("/sign-in");
  const user = await getUser(session.user.email);

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar user={user} />
        <SidebarInset>
          <ClientLayout>{children}</ClientLayout>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
