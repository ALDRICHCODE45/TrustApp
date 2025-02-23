"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ActivityList } from "@/components/ActivityList";
import { EventCalendar } from "@/components/EventCalendar";
import { AttendanceChart } from "@/components/AttendanceChart";
import { UsersData, usuario_logeado } from "@/lib/data";
import { useParams } from "next/navigation";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox-lite";
import "yet-another-react-lightbox-lite/styles.css";
import EditProfile from "../../list/users/components/EditUserDropDown";

const fetchUser = (userId: number) => {
  return UsersData.find((user) => user.id === userId);
};

export default function UserProfile() {
  const { id } = useParams();
  const [index, setIndex] = useState<number>();
  const user = fetchUser(Number(id));

  return (
    <div className="p-6 flex gap-6 flex-col xl:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full xl:w-2/3">
        <Card className="h-full">
          {/* HEADER CON BOTÓN DE EDITAR PERFIL */}
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {usuario_logeado.role === "admin"
                  ? "Perfil de Usuario"
                  : "Tu perfil"}
              </h3>
              <p className="text-sm text-gray-500">{user?.name}</p>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full h-full">
              <TabsList className="flex w-full">
                <TabsTrigger className="w-full" value="profile">
                  Perfil
                </TabsTrigger>
                <TabsTrigger className="w-full" value="activities">
                  Actividades
                </TabsTrigger>
              </TabsList>
              {/* PERFIL */}
              <TabsContent value="profile">
                <div className="p-6 flex flex-col items-center gap-6">
                  {/* IMAGEN DE PERFIL */}
                  <Card className="w-full relative flex flex-col items-center justify-center py-5 gap-4">
                    {/* BOTÓN EDITAR PERFIL EN LA ESQUINA SUPERIOR DERECHA */}
                    {usuario_logeado?.role === "admin" && (
                      <div className="absolute top-4 right-4">
                        <EditProfile />
                      </div>
                    )}

                    {/* CONTENIDO PRINCIPAL DE LA TARJETA */}
                    <Avatar className="w-28 h-28 shadow-xl cursor-pointer">
                      <AvatarImage
                        src={user?.photo}
                        alt="Perfil"
                        className="object-cover"
                        onClick={() => setIndex(0)}
                      />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <Lightbox
                      slides={[{ src: `${user?.photo}` }]}
                      index={index}
                      setIndex={setIndex}
                    />
                    <h2 className="text-2xl font-bold">
                      {user?.name} -{" "}
                      <span className="font-normal">{user?.rol}</span>
                    </h2>
                    {/* INFORMACIÓN DEL USUARIO */}
                    <p className="text-gray-500">{user?.email}</p>
                  </Card>
                  {/* DATOS GENERALES */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                      <h3 className="text-lg font-semibold">Edad</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {user?.age} años
                      </p>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                      <h3 className="text-lg font-semibold">Ubicación</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {user?.address}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                      <h3 className="text-lg font-semibold">Celular</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {user?.phone}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                      <h3 className="text-lg font-semibold">
                        {user?.placements ? "Colocaciones" : "Clientes"}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {user?.placements && <strong>{user.placements}</strong>}
                        {user?.clientes && <strong>{user.clientes}</strong>}
                        {!user?.clientes && !user?.placements && (
                          <strong>32</strong>
                        )}
                      </p>
                    </div>
                  </div>
                  {/* GRÁFICA DE VENTAS */}
                  <div className="w-full p-4 mt-4 ">
                    <AttendanceChart />
                  </div>
                </div>
              </TabsContent>
              {/* ACTIVIDADES */}
              <TabsContent value="activities">
                <ActivityList />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      {/* RIGHT SECTION */}
      <div className="w-full xl:w-1/3 flex flex-col gap-6">
        <Card>
          <CardContent className="mt-5">
            <EventCalendar />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
