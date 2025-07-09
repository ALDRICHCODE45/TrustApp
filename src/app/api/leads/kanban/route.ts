import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { LeadStatus, Oficina } from "@prisma/client";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;

    // Parámetros de paginación
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status") as LeadStatus;

    // Parámetros de filtros
    const generadorId = searchParams.get("generadorId") || undefined;
    const oficina = searchParams.get("oficina") as Oficina | undefined;
    const searchTerm = searchParams.get("searchTerm") || undefined;
    const fechaDesde = searchParams.get("fechaDesde") || undefined;
    const fechaHasta = searchParams.get("fechaHasta") || undefined;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Construir filtros where
    const whereClause: any = {
      status: status,
    };

    if (generadorId) {
      whereClause.generadorId = generadorId;
    }

    if (oficina) {
      whereClause.generadorLeads = {
        Oficina: oficina,
      };
    }

    if (searchTerm) {
      whereClause.OR = [
        {
          empresa: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          sector: {
            nombre: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    if (fechaDesde || fechaHasta) {
      whereClause.createdAt = {};
      if (fechaDesde) {
        whereClause.createdAt.gte = new Date(fechaDesde);
      }
      if (fechaHasta) {
        whereClause.createdAt.lte = new Date(fechaHasta);
      }
    }

    // Calcular offset
    const offset = (page - 1) * limit;

    // Obtener leads con paginación
    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where: whereClause,
        include: {
          sector: true,
          origen: true,
          generadorLeads: true,
          SubSector: true,
          contactos: {
            include: {
              interactions: {
                include: {
                  contacto: true,
                  autor: true,
                  linkedTasks: true,
                },
              },
            },
          },
          statusHistory: {
            include: {
              changedBy: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: offset,
        take: limit,
      }),
      prisma.lead.count({
        where: whereClause,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Error fetching paginated leads:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
