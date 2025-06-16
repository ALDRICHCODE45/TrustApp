import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("No autorizado", { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Error interno", { status: 500 });
  }
} 