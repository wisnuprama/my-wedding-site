const isPromise = (obj: any): obj is Promise<any> =>
  obj && typeof obj.then === "function";

export function withPerfTraceLog<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const r = fn();

  if (isPromise(r)) {
    r.finally(() => {
      console.info(`[Profiler] ${name} took ${performance.now() - start}ms`);
    });
  } else {
    console.info(`[Profiler] ${name} took ${performance.now() - start}ms`);
  }

  return r;
}
