"use client";
import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  MonitorCog,
  Settings2,
  Shield,
  SlidersHorizontal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "Salvador Perea",
    email: "m@ejemplo.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Administración",
      url: "#",
      icon: Shield,
      isActive: true,
      items: [
        {
          title: "Usuarios",
          url: "/list/users",
        },
        {
          title: "Clientes",
          url: "/list/clientes",
        },
        {
          title: "Leads",
          url: "/list/leads",
        },
      ],
    },
    {
      title: "Panel de control",
      url: "",
      icon: MonitorCog,
      isActive: true,
      items: [
        {
          title: "Dashboard Administrativo",
          url: "/admin",
        },
        {
          title: "Reclutamiento",
          url: "/list/reclutamiento",
        },
      ],
    },
    {
      title: "sistema",
      url: "",
      icon: SlidersHorizontal,
      items: [
        {
          title: "Logs",
          url: "/sistema/logs",
        },
      ],
    },
    {
      title: "Finanzas",
      url: "",
      icon: Settings2,
      items: [
        {
          title: "Cuentas",
          url: "/list/cuentas",
        },
        {
          title: "Facturas",
          url: "/list/facturas",
        },
      ],
    },
  ],
  //projects: [
  //{
  //name: "Design Engineering",
  //url: "#",
  //icon: Frame,
  // },
  //{
  //name: "Sales & Marketing",
  //url: "#",
  //icon: PieChart,
  // },
  // {
  //name: "Travel",
  //url: "#",
  //icon: Map,
  //},
  //],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter> */}
      {/* </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
