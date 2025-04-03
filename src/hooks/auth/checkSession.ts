import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const checkSession = async (path: string = "/login") => {
  const session = await auth();

  if (!session) {
    redirect(path);
  }
  return session;
};
