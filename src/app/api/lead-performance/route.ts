// app/api/lead-performance/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Lead, LeadStatusHistory } from "@prisma/client";
import { auth } from "@/lib/auth";

// Definición de tipos
type DateRangeOption = "year" | "quarter" | "month" | "lastYear";

interface PerformanceData {
  month: string;
  leads: number;
  clientes: number;
}

interface PerformanceStats {
  totalLeads: number;
  totalClientes: number;
  conversionRate: string;
}

interface ApiResponse {
  chartData: PerformanceData[];
  stats: PerformanceStats;
}

const prisma = new PrismaClient();

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Verificar autenticación
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener parámetros de la solicitud
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const dateRange = url.searchParams.get(
      "dateRange",
    ) as DateRangeOption | null;

    if (!userId || !dateRange) {
      return NextResponse.json(
        { error: "Se requieren los parámetros userId y dateRange" },
        { status: 400 },
      );
    }

    // Calcular fechas según el rango seleccionado
    const today = new Date();
    let startDate = new Date();

    switch (dateRange) {
      case "year":
        startDate = new Date(today.getFullYear(), 0, 1); // 1 de enero del año actual
        break;
      case "quarter":
        const currentQuarter = Math.floor(today.getMonth() / 3);
        startDate = new Date(today.getFullYear(), currentQuarter * 3, 1);
        break;
      case "month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "lastYear":
        startDate = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate(),
        );
        break;
      default:
        startDate = new Date(today.getFullYear(), 0, 1);
    }

    // Consultar el historial de cambios de estado para este usuario
    const leadStatusHistory: (LeadStatusHistory & { lead: Lead })[] =
      await prisma.leadStatusHistory.findMany({
        where: {
          changedById: userId,
          changedAt: {
            gte: startDate,
            lte: today,
          },
        },
        include: {
          lead: true,
        },
        orderBy: {
          changedAt: "asc",
        },
      });

    // Consultar todos los leads generados por este usuario en el período
    const leads: Lead[] = await prisma.lead.findMany({
      where: {
        generadorId: userId,
        createdAt: {
          gte: startDate,
          lte: today,
        },
      },
    });

    // Procesar datos según el rango de fecha seleccionado
    let chartData: PerformanceData[] = [];

    if (dateRange === "year") {
      // Datos mensuales
      chartData = Array.from({ length: 12 }, (_, i): PerformanceData => {
        const monthName = new Date(0, i).toLocaleString("es-ES", {
          month: "short",
        });

        // Contar leads creados en este mes
        const leadsInMonth = leads.filter((lead) => {
          const leadMonth = lead.createdAt.getMonth();
          return leadMonth === i;
        }).length;

        // Contar conversiones a cliente en este mes
        const clientesInMonth = leadStatusHistory.filter((history) => {
          const historyMonth = history.changedAt.getMonth();
          return historyMonth === i && history.status === "Cliente";
        }).length;

        return {
          month: monthName.charAt(0).toUpperCase() + monthName.slice(1, 3),
          leads: leadsInMonth,
          clientes: clientesInMonth,
        };
      });
    } else if (dateRange === "quarter") {
      // Datos semanales para el trimestre actual
      const currentQuarter = Math.floor(today.getMonth() / 3);
      const quarterStartMonth = currentQuarter * 3;

      // Crear un array para las semanas del trimestre (aproximadamente 13 semanas)
      chartData = Array.from({ length: 13 }, (_, i): PerformanceData => {
        const weekStart = new Date(
          today.getFullYear(),
          quarterStartMonth,
          1 + i * 7,
        );
        const weekEnd = new Date(
          today.getFullYear(),
          quarterStartMonth,
          7 + i * 7,
        );

        // Si la semana está en el futuro, no mostrar datos
        if (weekStart > today) {
          return {
            month: `Semana ${i + 1}`,
            leads: 0,
            clientes: 0,
          };
        }

        // Contar leads creados en esta semana
        const leadsInWeek = leads.filter((lead) => {
          return lead.createdAt >= weekStart && lead.createdAt <= weekEnd;
        }).length;

        // Contar conversiones a cliente en esta semana
        const clientesInWeek = leadStatusHistory.filter((history) => {
          return (
            history.changedAt >= weekStart &&
            history.changedAt <= weekEnd &&
            history.status === "Cliente"
          );
        }).length;

        return {
          month: `Semana ${i + 1}`,
          leads: leadsInWeek,
          clientes: clientesInWeek,
        };
      });
    } else if (dateRange === "month") {
      // Datos diarios para el mes actual
      const daysInMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
      ).getDate();

      chartData = Array.from(
        { length: daysInMonth },
        (_, i): PerformanceData => {
          const day = i + 1;
          const dayDate = new Date(today.getFullYear(), today.getMonth(), day);

          // Si el día está en el futuro, no mostrar datos
          if (dayDate > today) {
            return {
              month: `Día ${day}`,
              leads: 0,
              clientes: 0,
            };
          }

          // Contar leads creados en este día
          const leadsInDay = leads.filter((lead) => {
            const leadDay = lead.createdAt.getDate();
            const leadMonth = lead.createdAt.getMonth();
            return leadDay === day && leadMonth === today.getMonth();
          }).length;

          // Contar conversiones a cliente en este día
          const clientesInDay = leadStatusHistory.filter((history) => {
            const historyDay = history.changedAt.getDate();
            const historyMonth = history.changedAt.getMonth();
            return (
              historyDay === day &&
              historyMonth === today.getMonth() &&
              history.status === "Cliente"
            );
          }).length;

          return {
            month: `Día ${day}`,
            leads: leadsInDay,
            clientes: clientesInDay,
          };
        },
      );
    } else if (dateRange === "lastYear") {
      // Datos trimestrales para el último año
      chartData = Array.from({ length: 4 }, (_, i): PerformanceData => {
        const quarterStart = new Date(today.getFullYear() - 1, i * 3, 1);
        const quarterEnd = new Date(today.getFullYear() - 1, (i + 1) * 3, 0);

        // Contar leads creados en este trimestre
        const leadsInQuarter = leads.filter((lead) => {
          return lead.createdAt >= quarterStart && lead.createdAt <= quarterEnd;
        }).length;

        // Contar conversiones a cliente en este trimestre
        const clientesInQuarter = leadStatusHistory.filter((history) => {
          return (
            history.changedAt >= quarterStart &&
            history.changedAt <= quarterEnd &&
            history.status === "Cliente"
          );
        }).length;

        return {
          month: `Q${i + 1} ${today.getFullYear() - 1}`,
          leads: leadsInQuarter,
          clientes: clientesInQuarter,
        };
      });
    }

    // Calcular estadísticas adicionales
    const totalLeads = leads.length;
    const totalClientes = leadStatusHistory.filter(
      (h) => h.status === "Cliente",
    ).length;
    const conversionRate =
      totalLeads > 0 ? (totalClientes / totalLeads) * 100 : 0;

    const response: ApiResponse = {
      chartData,
      stats: {
        totalLeads,
        totalClientes,
        conversionRate: conversionRate.toFixed(2),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error en la API de rendimiento de leads:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 },
    );
  }
}
