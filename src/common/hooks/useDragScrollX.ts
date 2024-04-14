import invariant from "invariant";
import { useLayoutEffect, useRef } from "react";

export function useDragScrollX() {
  const mouseDown = useRef(false);
  const slider = useRef<HTMLDivElement>(null);

  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startDragging = (e: MouseEvent) => {
    const elem = slider.current;
    invariant(elem, "Slider is null, need to bind it to an element");

    mouseDown.current = true;
    startX.current = e.pageX - elem.offsetLeft;
    scrollLeft.current = elem.scrollLeft;
  };

  const stopDragging = () => {
    mouseDown.current = false;
  };

  const move = (e: MouseEvent) => {
    e.preventDefault();
    if (!mouseDown.current) {
      return;
    }

    const elem = slider.current;
    invariant(elem, "Slider is null, need to bind it to an element");

    const x = e.pageX - elem.offsetLeft;
    const scroll = x - startX.current;

    elem.scrollLeft = scrollLeft.current - scroll;
  };

  useLayoutEffect(() => {
    const elem = slider.current;
    invariant(elem, "Slider is null, need to bind it to an element");

    const options: Parameters<typeof elem.addEventListener>[2] = {
      capture: false,
      passive: true,
    };

    // Add the event listeners
    elem.addEventListener("mousemove", move, options);
    elem.addEventListener("mousedown", startDragging, options);
    elem.addEventListener("mouseup", stopDragging, options);
    elem.addEventListener("mouseleave", stopDragging, options);

    return () => {
      // Remove the event listeners
      elem.removeEventListener("mousemove", move, options);
      elem.removeEventListener("mousedown", startDragging, options);
      elem.removeEventListener("mouseup", stopDragging, options);
      elem.removeEventListener("mouseleave", stopDragging, options);
    };
  }, []);

  return slider;
}
