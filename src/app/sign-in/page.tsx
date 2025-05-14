import { auth } from "@/lib/auth";
import { LoginForm } from "../../components/login/login-form";
import { redirect } from "next/navigation";
import { unstable_noStore } from "next/cache";

export default async function LoginPage() {
  unstable_noStore();
  const session = await auth();

  if (session?.user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
