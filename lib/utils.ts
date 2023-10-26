import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addYearPrefixToId(id: number) {
  const currentYear = new Date().getFullYear().toString()
  const paddedId = id.toString().padStart(4, '0')
  
  return `${currentYear}${paddedId}`
}
