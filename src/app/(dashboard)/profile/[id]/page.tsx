import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AttendanceChart } from "@/components/AttendanceChart";
import { notFound } from "next/navigation";
import "yet-another-react-lightbox-lite/styles.css";
import { UserProfileHeader } from "./components/UserProfileHeader";
import { EventCalendar } from "@/components/EventCalendar";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

const fetchUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const loadProfile = async () => {
    try {
      const usuario = await fetchUser(id);
      if (!usuario) {
        notFound();
      }
      return usuario;
    } catch {
      throw new Error("load profile error");
    }
  };

  const user = await loadProfile();

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header - User Basic Info */}
      <UserProfileHeader
        user={user}
        isAdmin={session?.user.role === Role.Admin}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar Section - 2/5 width */}
        <Card className="lg:col-span-2 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Calendario</CardTitle>
            <CardDescription>Gestiona tus eventos y reuniones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-full w-full container mx-auto">
              <EventCalendar />
            </div>
          </CardContent>
        </Card>

        {/* Performance Tab - 3/5 width */}
        <Card className="lg:col-span-3 border">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Desempeño</CardTitle>
            <CardDescription>
              Visualiza tu rendimiento y progreso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Este mes</p>
                    <p className="text-2xl font-medium mt-1">
                      {/* {user?.placements || user?.clientes || "14"} */}
                      14
                    </p>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Tiempo Promedio</p>
                    <p className="text-2xl font-medium mt-1">
                      8.5 <span className="text-sm">(dias)</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Tareas Completadas</p>
                    <p className="text-2xl font-medium mt-1">11</p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card className="border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md font-medium">
                    Tendencia de Rendimiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="">
                    <AttendanceChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
