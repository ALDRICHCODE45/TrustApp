import React from "react";
import { User, Settings, Bell, Monitor, Database } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const sidebarItems = [
    { icon: User, label: "Profile", id: "profile" },
    { icon: Settings, label: "Account", id: "account" },
    { icon: Bell, label: "Notifications", id: "notifications" },
    { icon: Monitor, label: "Display", id: "display" },
    { icon: Database, label: "Leads Config", id: "leads", active: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuración
          </h1>
          <p className="text-gray-600">
            Administre la configuración de su cuenta y establezca sus
            preferencias de correo electrónico.
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      item.active
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
