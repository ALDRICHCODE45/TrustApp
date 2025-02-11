import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Candidato } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { FileText, Mail } from "lucide-react";

export const FinalTernaSheet = ({
  ternaFinal,
}: {
  ternaFinal: Candidato[];
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Terna Final
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <SheetHeader className="mb-10"></SheetHeader>
        <div className="space-y-3">
          {ternaFinal.map((candidato, index) => (
            <Card
              key={index}
              className="shadow-sm rounded-lg p-4 bg-white dark:bg-gray-800"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {candidato.nombre}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {candidato.telefono}
                </p>
              </div>

              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400 ml-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <p>{candidato.correo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <a
                    href={candidato.cv}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Ver CV
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
