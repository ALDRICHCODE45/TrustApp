import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Role } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";

const Homepage = async () => {
  noStore();

  const session = await auth();
  const user = session?.user;

  switch (user?.role) {
    case Role.reclutador:
      redirect("/reclutador?ok=true");
    case Role.GL:
      redirect("/leads?ok=true");
    case Role.MK:
      redirect("/leads?ok=true");
    case Role.Admin:
      redirect("/admin?ok=true");
  }

  return redirect("/sign-in");
};

export default Homepage;
