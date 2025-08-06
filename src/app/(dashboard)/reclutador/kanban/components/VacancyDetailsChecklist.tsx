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
      <SheetHeader className="pb-4">
        <SheetTitle>Checklist</SheetTitle>
        <SheetDescription>Requisitos para la vacante.</SheetDescription>
      </SheetHeader>
      <div className="grid flex-1 auto-rows-min gap-6 px-4 max-h-[70vh] overflow-y-auto">
        <div className="grid gap-3">
          <Label>Requisito 1</Label>
          <Input placeholder="Ej: Excel" type="text" />
        </div>
        <div className="grid gap-3">
          <Label>Requisito 2</Label>
          <Input placeholder="Ej: Power BI" type="text" />
        </div>
        <div className="grid gap-3">
          <Label>Requisito 3</Label>
          <Input placeholder="Ej: Visual Studio Code" type="text" />
        </div>
        <div className="grid gap-3">
          <Label>Requisito 4</Label>
          <Input placeholder="Ej: Power Point" type="text" />
        </div>

        <div className="grid gap-3">
          <Label>Requisito 5</Label>
          <Input placeholder="Ej: PowerPoint" type="text" />
        </div>

        <div className="grid gap-3">
          <Label>Requisito 6</Label>
          <Input placeholder="Ej: PowerPoint" type="text" />
        </div>

        <div className="grid gap-3">
          <Label>Requisito 7</Label>
          <Input placeholder="Ej: PowerPoint" type="text" />
        </div>

        <div className="grid gap-3">
          <Label>Requisito 8</Label>
          <Input placeholder="Ej: PowerPoint" type="text" />
        </div>

        <div className="grid gap-3">
          <Label>Requisito 9</Label>
          <Input placeholder="Ej: PowerPoint" type="text" />
        </div>

        <div className="grid gap-3">
          <Label>Requisito 10</Label>
          <Input placeholder="Ej: PowerPoint" type="text" />
        </div>
      </div>
      <SheetFooter className="mt-4">
        <Button type="submit">Save changes</Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
};
