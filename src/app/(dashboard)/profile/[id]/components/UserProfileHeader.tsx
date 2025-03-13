import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, usuario_logeado } from "@/lib/data";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox-lite";
import "yet-another-react-lightbox-lite/styles.css";
import { Badge } from "@/components/ui/badge";
import { EditUserProfile } from "@/app/(dashboard)/list/users/components/EditUserDropDown";
import { ActivityProfileSheet } from "@/app/(dashboard)/list/reclutamiento/components/ActivityProfileSheet";
import { UserInfoCard } from "@/app/(dashboard)/list/reclutamiento/components/UserInfoCard";

export const UserProfileHeader = ({ user }: { user: User }) => {
  const [index, setIndex] = useState<number>();
  const isAdmin = usuario_logeado?.role === "admin";
  const value = user?.placements || user?.clientes || 32;

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
                  <div className="flex gap-2 items-center">
                    <h2 className="text-2xl font-bold">{user?.name}</h2>

                    <Badge variant="outline" className="mt-1">
                      <p className="">{user?.oficina}</p>
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                {/* Actividades del usuario */}
                <ActivityProfileSheet user={user} />
              </div>
            </div>
          </div>

          {/* Tarjetas de información mejoradas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            <UserInfoCard title="Edad" value={user?.age} />
            <UserInfoCard title="Ubicación" value={user?.address} />
            <UserInfoCard title="Contacto" value={user?.phone} />
            <UserInfoCard
              title={user?.placements ? "Placements" : "Clientes"}
              value={value}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
