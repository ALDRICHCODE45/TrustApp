import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  const sectores = [
    "Tecnología",
    "Manufactura",
    "Logística",
    "Salud",
    "Finanzas",
    "Educación",
    "Retail",
    "Agroindustria",
    "Energía",
    "Construcción",
    "Turismo y Hospitalidad",
    "Transporte",
    "Bienes Raíces",
    "Alimentación y Bebidas",
    "Legal",
    "Entretenimiento y Medios",
    "Marketing y Publicidad",
    "Gobierno",
    "Telecomunicaciones",
    "Minería",
    "Automotriz",
    "Moda y Textil",
    "Recursos Humanos",
    "Consultoría",
    "ONG / Sector Social",
  ];

  const origenes = [
    "LinkedIn",
    "Marketing",
    "Referenciado",
    "Cold Email",
    "Evento",
    "Página Web",
    "Llamada en Frío",
    "ChatBot",
    "WhatsApp",
    "Orgánico",
    "Publicidad en redes sociales",
    "Google Ads",
    "Campaña de Email",
    "Webinar",
    "Landing Page",
    "YouTube",
    "Podcast",
    "Ferias Comerciales",
    "Networking presencial",
    "Telegram",
    "Discord",
    "Recomendación interna",
    "Newsletter",
    "Instagram",
    "TikTok",
  ];

  await Promise.all(
    sectores.map((nombre) =>
      prisma.sector.upsert({
        where: { nombre },
        update: {},
        create: { nombre },
      }),
    ),
  );

  await Promise.all(
    origenes.map((nombre) =>
      prisma.leadOrigen.upsert({
        where: { nombre },
        update: {},
        create: { nombre },
      }),
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
