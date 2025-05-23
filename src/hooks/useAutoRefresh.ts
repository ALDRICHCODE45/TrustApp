"use client";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useAutoRefresh(intervalMs: number = 30000) {
  const router = useRouter();

  const refreshData = useCallback(() => {
    // Forzar la actualización de los datos del servidor
    router.refresh();
  }, [router]);

  useEffect(() => {
    // Configurar el intervalo para actualizar automáticamente
    const interval = setInterval(refreshData, intervalMs);

    // También actualizar cuando la ventana recobre el foco
    const handleFocus = () => {
      refreshData();
    };

    // También actualizar cuando se detecta actividad en la página
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshData();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshData, intervalMs]);

  return { refreshData };
}
