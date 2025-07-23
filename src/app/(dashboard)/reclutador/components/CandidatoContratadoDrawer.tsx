"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerDescription,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { PersonWithRelations } from "../../list/reclutamiento/components/FinalTernaSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserX, User, Mail, Phone, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  candidatoContratado?: PersonWithRelations;
}

export const CandidatoContratadoDrawer = ({ candidatoContratado }: Props) => {
  if (!candidatoContratado?.name) {
    return (
      <Button variant="outline" className="w-[70%] justify-center gap-2">
        <UserX className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[70%] justify-start gap-2">
          <User className="h-4 w-4" />
          <span className="truncate">{candidatoContratado.name}</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-2xl font-semibold text-center">
              {candidatoContratado.name}
            </DrawerTitle>
            <DrawerDescription className="text-center">
              Información del candidato contratado
            </DrawerDescription>
            <Separator />
          </DrawerHeader>

          <div className="px-4 pb-4">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Datos del Candidato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Información de contacto */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-medium">Email</span>
                      <span className="text-sm text-muted-foreground truncate">
                        {candidatoContratado.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Teléfono</span>
                      <span className="text-sm text-muted-foreground">
                        {candidatoContratado.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CV Section */}
                {candidatoContratado.cv && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm font-medium">
                            Currículum
                          </span>
                          <span className="text-sm text-muted-foreground truncate">
                            {candidatoContratado.cv.name}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={candidatoContratado.cv.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Ver Currículum
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cerrar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
