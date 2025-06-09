import React from "react";
import { Database } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const sidebarItems = [
    // { icon: User, label: "Profile", id: "profile" },
    // { icon: Settings, label: "Account", id: "account" },
    // { icon: Bell, label: "Notifications", id: "notifications" },
    // { icon: Monitor, label: "Display", id: "display" },
    { icon: Database, label: "Leads Config", id: "leads", active: true },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Configuración</h1>
          <p>
            Administre la configuración de su cuenta y establezca sus
            preferencias de correo electrónico.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside
            className="w-64 flex-shrink-0"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <nav
              className="space-y-1 p-4 rounded-lg shadow"
              style={{
                position: "sticky",
                top: "2rem",
              }}
            >
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
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
