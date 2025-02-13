import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cliente } from "@/lib/data";
import { BriefcaseBusiness, Mail, Smartphone, Users } from "lucide-react";
import { useState } from "react";

export function ContactosSheet({
  contactos,
}: {
  contactos: Cliente["contactos"];
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Users />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Lista de Contactos</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {contactos.map((contacto, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{contacto.nombre}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness size={15} />
                  <p className=" text-gray-600 dark:text-gray-300">
                    {contacto.puesto}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={15} />
                  <p className="text-gray-600 dark:text-gray-300">
                    {contacto.correo}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Smartphone size={15} />
                  <p className="text-gray-600 dark:text-gray-300">
                    {contacto.celular}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
