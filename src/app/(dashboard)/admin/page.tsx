import { auth } from "@/lib/auth";
import { AdminPage } from "./components/AdminPage";
import { Role } from "@prisma/client";
import { checkRoleRedirect } from "../../helpers/checkRoleRedirect";

export default async function Dashboardpage() {
  const session = await auth();

  checkRoleRedirect(session?.user.role as Role, [Role.Admin]);

  return (
    <>
      <div>
        <AdminPage />
      </div>
    </>
  );
}
