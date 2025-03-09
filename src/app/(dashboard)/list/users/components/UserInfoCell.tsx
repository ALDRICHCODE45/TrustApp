import { User } from "@/lib/data";
import { Row } from "@tanstack/react-table";
import Image from "next/image";

interface Props {
  row: Row<User>;
}

export const UserInfoCell = ({ row }: Props) => {
  const name = row.original.name;
  const email = row.original.email;
  const photo = row.original.photo;
  return (
    <div className="flex items-center gap-4">
      {/* Foto en un círculo */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden">
        <Image
          placeholder="blur" // Muestra una versión desenfocada mientras carga
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=="
          src={photo}
          alt={`${name}'s profile`}
          fill
          style={{ objectFit: "cover" }} // Mantiene la proporción y cubre el contenedor
        />
      </div>
      {/* Nombre y email uno debajo del otro */}
      <div className="flex flex-col">
        <span className="font-medium">{name}</span>
        <span className="text-sm text-gray-500">{email}</span>
      </div>
    </div>
  );
};
