"use client";
import {
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetDescription,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { VacancyWithRelations } from "../../components/ReclutadorColumns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  vacante: VacancyWithRelations;
}

export const VacancyDetailsChecklist = ({ vacante }: Props) => {
  return (
    <SheetContent className="z-[9999]">
      <SheetHeader>
        <SheetTitle>Checklist</SheetTitle>
        <SheetDescription>
          Realiza los cambios necesarios en el checklist de la vacante.
        </SheetDescription>
      </SheetHeader>
      <div className="grid flex-1 auto-rows-min gap-6 px-4">
        <div className="grid gap-3">
          <Label htmlFor="sheet-demo-name">Nombre</Label>
          <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
        </div>
        <div className="grid gap-3">
          <div className="*:not-first:mt-2">
            <Label>Descripción</Label>
            <div className="flex rounded-md shadow-xs">
              <span className="border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm">
                https://
              </span>
              <Input
                className="-ms-px rounded-s-none shadow-none"
                placeholder="google.com"
                type="text"
              />
            </div>
          </div>
        </div>
      </div>
      <SheetFooter>
        <Button type="submit">Save changes</Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};
