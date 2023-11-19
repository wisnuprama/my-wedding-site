import { useLayoutEffect, useState } from "react";

/**
 * Use this when we want to render UI when the DOM is ready.
 * The reason is because between server and client the react result can be different.
 * @returns {boolean} display
 */
export function useClientRender(): boolean {
  const [display, setDisplay] = useState(false);
  useLayoutEffect(() => {
    setDisplay(true);
  }, []);

  return display;
}
