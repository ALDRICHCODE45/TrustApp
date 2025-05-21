"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

type FormState = {
  error?: string;
  success?: boolean;
} | undefined;

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const credentialsAction = async (prevState: FormState, formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!validateEmail(email)) {
      return { error: "Por favor ingresa un email válido" };
    }

    if (password.length < 6) {
      return { error: "La contraseña debe tener al menos 6 caracteres" };
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { error: "Credenciales inválidas. Por favor intenta nuevamente" };
      } else if (result?.ok) {
        router.push("/");
        router.refresh();
        return { success: true };
      }
    } catch (err) {
      return { error: "Error al iniciar sesión. Por favor intenta más tarde" };
    }
  };

  const [state, formAction, isPending] = useActionState(
    credentialsAction,
    undefined
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
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm text-center">{state.error}</p>
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="m@ejemplo.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={!validateEmail(email) && email ? "border-red-500" : ""}
          />
          {!validateEmail(email) && email && (
            <p className="text-red-500 text-xs">Email inválido</p>
          )}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            {/* <Link 
              href="/recuperar-contraseña" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              ¿Olvidaste tu contraseña?
            </Link> */}
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="*********"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
          />
        </div>
        <Button 
          className="w-full" 
          disabled={isPending || !validateEmail(email) || password.length < 6} 
          type="submit"
        >
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
