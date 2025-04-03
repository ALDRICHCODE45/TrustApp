"use client";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { Row } from "@tanstack/react-table";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface Props {
  row: Row<User>;
}

export const UserPasswordCell = ({ row }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  //const password = row.original.password;
  const password = "1233442109";

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowPassword(!showPassword)} // Alternar estado
      >
        {showPassword ? (
          <EyeOff /> // Ícono de ocultar
        ) : (
          <Eye /> // Ícono de mostrar
        )}
      </Button>

      {/* Contraseña (visible u oculta) */}
      <span className="font-mono text-sm">
        {showPassword ? password : "•".repeat(password.length)}
      </span>
    </div>
  );
};
