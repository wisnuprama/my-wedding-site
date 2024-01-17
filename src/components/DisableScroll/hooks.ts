import invariant from "invariant";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

function translateValueToOverflow(value: "enabled" | "disabled") {
  switch (value) {
    case "enabled":
      return "auto";
    case "disabled":
      return "hidden";
    default:
      return "auto";
  }
}

export function useDisableScroll(
  defaultValue: "enabled" | "disabled" = "enabled",
) {
  invariant(
    defaultValue === "disabled" || defaultValue === "enabled",
    "Invalid default value",
  );

  const initialValue = useRef(defaultValue);

  useLayoutEffect(() => {
    document.body.style.overflow = translateValueToOverflow(
      initialValue.current,
    );
  }, []);
}

export function useDisableScrollManager() {
  const disableScroll = useCallback(() => {
    document.body.style.overflow = "hidden";
  }, []);
  const enableScroll = useCallback(() => {
    document.body.style.overflow = "auto";
  }, []);
  const isDisabled = useCallback(() => {
    return document.body.style.overflow === "hidden";
  }, []);

  return useMemo(
    () => ({ disableScroll, enableScroll, isDisabled }),
    [disableScroll, enableScroll, isDisabled],
  );
}
