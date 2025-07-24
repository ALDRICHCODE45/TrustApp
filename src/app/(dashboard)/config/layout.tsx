import React from "react";
import { Settings, Database, Users, Bell, Shield } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const sidebarItems = [
    {
      icon: Database,
      label: "Configuración de Leads",
      id: "leads",
      active: true,
      description: "Gestiona orígenes y sectores",
      badge: null,
    },
    {
      icon: Users,
      label: "Usuarios y Permisos",
      id: "users",
      active: false,
      description: "Control de acceso",
      badge: "Próximamente",
    },
    {
      icon: Bell,
      label: "Notificaciones",
      id: "notifications",
      active: false,
      description: "Alertas y comunicaciones",
      badge: "Próximamente",
    },
    {
      icon: Shield,
      label: "Seguridad",
      id: "security",
      active: false,
      description: "Configuración de seguridad",
      badge: "Próximamente",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header simple */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-muted-foreground" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Configuración
              </h1>
              <p className="text-sm text-muted-foreground">
                Administre la configuración de su cuenta y establezca sus
                preferencias
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar minimalista */}
          <aside className="w-64 flex-shrink-0">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    disabled={!item.active}
                    className={`w-full flex items-center justify-between p-3 text-left rounded-md transition-colors ${
                      item.active
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <div className="text-sm font-medium">{item.label}</div>
                    </div>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
