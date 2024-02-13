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
    // Add the event listeners
    elem.addEventListener("mousemove", move, false);
    elem.addEventListener("mousedown", startDragging, false);
    elem.addEventListener("mouseup", stopDragging, false);
    elem.addEventListener("mouseleave", stopDragging, false);

    return () => {
      // Remove the event listeners
      elem.removeEventListener("mousemove", move, false);
      elem.removeEventListener("mousedown", startDragging, false);
      elem.removeEventListener("mouseup", stopDragging, false);
      elem.removeEventListener("mouseleave", stopDragging, false);
    };
  }, []);

  return slider;
}
