//This code defines a utility function cn that simplifies the process of conditionally combining multiple class names,
//merging conflicting Tailwind classes when necessary.
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
