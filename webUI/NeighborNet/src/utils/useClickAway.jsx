import { useEffect, useRef, useCallback } from 'react';

export const useClickAway = (callback) => {
  const ref = useRef();

  // Memoize callback to prevent unnecessary re-renders
  const memoizedCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        memoizedCallback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [memoizedCallback]);

  return ref;
};