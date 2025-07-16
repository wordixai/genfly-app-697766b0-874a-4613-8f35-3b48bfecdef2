import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' },
];

/**
 * Skip Links component for keyboard navigation
 * Compliant with WCAG 2.1 Success Criterion 2.4.1
 */
export const SkipLinks: React.FC<SkipLinksProps> = ({ 
  links = defaultLinks, 
  className 
}) => {
  const handleSkipClick = (href: string) => {
    const target = document.querySelector(href) as HTMLElement;
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      className={cn("skip-links", className)}
      aria-label="Skip navigation links"
    >
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          onClick={(e) => {
            e.preventDefault();
            handleSkipClick(link.href);
          }}
          className={cn(
            "absolute left-4 top-4 z-50",
            "px-4 py-2 bg-primary text-primary-foreground",
            "rounded-md text-sm font-medium",
            "transform -translate-y-full opacity-0",
            "transition-all duration-200",
            "focus:translate-y-0 focus:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
};