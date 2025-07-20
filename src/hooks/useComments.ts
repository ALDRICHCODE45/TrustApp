import { useState, useEffect } from "react";
import { CommentWithRelations, CreateCommentData } from "@/types/comment";

export const useComments = (vacancyId?: string) => {
  const [comments, setComments] = useState<CommentWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!vacancyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments?vacancyId=${vacancyId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al obtener comentarios");
      }

      if (!result.ok) {
        throw new Error(result.message || "Error al obtener comentarios");
      }

      setComments(result.comments);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al obtener comentarios";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addComment = async (commentData: CreateCommentData) => {
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al crear el comentario");
      }

      if (!result.ok) {
        throw new Error(result.message || "Error al crear el comentario");
      }

      // Agregar el nuevo comentario a la lista
      setComments((prev) => [result.comment, ...prev]);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el comentario";
      throw new Error(errorMessage);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments?commentId=${commentId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar el comentario");
      }

      if (!result.ok) {
        throw new Error(result.message || "Error al eliminar el comentario");
      }

      // Remover el comentario de la lista
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar el comentario";
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [vacancyId]);

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment,
  };
};
