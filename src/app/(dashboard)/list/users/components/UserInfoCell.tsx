import { Row } from "@tanstack/react-table";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  row: Row<User>;
}

export const UserInfoCell = ({ row }: Props) => {
  const name = row.original.name;
  const email = row.original.email;
  const photo = row.original.image;

  return (
    <div className="flex items-center gap-4">
      {/* Avatar con mejor efecto de fondo */}
      <Avatar className="">
        <AvatarImage
          src={photo || undefined}
          alt={name}
          className="object-cover w-full h-full"
        />
        <AvatarFallback className="bg-gray-300 text-gray-700 font-semibold">
          {name ? name.slice(0, 2).toUpperCase() : "??"}
        </AvatarFallback>
      </Avatar>

      {/* Nombre y email */}
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-gray-500">{email}</span>
      </div>
    </div>
  );
};
