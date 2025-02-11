import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const CommentSheet = ({ comments }: { comments: string[] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          Comentarios
        </Button>
      </SheetTrigger>
      <SheetContent className="p-4">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-lg">Comentarios</SheetTitle>
        </SheetHeader>
        <div className="space-y-2">
          {comments.map((comentario, index) => (
            <Card key={index} className="shadow-sm">
              <CardHeader className="p-3">
                <h3 className="font-semibold text-sm">
                  Comentario {index + 1}
                </h3>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {comentario}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};
