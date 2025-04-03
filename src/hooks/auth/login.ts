"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const router = useRouter();

export const useCredentialsAction = async (
  prevState: any,
  formData: FormData,
) => {
  setLoading(true);
  setError(null);
  console.log(loading);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("loading", loading);
    if (result?.error) {
      setError("Credenciales incorrectas");
      return { error };
    } else if (result?.ok) {
      router.push("/admin");
      return;
    }
  } catch (err) {
    setError("Error al iniciar sesión");
  } finally {
    setLoading(false);
  }
};
