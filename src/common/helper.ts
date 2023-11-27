export function evalOnce<T>(fn: () => T): () => T {
  let r: T;

  return () => {
    if (r === undefined) {
      r = fn();
    }

    return r;
  };
}
