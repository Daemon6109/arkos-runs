import { DebounceOptions } from './types';

export function debounce<F extends (...args: any[]) => void>(
  fn: F,
  wait: number,
  options: DebounceOptions = { leading: false, trailing: true }
): (...args: Parameters<F>) => void {
  let timeoutId: number | undefined;

  return function (...args: Parameters<F>) {
    const { leading = false, trailing = true } = options;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const shouldCallNow = leading && !timeoutId;
    const callAtEnd = trailing;

    if (shouldCallNow) {
      fn.apply(this, args);
      timeoutId = setTimeout(() => {
        timeoutId = undefined;
      }, wait);
    } else if (callAtEnd) {
      timeoutId = setTimeout(() => {
        fn.apply(this, args);
        timeoutId = undefined;
      }, wait);
    }
  };
}