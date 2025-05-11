import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import "yet-another-react-lightbox-lite/styles.css";
import { UserProfileHeader } from "./components/UserProfileHeader";
import { EventCalendar } from "@/components/EventCalendar";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { Role, TaskStatus } from "@prisma/client";
import { Metadata } from "next";
import { AttendanceChart } from "@/components/AttendanceChart";
import { LeadPerformanceChart } from "../components/PerformanceChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanUserTasks from "./components/kanban/KanbanUserTask";

const fetchDoneTasksByUserId = async (userId: string) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: userId,
        status: TaskStatus.Done,
      },
    });
    return tasks;
  } catch (err) {
    throw new Error("Error al traer las tareas");
  }
};

const fetchUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error) {
    throw Error("Error cargando el usuario en profilePage");
  }
};

const fetchTasksById = async (userId: string) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: userId,
      },
      include: {
        assignedTo: true,
      },
    });
    return tasks;
  } catch (error) {
    throw new Error("Error en el fetch de tasks");
  }
};

export const metadata: Metadata = {
  title: "Trust | Perfil",
};

export default async function UserProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;

  const loadTasks = async () => {
    try {
      const tasks = await fetchTasksById(id);
      if (!tasks) {
        notFound();
      }

      return tasks;
    } catch (error) {
      throw new Error("Error fetcheando las tareas");
    }
  };

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
  const tasks = await loadTasks();
  const doneTasks = await fetchDoneTasksByUserId(id);

  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        {/* Header - User Basic Info */}
        <UserProfileHeader
          user={user}
          isAdmin={session?.user.role === Role.Admin}
          tasks={tasks}
        />

        <div className="w-full">
          <Tabs defaultValue="esta" className="">
            <TabsList>
              <TabsTrigger value="esta">Estadisticas</TabsTrigger>
              <TabsTrigger value="asignaciones">Asignaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="esta">
              <div className="space-y-6">
                {/* First Row - Quick Stats */}
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
                      <p className="text-sm text-gray-500">
                        Tareas Completadas
                      </p>
                      <p className="text-2xl font-medium mt-1">
                        {doneTasks.length || 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md font-medium"></CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2 min-h-[16rem] overflow-hidden">
                    <LeadPerformanceChart />
                  </CardContent>
                </Card>
                {/* Second Row - Grid with Calendar and Performance Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Calendar Section - 2/5 width */}
                  <Card className="lg:col-span-2 border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        Calendario
                      </CardTitle>
                      <CardDescription>
                        Gestiona tus eventos y reuniones
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-full w-full container mx-auto">
                        <EventCalendar userId={user.id} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Performance Card - 3/5 width */}
                  <Card className="lg:col-span-3 border">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-medium">
                        Desempeño
                      </CardTitle>
                      <CardDescription>
                        Visualiza tu rendimiento y progreso
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AttendanceChart />
                    </CardContent>
                  </Card>
                </div>
                {/* Third Row - Full Width Performance Chart */}
              </div>
            </TabsContent>
            <TabsContent value="asignaciones">
              <KanbanUserTasks initialTasks={tasks} />
            </TabsContent>
          </Tabs>
        </div>
        {/* Main Layout */}
      </div>
    </>
  );
}
