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
  ChevronDown,
} from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Card } from "@/components/ui/card";
import { usuario_logeado } from "@/lib/data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export const ActionsCell = ({ row }: { row: any }) => {
  const teacherId = row.original.generadorLeads;
  const teacherName = row.original.generadorLeads;

  // Estado para controlar la visibilidad del diálogo y del dropdown
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Seleccionar Generador");

  const handleEditClick = () => {
    setIsMenuOpen(false); // Cierra el menú antes de abrir el diálogo
    setTimeout(() => setIsDialogOpen(true), 100); // Abre el diálogo después de un pequeño delay
  };

  const users = [
    { id: 1, name: "Francisco Flores" },
    { id: 2, name: "Aylin Perez" },
    { id: 3, name: "Ronaldo Perez" },
    { id: 4, name: "Sofia Martinez" },
    { id: 5, name: "Carlos Ruiz" },
    { id: 6, name: "Marta Lopez" },
  ];

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
          <DropdownMenuItem className="cursor-pointer">
            <Clipboard className="mr-2 h-4 w-4" />
            Copiar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleEditClick}
            className="cursor-pointer"
          >
            <SquarePen className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará
                  permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction onClick={() => console.log("eliminar")}>
                  Sí, eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
                <div className="">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="first-name"
                      className="flex gap-2 items-center"
                    >
                      <span>Empresa</span>
                    </Label>
                    <Input id="empresa" placeholder="Amazon" type="text" />
                  </div>
                </div>

                <div className="space-y-2">
                  {usuario_logeado.role === "admin" ? (
                    <>
                      <Label
                        htmlFor="generador"
                        className="text-sm font-medium flex items-center gap-2"
                      >
                        <User size={17} />
                        Generador
                      </Label>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full flex justify-between"
                          >
                            {selectedOption}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className="w-[200px] z-[999] bg-white dark:bg-black overflow-scroll max-h-[300px]"
                        >
                          <Card className="overflow-scroll h-[120px]">
                            {users.map((user) => (
                              <Button
                                key={user.id}
                                variant="ghost"
                                className="w-full text-left flex justify-start"
                                onClick={() => setSelectedOption(user.name)} // Cambiar opción seleccionada
                                type="button"
                              >
                                <User className="mr-2 h-4 w-4" />
                                <span>{user.name}</span>
                              </Button>
                            ))}
                          </Card>
                        </PopoverContent>
                      </Popover>
                    </>
                  ) : null}

                  {/* Label */}
                </div>
                <div className="flex flex-col gap-4 sm:flex-row pt-3">
                  <div className="flex-1 space-y-2">
                    <Label
                      htmlFor="first-name"
                      className="flex gap-2 items-center"
                    >
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

                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="last-name"
                    className="flex gap-2 items-center"
                  >
                    <span>Sector</span>
                  </Label>
                  <Input id="sector" placeholder="Tecnologia" type="text" />
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
                      className="flex gap-1 items-center"
                    >
                      <span>Status</span>
                    </Label>
                    <div className="">
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Status.." />
                        </SelectTrigger>
                        <SelectContent className="z-[999]">
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="apple">S.S</SelectItem>
                            <SelectItem value="banana">C.C</SelectItem>
                            <SelectItem value="contacto">Contacto</SelectItem>
                            <SelectItem value="blueberry">C.A</SelectItem>
                            <SelectItem value="grapes">C.V</SelectItem>
                            <SelectItem value="pineapple">Prospecto</SelectItem>
                            <SelectItem value="cliente">Cliente</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
