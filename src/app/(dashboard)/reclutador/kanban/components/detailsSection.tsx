"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building,
  CalendarIcon,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";
import { Role } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { VacancyWithRelations } from "../../components/ReclutadorColumns";
import {
  calculateDaysFromAssignment,
  calculateDaysToDelivery,
  getDaysDifference,
  getProgressColor,
  getProgressPercentage,
  getTipoColor,
} from "../../components/kanbanReclutadorBoard";

interface DetailsSectionProps {
  vacante: VacancyWithRelations;
  user_logged: {
    name: string;
    email: string;
    role: Role;
    image: string;
  };
}

export const DetailsSectionReclutador = ({
  vacante,
  user_logged,
}: DetailsSectionProps) => {
  return (
    <div className="space-y-6 mt-4">
      <div className="bg-muted/30 p-4 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={vacante.reclutador?.image || ""}
                alt={vacante.reclutador?.name || "Reclutador"}
                className="w-full h-full object-cover"
              />
              <AvatarFallback>
                {vacante.reclutador?.name?.charAt(0) || "R"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">
                Reclutador asignado
              </p>
              <p className="font-normal text-md text-gray-700 dark:text-muted-foreground">
                {vacante.reclutador?.name || "Sin reclutador"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge className={getTipoColor(vacante.tipo)}>{vacante.tipo}</Badge>
            <Badge variant="outline">
              {vacante.cliente?.cuenta || "Sin cliente"}
            </Badge>
          </div>
        </div>
        {/* Información de cliente y tiempos */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3 space-y-3">
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Cliente:</span>
              <span className="ml-2 font-normal text-md text-gray-700 dark:text-muted-foreground">
                {vacante.cliente?.cuenta || "Sin cliente"}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Fecha entrega:
              </span>
              <span className="ml-2 font-normal text-md text-gray-700 dark:text-muted-foreground ">
                {vacante?.fechaEntrega
                  ? format(vacante.fechaEntrega, "EE, dd MMMM yyyy", {
                      locale: es,
                    })
                  : "Sin fecha"}
              </span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Fecha asignación:
              </span>
              <span className="ml-2 font-normal text-md text-gray-700 dark:text-muted-foreground">
                {vacante.fechaAsignacion
                  ? format(vacante.fechaAsignacion, "EE, dd MMMM yyyy", {
                      locale: es,
                    })
                  : "Sin fecha"}
              </span>
            </div>
          </div>
          <div className="col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    Tiempo transcurrido:
                  </span>
                  <span className="font-normal text-xs text-gray-700 dark:text-muted-foreground">
                    (Placement)
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-6 px-2">
                <span className="font-normal text-md text-gray-700 dark:text-muted-foreground">
                  {calculateDaysFromAssignment(vacante.fechaAsignacion)} días
                </span>
              </Button>
            </div>
            <div className="pt-2">
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getProgressColor(
                    calculateDaysToDelivery(vacante.fechaEntrega)
                  )}`}
                  style={{
                    width: `${getProgressPercentage(
                      vacante.fechaAsignacion,
                      vacante.fechaEntrega
                    )}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>
                  {getDaysDifference(
                    vacante.fechaAsignacion,
                    vacante.fechaEntrega
                  )}
                  d
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Información financiera */}
      <div>
        <h4 className="text-sm font-medium uppercase text-muted-foreground mb-3 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Información financiera
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <Card className="overflow-hidden">
            <div className="h-1 bg-blue-500"></div>
            <CardContent className="pt-4">
              <div className="text-sm text-muted-foreground">Salario</div>
              <div className="text-2xl font-semibold mt-1">
                $
                {vacante.salario?.toLocaleString() || (
                  <span className="">N/A</span>
                )}
              </div>
            </CardContent>
          </Card>
          {user_logged.role === Role.Admin && (
            <>
              <Card className="overflow-hidden">
                <div className="h-1 bg-purple-500"></div>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">Fee</div>
                  <div className="text-2xl font-semibold mt-1">
                    {vacante.fee || "N/A"}%
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="h-1 bg-green-500"></div>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">
                    Valor factura
                  </div>
                  <div className="text-2xl font-semibold mt-1">
                    ${vacante.valorFactura?.toLocaleString() || "N/A"}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      {/* Candidato contratado (condicional) */}
      {vacante.candidatoContratado && (
        <Card className="overflow-hidden border-green-200 dark:border-green-800">
          <div className="h-1 bg-green-500"></div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Candidato contratado</h4>
                  <p className="text-muted-foreground text-sm flex justify-center gap-2 items-center">
                    {vacante.candidatoContratado.name} -{" "}
                    {vacante.candidatoContratado.email}
                  </p>
                </div>
              </div>
              <a
                href={vacante.candidatoContratado.cv?.url || ""}
                target="_blank"
              >
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Ver CV
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
