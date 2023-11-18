import { createContext } from "react";

interface DisableScrollContextValue {
  isDisabled: () => boolean;
  enableScroll: () => void;
  disableScroll: () => void;
}

export const DisableScrollContext = createContext<DisableScrollContextValue>({
  isDisabled: () => false,
  enableScroll: () => {},
  disableScroll: () => {},
});
