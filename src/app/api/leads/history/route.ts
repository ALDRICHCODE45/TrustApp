import { NextRequest, NextResponse } from "next/server";
import { LeadStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener parámetros de consulta
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Se requieren fechas de inicio y fin" },
        { status: 400 },
      );
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    // Asegurarnos que es el final del día para endDate
    parsedEndDate.setHours(23, 59, 59, 999);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return NextResponse.json(
        { error: "Formato de fecha inválido" },
        { status: 400 },
      );
    }

    // Obtener el historial de leads
    const leadsHistory = await getLeadsStatusInDateRange(
      parsedStartDate,
      parsedEndDate,
    );

    return NextResponse.json(leadsHistory);
  } catch (error) {
    console.error("Error al obtener historial de leads:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}

// Función para obtener el estado de los leads en un rango de fechas
async function getLeadsStatusInDateRange(startDate: Date, endDate: Date) {
  // Obtenemos todos los leads que existían antes o durante el periodo
  const existingLeads = await prisma.lead.findMany({
    where: {
      createdAt: {
        lte: endDate, // leads creados antes o hasta la fecha final
      },
    },
    select: {
      id: true,
      empresa: true,
      createdAt: true,
      generadorLeads: true,
    },
  });

  const leadStatusesInRange = [];

  // Para cada lead, buscar su estado en el rango de fechas
  for (const lead of existingLeads) {
    // Buscamos todos los cambios de estado dentro del rango
    const statusChangesInRange = await prisma.leadStatusHistory.findMany({
      where: {
        leadId: lead.id,
        changedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        changedAt: "asc",
      },
      include: {
        changedBy: true,
      },
    });

    // Si el lead no tuvo cambios dentro del rango, necesitamos encontrar su estado previo
    if (statusChangesInRange.length === 0) {
      // Buscar el último cambio antes del rango
      const statusBeforeRange = await prisma.leadStatusHistory.findFirst({
        where: {
          leadId: lead.id,
          changedAt: {
            lt: startDate,
          },
        },
        include: { changedBy: true },
        orderBy: {
          changedAt: "desc",
        },
      });

      // Si encontramos un estado previo o el lead existía antes del rango
      if (statusBeforeRange || lead.createdAt < startDate) {
        leadStatusesInRange.push({
          leadId: lead.id,
          empresa: lead.empresa,
          status: statusBeforeRange
            ? statusBeforeRange.status
            : ("Contacto" as LeadStatus),
          statusDate: startDate.toISOString(),
          type: "initialState",
          generador: statusBeforeRange?.changedBy.name,
        });
      }
      // Si el lead fue creado durante el rango pero no tuvo cambios
      else if (lead.createdAt >= startDate && lead.createdAt <= endDate) {
        leadStatusesInRange.push({
          leadId: lead.id,
          empresa: lead.empresa,
          status: "Contacto" as LeadStatus,
          statusDate: lead.createdAt.toISOString(),
          type: "created",
          generador: lead.generadorLeads.name,
        });
      }
    }
    // Si hubo cambios dentro del rango, los añadimos todos
    else {
      // Primero, si el lead existía antes del rango, añadimos su estado inicial
      if (lead.createdAt < startDate) {
        const statusBeforeRange = await prisma.leadStatusHistory.findFirst({
          where: {
            leadId: lead.id,
            changedAt: {
              lt: startDate,
            },
          },
          include: {
            changedBy: true,
          },
          orderBy: {
            changedAt: "desc",
          },
        });

        if (statusBeforeRange) {
          leadStatusesInRange.push({
            leadId: lead.id,
            empresa: lead.empresa,
            status: statusBeforeRange.status,
            statusDate: startDate.toISOString(),
            type: "initialState",
            generador: statusBeforeRange.changedBy.name,
          });
        }
      }

      // Luego añadimos todos los cambios dentro del rango
      statusChangesInRange.forEach((change) => {
        leadStatusesInRange.push({
          leadId: lead.id,
          empresa: lead.empresa,
          status: change.status,
          statusDate: change.changedAt.toISOString(),
          type: "statusChange",
          generador: change.changedBy,
        });
      });
    }
  }

  return leadStatusesInRange;
}
