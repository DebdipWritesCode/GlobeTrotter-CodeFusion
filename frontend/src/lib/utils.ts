import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a number using Indian numbering system. By default, returns just the number string.
// Pass options like { style: 'currency', currency: 'INR' } to include symbol and currency formatting.
export function formatINR(value: number | string, options: Intl.NumberFormatOptions = { maximumFractionDigits: 2 }) {
  const num = typeof value === 'string' ? Number(value) : value
  if (Number.isNaN(Number(num)) || !Number.isFinite(Number(num))) return String(value)
  return new Intl.NumberFormat('en-IN', options).format(Number(num))
}
