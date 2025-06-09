import { redirect } from "next/navigation";

export default async function ConfigPage() {
  redirect("/config/leads");
}
