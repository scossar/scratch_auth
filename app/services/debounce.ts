/**
 * <F extends (...args: any[]) => void> (F represents a function that can take
 * any arguments, and doesn't return anything. It's used to type the `func` parameter.)
 *
 * (...args: Parameters<F>) (Parameters<F> is a build in utility that extracts the parameter types from F)
 */

export default function debounce<F extends (...args: any[]) => void>(
  func: F,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<F>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}
