"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ToastAlerts() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const error = searchParams.get("error");
  const ok = searchParams.get("ok");

  useEffect(() => {
    let hasToUpdateUrl = false;

    if (error === "unauthorized") {
      toast.error("No tienes autorización para acceder a esta página.");
      hasToUpdateUrl = true;
    }

    if (ok === "true") {
      toast.success("Bienvenido al sistema.");
      hasToUpdateUrl = true;
    }

    // Limpiar los parámetros del URL sin recargar la página
    if (hasToUpdateUrl) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("error");
      newParams.delete("ok");

      const pathWithoutParams = window.location.pathname;
      const newUrl =
        newParams.toString().length > 0
          ? `${pathWithoutParams}?${newParams.toString()}`
          : pathWithoutParams;

      router.replace(newUrl);
    }
  }, [error, ok]);

  return null;
}
