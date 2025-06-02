import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { leadId: string } }
) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { leadId } = params;

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el lead existe y pertenece al usuario
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        generadorId: session.user.id,
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead no encontrado" },
        { status: 404 }
      );
    }

    // Obtener los contactos del lead con sus interacciones
    const contactos = await prisma.person.findMany({
      where: {
        leadId: leadId,
      },
      include: {
        interactions: {
          include: {
            autor: true,
            contacto: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(contactos);
  } catch (error) {
    console.error("Error al obtener contactos:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 