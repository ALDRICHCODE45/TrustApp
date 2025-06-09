//TODO: descomentar y ejecutar una vez en produccion bunx tsx prisma/update-timestamps.ts
// import prisma from "@/lib/db";
//
// async function updateExistingRecords() {
//   try {
//     const now = new Date();
//
//     const result = await prisma.leadOrigen.updateMany({
//       where: {
//         OR: [{ createdAt: null }, { updatedAt: null }],
//       },
//       data: {
//         createdAt: now,
//         updatedAt: now,
//       },
//     });
//
//     console.log(`✅ ${result.count} registros actualizados exitosamente`);
//   } catch (error) {
//     console.error("❌ Error:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
//
// updateExistingRecords();
