import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(email: string | null | undefined): string {
  if (!email) return '??';
  
  // If it's an email, take the first part before @
  const name = email.split('@')[0];
  
  // Split by common separators and take first letter of each part
  const parts = name.split(/[._-]/);
  const initials = parts
    .map(part => part[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return initials || '??';
}