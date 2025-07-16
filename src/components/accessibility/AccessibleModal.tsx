import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useFocusManager } from '@/hooks/useFocusManager';
import { useFocusReturn } from '@/hooks/useFocusReturn';

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  initialFocus?: string;
  className?: string;
}

/**
 * Accessible Modal component with proper focus management
 * Implements WCAG 2.1 guidelines for modal dialogs
 */
export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  initialFocus,
  className,
}) => {
  const { storeFocus, restorePreviousFocus, setInitialFocus, containerRef } = useFocusManager({
    restoreFocus: true,
    trapFocus: true,
    initialFocus,
  });

  const { restoreFocus } = useFocusReturn(isOpen);

  useEffect(() => {
    if (isOpen) {
      storeFocus();
      // Set focus after a brief delay to ensure modal is rendered
      setTimeout(() => {
        setInitialFocus();
      }, 100);
    }
  }, [isOpen, storeFocus, setInitialFocus]);

  const handleClose = () => {
    restoreFocus();
    onClose();
  };

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        ref={containerRef}
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? "modal-description" : undefined}
      >
        <DialogHeader>
          <DialogTitle id="modal-title">{title}</DialogTitle>
          {description && (
            <DialogDescription id="modal-description">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};