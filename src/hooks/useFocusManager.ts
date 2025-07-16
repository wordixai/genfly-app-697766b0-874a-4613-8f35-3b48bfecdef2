import { useRef, useEffect, useCallback } from 'react';

export interface FocusManagerOptions {
  restoreFocus?: boolean;
  trapFocus?: boolean;
  initialFocus?: string | HTMLElement;
}

export const useFocusManager = (options: FocusManagerOptions = {}) => {
  const { restoreFocus = true, trapFocus = false, initialFocus } = options;
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Store the currently focused element
  const storeFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  }, []);

  // Restore focus to the previously focused element
  const restorePreviousFocus = useCallback(() => {
    if (restoreFocus && previousActiveElement.current) {
      // Use requestAnimationFrame to ensure the element is available
      requestAnimationFrame(() => {
        if (previousActiveElement.current && document.contains(previousActiveElement.current)) {
          previousActiveElement.current.focus();
        }
      });
    }
  }, [restoreFocus]);

  // Set initial focus when component mounts
  const setInitialFocus = useCallback(() => {
    if (!initialFocus) return;

    const element = typeof initialFocus === 'string' 
      ? document.querySelector(initialFocus) as HTMLElement
      : initialFocus;

    if (element && document.contains(element)) {
      element.focus();
    }
  }, [initialFocus]);

  // Get all focusable elements within a container
  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(',');

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter((element) => {
        const el = element as HTMLElement;
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement;
      }) as HTMLElement[];
  }, []);

  // Handle keyboard events for focus trap
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!trapFocus || !containerRef.current || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements(containerRef.current);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    }
  }, [trapFocus, getFocusableElements]);

  useEffect(() => {
    if (trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [trapFocus, handleKeyDown]);

  return {
    containerRef,
    storeFocus,
    restorePreviousFocus,
    setInitialFocus,
    getFocusableElements,
  };
};