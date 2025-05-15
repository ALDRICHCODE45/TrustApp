"use client";
import { changePasswordAction } from "@/actions/users/changePassword";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LockKeyhole, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
  userId: string;
}

interface StateResponse {
  ok: boolean;
  message: string;
}

export const ChangePassword = ({ userId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState<StateResponse | null>(null);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar u ocultar contraseña
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await changePasswordAction(userId, formData);
      if (!result.ok) {
        setState({ ok: false, message: result.message! });
        return;
      }
      setState({ ok: true, message: result.message! });
    } catch (err) {
      setState({ ok: false, message: "Error al cambiar la contraseña" });
    } finally {
      setIsLoading(false);
      setOpenDialog(false);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <LockKeyhole className="mr-2" />
          Cambiar contraseña
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col gap-0 overflow-y-scroll p-0 sm:max-w-lg [&>button:last-child]:top-3.5 max-h-[min(640px,80vh)]">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-border px-6 py-4 text-base">
            Cambiar contraseña
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Edita los datos de tu perfil.
        </DialogDescription>

        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <form noValidate className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <div className="mb-3">
                  <Label>Nueva contraseña</Label>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    required
                    minLength={6}
                    placeholder="••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {state?.ok && (
                <p className="mb-4 text-sm text-slate-700 text-center">
                  {state.message}
                </p>
              )}
              {!state?.ok && state?.message && (
                <p className="mb-4 text-red-500 text-sm text-center">
                  {state.message}
                </p>
              )}

              {/* Botones */}
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <span>Guardar cambios</span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
