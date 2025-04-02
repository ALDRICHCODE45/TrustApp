import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "../../components/login/login-form";

export default async function LoginPage() {
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
