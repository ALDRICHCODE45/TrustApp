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
import { usuario_logeado } from "@/lib/data";

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
      title: "Reclutamiento",
      url: "#",
      icon: UserSearch,
      roles: ["reclutador"],
      items: [
        {
          title: "Vacantes",
          url: "/reclutador",
          roles: ["reclutador"],
        },
        {
          title: "Kanban",
          url: "/reclutador/kanban",
          roles: ["reclutador"],
        },
      ],
    },
    {
      title: "Generacion de Leads",
      url: "#",
      icon: HandCoins,
      roles: ["gl"],
      items: [
        {
          title: "Tus Prospecciones",
          url: "/leads",
          roles: ["gl"],
        },
        {
          title: "Kanban Board",
          url: "/leads/kanban",
          roles: ["gl"],
        },
      ],
    },
    {
      title: "Administración",
      url: "#",
      icon: ShieldBan,
      isActive: true,
      roles: ["admin"], // Solo visible para administradores
      items: [
        {
          title: "Usuarios",
          url: "/list/users",
          roles: ["admin"], // Solo visible para administradores
        },
        {
          title: "Clientes",
          url: "/list/clientes",
          roles: ["admin", "user"],
        },
        {
          title: "Leads",
          url: "/list/leads",
          roles: ["admin", "user"],
        },
      ],
    },
    {
      title: "Panel de control",
      url: "",
      icon: MonitorCog,
      isActive: true,
      roles: ["admin", "user"], // Visible para administradores y usuarios normales
      items: [
        {
          title: "Dashboard Administrativo",
          url: "/admin",
          roles: ["admin"], // Solo visible para administradores
        },
        {
          title: "Reclutamiento",
          url: "/list/reclutamiento",
          roles: ["admin", "user"], // Visible para administradores y usuarios normales
        },
      ],
    },
    {
      title: "Sistema",
      url: "",
      icon: UserRoundCog,
      roles: ["admin"],
      items: [
        {
          title: "Logs",
          url: "/sistema/logs",
          roles: ["admin"],
        },
      ],
    },
    {
      title: "Finanzas",
      url: "",
      icon: Landmark,
      roles: ["admin", "user"],
      items: [
        {
          title: "CXP",
          url: "/list/cuentas",
          roles: ["admin", "user"],
        },
        {
          title: "CXC",
          url: "/list/facturas",
          roles: ["admin", "user"],
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Filtrar los elementos del menú según el rol del usuario logeado
  const filteredNavMain = data.navMain
    .filter((item) => item.roles?.includes(usuario_logeado.role))
    .map((item) => ({
      ...item,
      items: item.items?.filter((subItem) =>
        subItem.roles?.includes(usuario_logeado.role)
      ),
    }));

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <NavUser user={usuario_logeado} />
      </SidebarHeader>
      <SidebarContent>
        {/* Pasar los elementos filtrados */}
        <NavMain items={filteredNavMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
