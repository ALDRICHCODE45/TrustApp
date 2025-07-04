"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <CardTitle className="mb-2">Algo salió mal</CardTitle>
        <CardDescription>
          Ocurrió un error al cargar el Dashboard Administrativo.
        </CardDescription>
        <CardFooter className="justify-center mt-6">
          <Button onClick={() => reset()}>Intentar de nuevo</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
