"use server";
import { signIn } from "../lib/auth";

export async function authenticate(formData: FormData) {
  console.log({ formData });
  try {
    await signIn("credentials", formData);
    return "Success";
  } catch (error) {
    console.log(error);

    return "CredentialsSignin";
  }
}
