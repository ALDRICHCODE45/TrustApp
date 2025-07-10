import prisma from "@/lib/db";
import { KanbanBoardPage } from "../components/kanbanReclutadorBoard";
import { VacancyWithRelations } from "../components/ReclutadorColumns";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

const fetchVacancies = async (): Promise<VacancyWithRelations[]> => {
  const vacancies = await prisma.vacancy.findMany({
    include: {
      Comments: {
        include: {
          author: true,
        },
      },
      candidatoContratado: true,
      reclutador: true,
      cliente: true,
      ternaFinal: true,
    },
  });
  return vacancies;
};

export default async function KanbanReclutadorPage() {
  const vacancies = await fetchVacancies();
  const user_logged = await auth();
  if (!user_logged?.user) {
    redirect("/");
  }
  const user_logged_data = {
    name: user_logged.user.name,
    email: user_logged.user.email,
    role: user_logged.user.role as Role,
    image: user_logged.user.image || "",
  };
  return (
    <>
      <KanbanBoardPage
        initialVacantes={vacancies}
        user_logged={user_logged_data}
      />
    </>
  );
}
