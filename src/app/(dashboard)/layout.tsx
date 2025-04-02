import React, { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ClientLayout } from "./ClientLayout";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();
  console.log({ session });
  if (!session) redirect("/sign-in");

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ClientLayout>{children}</ClientLayout>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
