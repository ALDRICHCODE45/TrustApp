import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    console.log("=== INICIO DEBUG INTERACCIONES API ===");
    const session = await auth();
    console.log("Session:", session?.user?.id);
    
    if (!session) {
      console.log("ERROR: No hay sesión");
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { leadId } = params;
    console.log("Lead ID recibido:", leadId);

    if (!leadId) {
      console.log("ERROR: Lead ID faltante");
      return NextResponse.json(
        { error: "Lead ID es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el lead existe (sin verificar usuario por ahora para debuggear)
    console.log("Buscando lead...");
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
      },
      include: {
        generadorLeads: true,
      },
    });

    console.log("Lead encontrado:", lead ? `${lead.empresa} - Generador: ${lead.generadorLeads.name}` : "No encontrado");

    if (!lead) {
      console.log("ERROR: Lead no encontrado");
      return NextResponse.json(
        { error: "Lead no encontrado" },
        { status: 404 }
      );
    }

    // Verificación de permisos (comentada temporalmente para debug)
    /*
    if (lead.generadorId !== session.user.id) {
      console.log("ERROR: Usuario no tiene permisos para este lead");
      return NextResponse.json(
        { error: "Sin permisos para este lead" },
        { status: 403 }
      );
    }
    */

    // Obtener todas las interacciones del lead
    console.log("Obteniendo interacciones...");
    const interacciones = await prisma.contactInteraction.findMany({
      where: {
        contacto: {
          leadId: leadId,
        },
      },
      include: {
        contacto: true,
        autor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`Interacciones encontradas: ${interacciones.length}`);
    console.log("=== FIN DEBUG INTERACCIONES API ===");

    return NextResponse.json(interacciones);
  } catch (error) {
    console.error("Error completo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error instanceof Error ? error.message : "Error desconocido" },
      { status: 500 }
    );
  }
} 