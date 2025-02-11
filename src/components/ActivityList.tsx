"use client";
import { useState } from "react";
import { DataTable } from "./Table";
import { activityColumns } from "./columns/activityColumns";

export interface Activity {
  id: number;
  title: string;
  dueDate: string;
  description: string;
  completed: boolean;
}

export function ActivityList() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      title: "Finalizar proyecto de React",
      dueDate: "2025-02-15",
      description:
        "Completar la implementación del dashboard y los tests finales.",
      completed: false,
    },
    {
      id: 2,
      title: "Estudiar para el examen de matemáticas",
      dueDate: "2025-02-18",
      description: "Revisar álgebra, cálculo y geometría analítica.",
      completed: false,
    },
    {
      id: 3,
      title: "Entregar app",
      dueDate: "2025-02-18",
      description: "Revisar álgebra, cálculo y geometría analítica.",
      completed: false,
    },
    {
      id: 1,
      title: "Leer capítulo 5 de Física",
      dueDate: "2025-02-12",
      description: "Comprender los conceptos de dinámica y leyes de Newton.",
      completed: false,
    },
    {
      id: 2,
      title: "Practicar ejercicios de matemáticas",
      dueDate: "2025-02-14",
      description: "Resolver ecuaciones diferenciales y álgebra lineal.",
      completed: true,
    },
    {
      id: 3,
      title: "Entregar app",
      dueDate: "2025-02-18",
      description: "Revisar álgebra, cálculo y geometría analítica.",
      completed: false,
    },
    {
      id: 4,
      title: "Preparar exposición de historia",
      dueDate: "2025-02-20",
      description:
        "Investigar sobre la Revolución Francesa y elaborar diapositivas.",
      completed: false,
    },
    {
      id: 5,
      title: "Redactar ensayo de literatura",
      dueDate: "2025-02-22",
      description: "Analizar la obra 'Cien años de soledad' y su impacto.",
      completed: false,
    },
    {
      id: 6,
      title: "Estudiar para el examen de química",
      dueDate: "2025-02-25",
      description: "Revisar estructura molecular y tabla periódica.",
      completed: false,
    },
    {
      id: 7,
      title: "Finalizar proyecto de programación",
      dueDate: "2025-02-28",
      description: "Completar la interfaz de usuario y optimizar el backend.",
      completed: false,
    },
    {
      id: 8,
      title: "Revisar notas de biología",
      dueDate: "2025-03-02",
      description: "Estudiar ecosistemas y cadenas tróficas.",
      completed: true,
    },
    {
      id: 9,
      title: "Hacer práctica de estadística",
      dueDate: "2025-03-05",
      description:
        "Resolver problemas de distribución normal y regresión lineal.",
      completed: false,
    },
    {
      id: 10,
      title: "Organizar documentos",
      dueDate: "2025-03-07",
      description: "Clasificar notas y documentos importantes.",
      completed: true,
    },
    {
      id: 11,
      title: "Revisión de código",
      dueDate: "2025-03-10",
      description: "Corregir errores y mejorar la eficiencia del código.",
      completed: false,
    },
    {
      id: 12,
      title: "Terminar presentación de ciencias",
      dueDate: "2025-03-12",
      description: "Elaborar diapositivas sobre el cambio climático.",
      completed: false,
    },
    {
      id: 13,
      title: "Leer investigación de inteligencia artificial",
      dueDate: "2025-03-15",
      description:
        "Entender modelos de aprendizaje profundo y redes neuronales.",
      completed: true,
    },
    {
      id: 14,
      title: "Resolver problemas de física",
      dueDate: "2025-03-18",
      description: "Aplicar fórmulas de cinemática y dinámica.",
      completed: false,
    },
    {
      id: 15,
      title: "Revisar gramática para examen de inglés",
      dueDate: "2025-03-20",
      description: "Repasar tiempos verbales y estructuras condicionales.",
      completed: false,
    },
    {
      id: 16,
      title: "Actualizar portafolio web",
      dueDate: "2025-03-22",
      description: "Agregar proyectos recientes y mejorar diseño responsivo.",
      completed: false,
    },
    {
      id: 17,
      title: "Hacer reporte de laboratorio",
      dueDate: "2025-03-25",
      description: "Redactar conclusiones del experimento de química orgánica.",
      completed: false,
    },
    {
      id: 18,
      title: "Repasar historia contemporánea",
      dueDate: "2025-03-28",
      description: "Analizar la Segunda Guerra Mundial y sus consecuencias.",
      completed: false,
    },
    {
      id: 19,
      title: "Revisión de algoritmos",
      dueDate: "2025-03-30",
      description:
        "Optimizar y analizar la complejidad de algoritmos en Python.",
      completed: false,
    },
    {
      id: 20,
      title: "Preparar simulacro de entrevista técnica",
      dueDate: "2025-04-02",
      description:
        "Practicar preguntas sobre estructuras de datos y algoritmos.",
      completed: false,
    },
    {
      id: 21,
      title: "Resolver problemas de lógica",
      dueDate: "2025-04-05",
      description:
        "Ejercicios de razonamiento lógico y pensamiento computacional.",
      completed: false,
    },
  ]);

  return (
    <div className="flex flex-col gap-4">
      <DataTable data={activities} columns={activityColumns} />
    </div>
  );
}
