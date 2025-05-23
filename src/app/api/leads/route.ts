import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      include: {
        generadorLeads: true,
        origen: true,
        sector: true,
        contactos: {
          include: {
            interactions: {
              include: {
                autor: true,
                contacto: true,
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
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error al obtener los leads:', error);
    return NextResponse.json(
      { error: 'Error al obtener los leads' },
      { status: 500 }
    );
  }
} 