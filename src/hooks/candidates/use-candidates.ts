import { useState, useEffect } from "react";
import {
  deleteCandidate,
  updateCandidate,
  createCandidate,
} from "@/actions/person/createCandidate";
import {
  getCandidates,
  seleccionarCandidato,
  deseleccionarCandidato,
} from "@/actions/vacantes/actions";
import { PersonWithRelations } from "@/app/(dashboard)/list/reclutamiento/components/FinalTernaSheet";
import { CreateCandidateFormData } from "@/zod/createCandidateSchema";
import { FileMetadata } from "@/hooks/use-file-upload";

/**
 * Hook personalizado optimizado para manejar candidatos de una vacante
 * Similar al hook useComments, proporciona un estado centralizado y acciones
 * para gestionar candidatos de manera eficiente
 *
 * @param vacancyId - ID opcional de la vacante. Si se proporciona, se obtienen los candidatos automáticamente
 * @returns Objeto con estado de candidatos y acciones para manipularlos
 */
export const useCandidates = (vacancyId?: string) => {
  const [candidates, setCandidates] = useState<PersonWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  /**
   * Obtiene la lista de candidatos de la vacante
   */
  const fetchCandidates = async () => {
    if (!vacancyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getCandidates({ vacancyId });
      if (!response.ok) {
        throw new Error(response.message || "Error al obtener candidatos");
      }
      setCandidates(response.candidates || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al obtener candidatos";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Crea un nuevo candidato y actualiza la lista local
   * @param candidateData - Datos del candidato a crear
   */
  const addCandidate = async (
    candidateData: CreateCandidateFormData & {
      cvFile?: File | FileMetadata | undefined;
    }
  ) => {
    if (!vacancyId) throw new Error("ID de vacante requerido");

    try {
      const response = await createCandidate(candidateData, vacancyId);

      if (!response.ok) {
        throw new Error(response.message || "Error al crear el candidato");
      }

      // obtener los candidatos actualizados
      await fetchCandidates();
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al crear el candidato";
      throw new Error(errorMessage);
    }
  };

  /**
   * Actualiza un candidato existente
   * @param candidateId - ID del candidato a actualizar
   * @param candidateData - Nuevos datos del candidato
   */
  const updateCandidateAction = async (
    candidateId: string,
    candidateData: CreateCandidateFormData
  ) => {
    try {
      const response = await updateCandidate(candidateId, candidateData);

      if (!response.ok) {
        throw new Error(response.message || "Error al actualizar candidato");
      }

      // Update the candidate in the local state
      if (response.person) {
        setCandidates((prevCandidates) =>
          prevCandidates.map((c) =>
            c.id === candidateId ? { ...c, ...response.person } : c
          )
        );
      }

      // obtener los candidatos actualizados
      await fetchCandidates();

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar candidato";
      throw new Error(errorMessage);
    }
  };

  /**
   * Elimina un candidato y actualiza la lista local
   * @param candidateId - ID del candidato a eliminar
   */
  const deleteCandidateAction = async (candidateId: string) => {
    try {
      const response = await deleteCandidate(candidateId);

      if (!response.ok) {
        throw new Error(response.message || "Error al eliminar candidato");
      }

      // Remove the candidate from the local state
      setCandidates((prevCandidates) =>
        prevCandidates.filter((c) => c.id !== candidateId)
      );

      // obtener los candidatos actualizados
      await fetchCandidates();

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al eliminar candidato";
      throw new Error(errorMessage);
    }
  };

  /**
   * Selecciona un candidato como contratado para la vacante
   * @param candidateId - ID del candidato a seleccionar
   */
  const selectCandidate = async (candidateId: string) => {
    if (!vacancyId) throw new Error("ID de vacante requerido");

    try {
      setIsSelecting(true);
      const response = await seleccionarCandidato(candidateId, vacancyId);

      if (!response.ok) {
        throw new Error(response.message || "Error al seleccionar candidato");
      }

      // obtener los candidatos actualizados
      await fetchCandidates();

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al seleccionar candidato";
      throw new Error(errorMessage);
    } finally {
      setIsSelecting(false);
    }
  };

  /**
   * Deselecciona el candidato contratado de la vacante
   */
  const deselectCandidate = async () => {
    if (!vacancyId) throw new Error("ID de vacante requerido");

    try {
      setIsSelecting(true);
      const response = await deseleccionarCandidato(vacancyId);

      if (!response.ok) {
        throw new Error(response.message || "Error al deseleccionar candidato");
      }

      // obtener los candidatos actualizados
      await fetchCandidates();

      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al deseleccionar candidato";
      throw new Error(errorMessage);
    } finally {
      setIsSelecting(false);
    }
  };

  // Auto-fetch candidates when vacancyId changes
  useEffect(() => {
    fetchCandidates();
  }, [vacancyId]);

  return {
    // Values
    candidates,
    isLoading,
    error,
    isSelecting,

    // Actions
    fetchCandidates,
    addCandidate,
    updateCandidateAction,
    deleteCandidateAction,
    selectCandidate,
    deselectCandidate,
  };
};
