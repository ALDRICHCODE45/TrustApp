"use client";
import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  HandCoins,
  Landmark,
  MonitorCog,
  ShieldBan,
  UserRoundCog,
  UserSearch,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Role, User } from "@prisma/client";

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
      title: "Reclutamiento",
      url: "#",
      icon: UserSearch,
      roles: [Role.reclutador],
      items: [
        {
          title: "Vacantes",
          url: "/reclutador",
          roles: [Role.reclutador],
        },
        {
          title: "Kanban",
          url: "/reclutador/kanban",
          roles: [Role.reclutador],
        },
      ],
    },
    {
      title: "Generacion de Leads",
      url: "#",
      icon: HandCoins,
      roles: [Role.GL],
      items: [
        {
          title: "Prospecciones",
          url: "/leads",
          roles: [Role.GL],
        },
        {
          title: "Kanban Board",
          url: "/leads/kanban",
          roles: [Role.GL],
        },
      ],
    },
    {
      title: "Administración",
      url: "#",
      icon: ShieldBan,
      isActive: true,
      roles: [Role.Admin], // Solo visible para administradores
      items: [
        {
          title: "Usuarios",
          url: "/list/users",
          roles: [Role.Admin], // Solo visible para administradores
        },
        {
          title: "Clientes",
          url: "/list/clientes",
          roles: [Role.Admin],
        },
        {
          title: "Leads",
          url: "/list/leads",
          roles: [Role.Admin],
        },
      ],
    },
    {
      title: "Panel de control",
      url: "",
      icon: MonitorCog,
      isActive: true,
      roles: [Role.Admin],
      items: [
        {
          title: "Dashboard Administrativo",
          url: "/admin",
          roles: [Role.Admin],
        },
        {
          title: "Reclutamiento",
          url: "/list/reclutamiento",
          roles: [Role.Admin],
        },
      ],
    },
    {
      title: "Sistema",
      url: "",
      icon: UserRoundCog,
      roles: [Role.Admin],
      items: [
        {
          title: "Logs",
          url: "/sistema/logs",
          roles: [Role.Admin],
        },
      ],
    },
    {
      title: "Finanzas",
      url: "",
      icon: Landmark,
      roles: [Role.Admin],
      items: [
        {
          title: "CXP",
          url: "/list/cuentas",
          roles: [Role.Admin],
        },
        {
          title: "CXC",
          url: "/list/facturas",
          roles: [Role.Admin],
        },
      ],
    },
  ],
};

export function AppSidebar({ user }: { user: User }) {
  // Filtrar los elementos del menú según el rol del usuario logeado
  const filteredNavMain = data.navMain
    .filter((item) => item.roles?.includes(user.role))
    .map((item) => ({
      ...item,
      items: item.items?.filter((subItem) =>
        subItem.roles?.includes(user.role),
      ),
    }));

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        {/* Pasar los elementos filtrados */}
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
