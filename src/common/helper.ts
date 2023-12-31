export function evalOnce<T>(fn: () => T): () => T {
  let r: T;

  return () => {
    if (r === undefined) {
      r = fn();
    }

    return r;
  };
}

export function callOnce<T extends (...args: any) => void>(fn: T): T {
  let called = false;

  return ((...args: any) => {
    if (called) {
      return;
    }

    fn(...args);
  }) as T;
}
