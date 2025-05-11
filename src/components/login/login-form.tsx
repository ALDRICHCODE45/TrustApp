"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  const credentialsAction = async (prevState: any, formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { error: "Error al iniciar sesión" };
      } else if (result?.ok) {
        router.push("/");
        return;
      }
    } catch (err) {
      return { error: "Error al iniciar sesión" };
    }
  };

  const [state, formAction, isPending] = useActionState(
    credentialsAction,
    undefined,
  );

  return (
    <form className="flex flex-col gap-6" action={formAction}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Ingresa a tu cuenta</h1>
        <p className="text-balance text-sm text-muted-foreground">
          A continuación proporciona tus datos
        </p>
      </div>
      <div className="grid gap-6">
        {state?.error && (
          <p className="text-red-500 text-sm text-center">{state.error}</p>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@ejemplo.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Contraseña</Label>
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="*********"
            required
          />
        </div>
        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Cargando...
            </>
          ) : (
            "Ingresar"
          )}
        </Button>
      </div>
    </form>
  );
}
