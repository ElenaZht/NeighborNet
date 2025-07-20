import { useEffect, useRef, useCallback } from 'react';

export const useClickAway = <T extends HTMLElement = HTMLDivElement>(callback: () => void) => {
  const ref = useRef<T>(null);

  // Memoize callback to prevent unnecessary re-renders
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        memoizedCallback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [memoizedCallback]);

  return ref;
};