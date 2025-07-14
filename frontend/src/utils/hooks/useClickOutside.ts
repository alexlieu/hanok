import { RefObject, useEffect } from "react";

export const useClickOutside = (
  triggerRef: RefObject<HTMLElement | null>,
  objectRef: RefObject<HTMLElement | null>,
  callback: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") callback();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [callback]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        objectRef.current &&
        !objectRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        callback();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [triggerRef, objectRef, callback]);
};
