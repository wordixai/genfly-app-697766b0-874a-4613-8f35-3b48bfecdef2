import { useEffect, useRef } from 'react';

/**
 * Hook to automatically manage focus return after component unmounts
 * Compliant with WCAG 2.1 Success Criterion 2.4.3
 */
export const useFocusReturn = (isOpen: boolean) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element when opening
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    return () => {
      // Restore focus when component unmounts or closes
      if (previousActiveElement.current && document.contains(previousActiveElement.current)) {
        requestAnimationFrame(() => {
          previousActiveElement.current?.focus();
        });
      }
    };
  }, [isOpen]);

  const restoreFocus = () => {
    if (previousActiveElement.current && document.contains(previousActiveElement.current)) {
      previousActiveElement.current.focus();
    }
  };

  return { restoreFocus };
};