import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, usuario_logeado } from "@/lib/data";
import { format } from "date-fns";
import { useState } from "react";
import { Activity } from "../page";
import { es } from "date-fns/locale";
import Lightbox from "yet-another-react-lightbox-lite";
import "yet-another-react-lightbox-lite/styles.css";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Calendar,
  CheckCircle,
  ClipboardList,
  Clock,
  MapPin,
  Phone,
  Plus,
  User as UserIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EditUserProfile } from "@/app/(dashboard)/list/users/components/EditUserDropDown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const UserProfileHeader = ({ user }: { user: User }) => {
  const [index, setIndex] = useState<number>();
  const isAdmin = usuario_logeado?.role === "admin";

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: "Finalizar proyecto de React",
      dueDate: "2025-02-15",
      description:
        "Completar la implementación del dashboard y los tests finales.",
      completed: false,
    },
    {
      id: 2,
      title: "Estudiar para el examen de matemáticas",
      dueDate: "2025-02-18",
      description: "Revisar álgebra, cálculo y geometría analítica.",
      completed: false,
    },
    {
      id: 3,
      title: "Entregar app",
      dueDate: "2025-02-18",
      description: "Revisar álgebra, cálculo y geometría analítica.",
      completed: false,
    },
    {
      id: 4,
      title: "Preparar exposición de historia",
      dueDate: "2025-02-20",
      description:
        "Investigar sobre la Revolución Francesa y elaborar diapositivas.",
      completed: false,
    },
    {
      id: 5,
      title: "Redactar ensayo de literatura",
      dueDate: "2025-02-22",
      description: "Analizar la obra 'Cien años de soledad' y su impacto.",
      completed: false,
    },
    {
      id: 6,
      title: "Estudiar para el examen de química",
      dueDate: "2025-02-25",
      description: "Revisar estructura molecular y tabla periódica.",
      completed: false,
    },
    {
      id: 7,
      title: "Finalizar proyecto de programación",
      dueDate: "2025-02-28",
      description: "Completar la interfaz de usuario y optimizar el backend.",
      completed: false,
    },
    {
      id: 8,
      title: "Revisar notas de biología",
      dueDate: "2025-03-02",
      description: "Estudiar ecosistemas y cadenas tróficas.",
      completed: true,
    },
    {
      id: 9,
      title: "Hacer práctica de estadística",
      dueDate: "2025-03-05",
      description:
        "Resolver problemas de distribución normal y regresión lineal.",
      completed: false,
    },
    {
      id: 10,
      title: "Organizar documentos",
      dueDate: "2025-03-07",
      description: "Clasificar notas y documentos importantes.",
      completed: true,
    },
  ]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM, yyyy", { locale: es });
  };

  // Función para cambiar el estado de una actividad
  const toggleActivityStatus = (id: number) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const pendingActivities = activities.filter(
    (activity) => !activity.completed
  );
  const completedActivities = activities.filter(
    (activity) => activity.completed
  );

  return (
    <Card className="mb-6 shadow-sm overflow-hidden">
      {/* Banner superior con diseño mejorado */}
      <div className="h-40 bg-gradient-to-r from-primary/20 to-primary/5 relative">
        {/* Opciones de edición para admin posicionadas en el banner */}
        {isAdmin && (
          <div className="absolute top-4 right-4">
            <EditUserProfile />
          </div>
        )}
      </div>

      <CardContent className="px-0 pt-0 pb-6 relative">
        <div className="px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Avatar con posición elevada sobre el banner */}
            <div className="relative -mt-16 flex justify-center lg:justify-start">
              <div className="relative">
                <Avatar
                  className="w-32 h-32 border-4 border-background shadow-md cursor-pointer"
                  onClick={() => setIndex(0)}
                >
                  <AvatarImage
                    src={user?.photo}
                    alt={user?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground text-3xl">
                    {user?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Badge className="absolute bottom-1 right-1 bg-primary">
                  {user?.rol}
                </Badge>
              </div>
              <Lightbox
                slides={[{ src: `${user?.photo}` }]}
                index={index}
                setIndex={setIndex}
              />
            </div>

            <div className="flex-1 mt-4  lg:-mt-10">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between bg-background/80 backdrop-blur-sm p-4 rounded-lg">
                <div>
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="mt-1">
                    <p className="">Oficina 2</p>
                  </Badge>
                </div>

                <div className="mt-4 md:mt-0">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <ClipboardList className="w-4 h-4" />
                        <span>Actividades</span>
                        {pendingActivities.length > 0 && (
                          <Badge variant="secondary">
                            {pendingActivities.length}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md md:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>Actividades de {user?.name}</SheetTitle>
                        <SheetDescription>
                          Gestiona las actividades y tareas pendientes.
                        </SheetDescription>
                      </SheetHeader>

                      <Tabs defaultValue="pending" className="mt-6">
                        <TabsList className="w-full grid grid-cols-2">
                          <TabsTrigger
                            value="pending"
                            className="text-xs md:text-base"
                          >
                            Pendientes ({pendingActivities.length})
                          </TabsTrigger>
                          <TabsTrigger
                            value="completed"
                            className="text-xs md:text-base"
                          >
                            Completadas ({completedActivities.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending" className="mt-4">
                          <ScrollArea className="h-80 rounded-md border p-2">
                            <div className="space-y-3">
                              {pendingActivities.length > 0 ? (
                                pendingActivities.map((activity) => (
                                  <Card
                                    key={activity.id}
                                    className="p-3 border-l-4 border-l-amber-400 hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="flex-1">
                                        <h4 className="font-medium">
                                          {activity.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                          {activity.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                          <Calendar className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-xs text-muted-foreground">
                                            {formatDate(activity.dueDate)}
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          toggleActivityStatus(activity.id)
                                        }
                                        className="h-8 w-8 rounded-full hover:bg-primary/10"
                                        title="Marcar como completada"
                                      >
                                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                                      </Button>
                                    </div>
                                  </Card>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center h-60 text-center">
                                  <CheckCircle className="h-10 w-10 text-primary/50 mb-2" />
                                  <p className="text-muted-foreground">
                                    No hay actividades pendientes
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>

                        <TabsContent value="completed" className="mt-4">
                          <ScrollArea className="h-80 rounded-md border p-2">
                            <div className="space-y-3">
                              {completedActivities.length > 0 ? (
                                completedActivities.map((activity) => (
                                  <Card
                                    key={activity.id}
                                    className="p-3 border-l-4 border-l-emerald-400 hover:bg-muted/50 transition-colors"
                                  >
                                    <div className="flex justify-between items-start gap-2">
                                      <div className="flex-1">
                                        <h4 className="font-medium line-through text-muted-foreground">
                                          {activity.title}
                                        </h4>
                                        <p className="text-sm text-muted-foreground/70 mt-1 line-through">
                                          {activity.description}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                          <Clock className="w-4 h-4 text-muted-foreground/70" />
                                          <span className="text-xs text-muted-foreground/70">
                                            Completada
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                          toggleActivityStatus(activity.id)
                                        }
                                        className="h-8 w-8 rounded-full hover:bg-primary/10"
                                        title="Deshacer completada"
                                      >
                                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                                      </Button>
                                    </div>
                                  </Card>
                                ))
                              ) : (
                                <div className="flex flex-col items-center justify-center h-60 text-center">
                                  <ClipboardList className="h-10 w-10 text-primary/50 mb-2" />
                                  <p className="text-muted-foreground">
                                    No hay actividades completadas
                                  </p>
                                </div>
                              )}
                            </div>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>

                      <SheetFooter className="flex flex-row justify-between items-center w-full mt-6">
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          <span className="text-xs md:text-base">
                            Agregar Actividad
                          </span>
                        </Button>

                        <SheetClose asChild>
                          <Button size="sm">
                            <span className="text-xs md:text-base">
                              Cancelar
                            </span>
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjetas de información mejoradas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            <Card className="border-t-2 border-t-primary/20 hover:border-t-primary transition-colors">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10 hidden md:block">
                    <UserIcon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">
                    Edad
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-lg font-bold">{user?.age} años</p>
              </CardContent>
            </Card>

            <Card className="border-t-2 border-t-primary/20 hover:border-t-primary transition-colors">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10 hidden md:block">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">
                    Ubicación
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-lg font-bold">{user?.address}</p>
              </CardContent>
            </Card>

            <Card className="border-t-2 border-t-primary/20 hover:border-t-primary transition-colors">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10 hidden md:block">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">
                    Contacto
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-lg font-bold">{user?.phone}</p>
              </CardContent>
            </Card>

            <Card className="border-t-2 border-t-primary/20 hover:border-t-primary transition-colors">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10 hidden md:block ">
                    <Briefcase className="w-5 h-5 text-primary " />
                  </div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">
                    {user?.placements ? "Colocaciones" : "Clientes"}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-lg font-bold">
                  {user?.placements && user.placements}
                  {user?.clientes && user.clientes}
                  {!user?.clientes && !user?.placements && "32"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
