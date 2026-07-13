import { clsx, type ClassValue } from "clsx";
import { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Scrolls the clicked element into the center of its scrollable parent container.
 * Works reliably on both desktop (mouse) and mobile (touch).
 *
 * Usage:
 *   <button onClick={scrollToCenter}>Click me</button>
 *   // or
 *   <div onClick={(e) => scrollToCenter(e)}>Click</div>
 */
export function scrollToCenter(
  event: ReactMouseEvent<HTMLElement> | ReactTouchEvent<HTMLElement> | MouseEvent | TouchEvent,
  options?: {
    behavior?: ScrollBehavior;
    /** Vertical alignment */
    block?: ScrollLogicalPosition;
    /** Horizontal alignment - 'center' is what you usually want */
    inline?: ScrollLogicalPosition;
  },
) {
  const target = (event.currentTarget || event.target) as HTMLElement | null;
  if (!target) return;

  target.scrollIntoView({
    behavior: options?.behavior ?? "smooth",
    block: options?.block ?? "nearest",
    inline: options?.inline ?? "center",
  });
}

/**
 * @deprecated Use `scrollToCenter` instead.
 * Kept for backward compatibility.
 */
export function moveCenter(event: any, _category?: any) {
  scrollToCenter(event);
}

/**
 * Alternative: Centers an element inside a specific scroll container.
 * Use this when the element is not a direct child or you need more control.
 */
export function scrollElementToCenter(
  element: HTMLElement,
  container?: HTMLElement,
  options?: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  },
) {
  if (!element) return;

  if (container) {
    // Manual calculation for precise control inside a specific container
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const isHorizontal = container.scrollWidth > container.clientWidth;

    if (isHorizontal) {
      const scrollLeft =
        container.scrollLeft +
        elementRect.left -
        containerRect.left -
        containerRect.width / 2 +
        elementRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: options?.behavior ?? "smooth",
      });
    } else {
      const scrollTop =
        container.scrollTop +
        elementRect.top -
        containerRect.top -
        containerRect.height / 2 +
        elementRect.height / 2;

      container.scrollTo({
        top: scrollTop,
        behavior: options?.behavior ?? "smooth",
      });
    }
  } else {
    // Simple case - use native scrollIntoView
    element.scrollIntoView({
      behavior: options?.behavior ?? "smooth",
      block: options?.block ?? "center",
      inline: options?.inline ?? "center",
    });
  }
}

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .max(128, "Password is too long");

export const getNum = (num: number) => {
  return num.toLocaleString();
};

export const setNum = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  const checkNum = value.split(",").join("");
  const convertNum = parseInt(checkNum);
  setBidAmount(convertNum || 0);
};
