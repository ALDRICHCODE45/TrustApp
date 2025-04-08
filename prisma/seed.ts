import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminExists = await prisma.user.findFirst({ where: { role: "Admin" } });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("aldrich123", 10);
    await prisma.user.create({
      data: {
        age: 45,
        celular: "554335662",
        direccion: "Av Siempre viva, Reforma, lote 11, senecio 130",
        Oficina: "Oficina1",
        name: "Salvador",
        email: "admin@empresa.com",
        password: hashedPassword,
        role: "Admin",
      },
    });
    console.log("Usuario administrador creado.");
  } else {
    console.log("Ya existe un usuario administrador.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
