export const getDiffDays = (initialDate: Date) => {
  const lastDate = new Date(initialDate);
  const now = new Date();

  if (!(lastDate instanceof Date)) {
    throw new Error("La fecha de prospeccion debe ser valida");
  }

  // Calculamos la diferencia en milisegundos
  const diffInMs = now.getTime() - lastDate.getTime();

  // Convertimos la diferencia a días
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays;
};
