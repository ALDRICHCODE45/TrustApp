import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import prisma from "@/lib/db";
import { CreateNewOrigenForm } from "../../components/CreateNewOrigenForm";

const getAllOrigenes = async () => {
  try {
    const origenes = await prisma.leadOrigen.findMany();

    return origenes;
  } catch (err) {
    throw new Error("Erorr al cargar origenes");
  }
};

const LeadsPage = async () => {
  const origenes = await getAllOrigenes();

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configuración de Leads
        </h2>
        <p className="text-gray-600">
          Configure sus ajustes y preferencias de gestión de leads.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Orígenes
          </Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Todos los Origenes" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Origenes</SelectLabel>
                {origenes.map((origen) => (
                  <SelectItem key={origen.id} value={origen.id}>
                    {origen.nombre}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            Estos son los origenes existentes
          </p>
          <div className="mt-5">
            <CreateNewOrigenForm />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auto-assignment
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              Automatically assign new leads to available team members
            </label>
          </div>
        </div>

        <div className="pt-4">
          <button className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
            Update configuration
          </button>
        </div>
      </div>
    </div>
  );
};
export default LeadsPage;
