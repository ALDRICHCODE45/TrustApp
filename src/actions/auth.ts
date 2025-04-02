"use server";
import { signIn } from "@/lib/auth";

export async function authenticate(prevState: any, formData: FormData) {
  // Asegura que el return es del tipo correcto
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return "CredentialsSignin";
  }

  try {
    await signIn("credentials", {
      email: email,
      password: password,
    });

    return "Success";
  } catch (e) {
    console.log(e);

    return "CredentialsSignin";
  }
}
