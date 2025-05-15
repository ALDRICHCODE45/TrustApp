import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { unstable_noStore } from "next/cache";

const Homepage = async () => {
  unstable_noStore();

  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  const user = session.user;

  switch (user.role) {
    case Role.reclutador:
      redirect("/reclutador");
    case Role.GL:
      redirect("/leads");
    case Role.MK:
      redirect("/leads");
    case Role.Admin:
      redirect("/admin");
    default:
      redirect("/sign-in");
  }
};

export default Homepage;
