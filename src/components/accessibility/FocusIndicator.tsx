import React from 'react';
import { cn } from '@/lib/utils';

interface FocusIndicatorProps {
  children: React.ReactNode;
  className?: string;
  focusableProps?: React.HTMLAttributes<HTMLElement>;
}

/**
 * Enhanced focus indicator component for better visibility
 * Ensures focus is clearly visible for keyboard users
 */
export const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  children,
  className,
  focusableProps,
}) => {
  return (
    <div
      className={cn(
        "relative",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        "focus-within:outline-none",
        className
      )}
      {...focusableProps}
    >
      {children}
    </div>
  );
};