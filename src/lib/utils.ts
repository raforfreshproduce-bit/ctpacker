import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert snake_case keys to camelCase recursively
export function snakeToCamel(s: string) {
  return s.replace(/[_-](\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export function mapKeysToCamel(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(mapKeysToCamel)
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [snakeToCamel(k), mapKeysToCamel(v)])
    )
  }
  return obj
}
