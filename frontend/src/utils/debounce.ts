/**
 * Creates a debounce function that delays the calling of a function until after a delay.
 *
 * @param func - The function to debounce.
 * @param delay - The delay in milliseconds.
 * @returns A debounced function that will call the original function after the delay.
 */
// Note: `any[]` is necessary here for the the generic function constraint.
// TS doesn't have a built-in type that means "any function signature", and unknown[] and
// never[] are too restrictive.
// The any[] is only in the constraint, not in the implementation. The actual parameter
// types are preserved through Parameters<T>, so type safety is maintained at the call site.

//  eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
