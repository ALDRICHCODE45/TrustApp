"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  MoreHorizontal,
  Clipboard,
  SquarePen,
  Trash2,
  User,
  Building2,
  BriefcaseBusiness,
  Globe,
  Contact,
  UserPen,
  GitCommitVertical,
  ChevronDown,
} from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";

export const ActionsCell = ({ row }: { row: any }) => {
  const teacherId = row.original.generadorLeads;
  const teacherName = row.original.generadorLeads;

  // Estado para controlar la visibilidad del diálogo y del dropdown
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCopyTeacherId = (id: string, name: string) => {
    navigator.clipboard.writeText(id);
    console.log(`Copied ID: ${id} (${name})`);
  };

  const handleEditClick = () => {
    setIsMenuOpen(false); // Cierra el menú antes de abrir el diálogo
    setTimeout(() => setIsDialogOpen(true), 100); // Abre el diálogo después de un pequeño delay
  };

  return (
    <>
      {/* Dropdown Menu */}
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-40" align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => handleCopyTeacherId(teacherId, teacherName)}
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Copiar usuario
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleEditClick}
            className="cursor-pointer"
          >
            <SquarePen className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo de edición */}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* TooltipProvider envuelve todo el componente */}
        <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="border-b border-border px-6 py-4 text-base">
              Editar
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            Realiza los cambios a tu prospeccion en este apartado
          </DialogDescription>
          <div className="overflow-y-auto">
            <div className="px-6 pb-6 pt-4">
              <form className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="first-name"
                      className="flex gap-2 items-center"
                    >
                      <Building2 size={17} />
                      <span>Empresa</span>
                    </Label>
                    <Input id="empresa" placeholder="Amazon" type="text" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="last-name"
                      className="flex gap-2 items-center"
                    >
                      <BriefcaseBusiness size={17} />
                      <span>Sector</span>
                    </Label>
                    <Input id="sector" placeholder="Tecnologia" type="text" />
                  </div>
                </div>

                <div className="space-y-2">
                  {/* Label */}
                  <Label
                    htmlFor="generador"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Generador
                  </Label>

                  {/* Input con Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        {/* Input personalizado */}
                        <Input
                          id="generador"
                          placeholder="Selecciona un generador"
                          className="pr-10 bg-white dark:bg-black text-black dark:text-white   focus:border-primary dark:focus:border-primary focus:ring-primary dark:focus:ring-primary rounded-md"
                        />
                        {/* Flecha para abrir el Popover */}
                        <button
                          type="button"
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          aria-label="Abrir opciones de generador"
                        >
                          <ChevronDown size={16} />
                        </button>
                      </div>
                    </PopoverTrigger>

                    {/* Contenido del Popover */}
                    <PopoverContent
                      className="w-64 max-h-48 overflow-y-auto bg-white dark:bg-black text-gray-800 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg rounded-md p-4 space-y-2 mt-1"
                      align="start" // Alinea el Popover al inicio (final del input)
                      sideOffset={4} // Ajusta la distancia entre el Popover y el input
                    >
                      {/* Título */}
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Selecciona un generador:
                      </div>

                      {/* Lista de usuarios */}
                      <div className="space-y-1">
                        {[
                          "John Doe",
                          "Jane Smith",
                          "Alice Johnson",
                          "Bob Brown",
                          "Charlie Davis",
                        ].map((user, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          >
                            <span className="text-sm">{user}</span>
                            <User
                              size={16}
                              className="text-gray-400 dark:text-gray-500"
                            />
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row pt-3">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="first-name"
                      className="flex gap-2 items-center"
                    >
                      <Globe size={17} />
                      <span>Pagina Web</span>
                    </Label>
                    <Input id="web" placeholder="https://..." type="text" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="last-name"
                      className="flex gap-2 items-center"
                    >
                      <span>Fecha De Prospeccion</span>
                    </Label>
                    <Input
                      id="prospeccion"
                      placeholder="12/12/25"
                      type="date"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row pt-3">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex gap-2 items-center"
                    >
                      <Contact size={17} />
                      <span>Contacto</span>
                    </Label>
                    <div className="flex rounded-lg shadow-sm shadow-black/5">
                      <Input
                        id="Contacto"
                        placeholder="+52 55..."
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex gap-2 items-center"
                    >
                      <UserPen size={17} />
                      <span>Posicion</span>
                    </Label>
                    <div className="flex rounded-lg shadow-sm shadow-black/5">
                      <Input
                        id="posicion"
                        placeholder="Software Developer"
                        type="text"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row pt-3">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex gap-2 items-center"
                    >
                      <span>Fecha De Coneccion</span>
                    </Label>
                    <div className="flex rounded-lg shadow-sm shadow-black/5">
                      <Input
                        id="coneccion"
                        placeholder="12/12/25"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex gap-2 items-center"
                    >
                      <GitCommitVertical size={17} />
                      <span>State</span>
                    </Label>
                    <div className="flex rounded-lg shadow-sm shadow-black/5">
                      <Input id="Estado" placeholder="Contacto" type="text" />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <DialogFooter className="border-t border-border px-6 py-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button">Guardar Cambios</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
