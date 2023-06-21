import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function to efficiently merge Tailwind CSS & normal classes without style conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
