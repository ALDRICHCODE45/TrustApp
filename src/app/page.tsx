import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";

const Homepage = async () => {
  const session = await auth();
  const user = session?.user;

  switch (user?.role) {
    case Role.reclutador:
      redirect("/reclutador?ok=true");
      break;
    case Role.GL:
      redirect("/leads?ok=true");
      break;
    case Role.MK:
      redirect("/leads?ok=true");
      break;
    case Role.Admin:
      redirect("/admin?ok=true");
  }

  return redirect("/sign-in");
};

export default Homepage;
