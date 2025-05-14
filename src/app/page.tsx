import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

const Homepage = async () => {
  noStore();

  const session = await auth();
  if (!session) {
    redirect("/sign-in"); // 👈 Redirige directamente si no hay sesión
  }

  const user = session.user;

  switch (user.role) {
    case Role.reclutador:
      redirect("/reclutador");
    case Role.GL:
    case Role.MK:
      redirect("/leads");
    case Role.Admin:
      redirect("/admin");
    default:
      redirect("/sign-in");
  }
};

export default Homepage;
