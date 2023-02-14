/* eslint-disable @typescript-eslint/ban-ts-comment */

/**
 * Debounces or throttles a function. Any new calls to the function will reset
 * the timer and the function will be called after the timer has elapsed.
 */
export default function debounce(func: (...args: any) => void, timeout = 10) {
  let timer: number;
  let time = Date.now();

  // If there is no timeout duration, just call the function
  if (timeout === 0) return func;

  return (...args: any) => {
    if (timer) clearTimeout(timer);

    time = Date.now();

    // @ts-ignore
    timer = setTimeout(() => {
      if (Date.now() - time > timeout) {
        // @ts-ignore
        func.apply(this, args);
      }
    }, timeout);
  };
}
