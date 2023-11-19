import { useCallback, useLayoutEffect, useRef } from "react";

interface Callback<T extends (...args: any) => any> {
  (a: Parameters<T>): ReturnType<T>;
}

export function useStableCallback<T extends (...args: any) => any>(
  callback: T,
): T {
  const ref = useRef<T>(callback);

  useLayoutEffect(() => {
    ref.current = callback;
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    ((...args) => {
      return ref.current(...args);
    }) as T,
    [],
  );
}
