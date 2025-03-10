"use client";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AttendanceChart } from "@/components/AttendanceChart";
import { User, UsersData } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import "yet-another-react-lightbox-lite/styles.css";
import { UserProfileHeader } from "./components/UserProfileHeader";
import { EventCalendar } from "@/components/EventCalendar";

const fetchUser = async (userId: number): Promise<User | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = UsersData.find((user) => user.id === userId);
      resolve(user);
    }, 1000); // Simula una carga de datos con retraso de 1s
  });
};

// Interfaz para las actividades

export default async function UserProfile() {
  const { id } = useParams();
  const user = await fetchUser(Number(id));

  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header - User Basic Info */}
      <UserProfileHeader user={user} />

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
                      {user?.placements || user?.clientes || "14"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Promedio</p>
                    <p className="text-2xl font-medium mt-1">8.5</p>
                  </CardContent>
                </Card>

                <Card className="border">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Crecimiento</p>
                    <p className="text-2xl font-medium mt-1">+12%</p>
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
