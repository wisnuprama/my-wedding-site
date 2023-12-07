export function evalOnce<T>(fn: () => T): () => T {
  let r: T;

  return () => {
    if (r === undefined) {
      r = fn();
    }

    return r;
  };
}

export function callOnce(fn: () => void): () => void {
  let called = false;

  return () => {
    if (called) {
      return;
    }

    fn();
  };
}
