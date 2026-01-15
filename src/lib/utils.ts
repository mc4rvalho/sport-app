import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilitário padrão para combinar classes do Tailwind condicionalmente
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
