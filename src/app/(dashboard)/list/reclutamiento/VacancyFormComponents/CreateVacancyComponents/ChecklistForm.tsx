import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompareChecklistForm } from "./CompareChecklistForm";

export const ChecklistForm = () => {
  return (
    <div className="min-w-full min-h-full">
      <Card className="">
        <CardContent className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto z-[90] mt-5">
          <div className="flex flex-col gap-2">
            <Label>Requisito 1</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Requisito 2</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Requisito 3</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Requisito 4</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Requisito 5</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Requisito 6</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Requisito 7</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Requisito 8</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Requisito 9</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Requisito 10</Label>
            <Input placeholder="Agregar Requisito" type="text" />
          </div>
        </CardContent>
      </Card>
      {/* <CompareChecklistForm /> */}
    </div>
  );
};
