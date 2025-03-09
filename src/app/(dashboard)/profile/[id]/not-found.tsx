import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <CardTitle className="mb-2">Página no encontrada</CardTitle>
        <CardDescription>
          No pudimos encontrar la página que buscas.
        </CardDescription>
        <CardFooter className="justify-center mt-6">
          <Button variant="outline" asChild>
            <Link href="/list/users">Volver al listado</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
