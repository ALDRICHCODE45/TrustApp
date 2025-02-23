import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MessageCircleMore } from "lucide-react";

export const CommentSheet = ({ comments }: { comments: string[] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <MessageCircleMore />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-lg">Comentarios</SheetTitle>
        </SheetHeader>
        <div className="space-y-2">
          {comments.map((comentario, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="p-3 flex flex-row justify-between items-center">
                <p className="font-semibold">Comentario {index + 1}</p>
                <p className="">12/23/25</p>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {comentario}
                </p>
              </CardContent>
              <CardFooter className="p-3 text-sm text-gray-400">
                <p>By: Angela Flores</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
