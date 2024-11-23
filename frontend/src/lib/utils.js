import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function isMobileDevice() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches
  );
}
