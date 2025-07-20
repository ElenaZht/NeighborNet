import { useEffect } from 'react';

export const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }

    // Cleanup function to restore original overflow
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isLocked]);
};