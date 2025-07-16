import { useEffect, useRef, useCallback } from 'react';

interface DynamicFocusOptions {
  focusOnUpdate?: boolean;
  announceChanges?: boolean;
  focusTarget?: string;
}

/**
 * Hook for managing focus when content updates dynamically
 * Ensures users don't lose their place in the document
 */
export const useDynamicFocus = (
  dependencies: any[],
  options: DynamicFocusOptions = {}
) => {
  const { focusOnUpdate = true, announceChanges = true, focusTarget } = options;
  const previousFocus = useRef<HTMLElement | null>(null);
  const announcementRef = useRef<HTMLDivElement | null>(null);

  // Store current focus before update
  const storeFocus = useCallback(() => {
    previousFocus.current = document.activeElement as HTMLElement;
  }, []);

  // Announce content changes to screen readers
  const announceUpdate = useCallback((message: string) => {
    if (!announcementRef.current) return;
    
    announcementRef.current.textContent = message;
    
    // Clear the announcement after a short delay
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = '';
      }
    }, 1000);
  }, []);

  // Handle focus after content update
  useEffect(() => {
    if (!focusOnUpdate) return;

    // If specific target is provided, focus on it
    if (focusTarget) {
      const target = document.querySelector(focusTarget) as HTMLElement;
      if (target) {
        target.focus();
        return;
      }
    }

    // If previous focus element still exists, restore focus
    if (previousFocus.current && document.contains(previousFocus.current)) {
      previousFocus.current.focus();
    }
  }, dependencies);

  // Create announcement element for screen readers
  const createAnnouncementElement = useCallback(() => {
    if (!announcementRef.current) {
      const element = document.createElement('div');
      element.setAttribute('role', 'status');
      element.setAttribute('aria-live', 'polite');
      element.setAttribute('aria-atomic', 'true');
      element.className = 'sr-only';
      element.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;
      document.body.appendChild(element);
      announcementRef.current = element;
    }
  }, []);

  useEffect(() => {
    createAnnouncementElement();
    return () => {
      if (announcementRef.current && document.body.contains(announcementRef.current)) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, [createAnnouncementElement]);

  return {
    storeFocus,
    announceUpdate,
  };
};