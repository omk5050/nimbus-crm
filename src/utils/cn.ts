type ClassValue = string | number | boolean | null | undefined;

/**
 * Combines conditional class names into one string, skipping falsy
 * values. Deliberately dependency-free (no clsx/tailwind-merge) to
 * stay inside the approved tech stack — good enough for a design
 * system where components rarely need to override each other's
 * utility classes.
 *
 *   cn('px-4 py-2', isActive && 'bg-accent', disabled && 'opacity-50')
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
