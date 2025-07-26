// Singleton loader to prevent duplicate script tags
let isScriptLoaded = false;
let isScriptLoading = false;
let loadCallbacks: Array<(error?: any) => void> = [];

export const loadGoogleMapsScript = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      isScriptLoaded = true;
      resolve();
      return;
    }
    
    // If already in process of loading
    if (isScriptLoading) {
      loadCallbacks.push((error?: any) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
      return;
    }
    
    isScriptLoading = true;
    
    // Check if script already exists (additional safeguard)
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    
    if (existingScript) {
      isScriptLoaded = true;
      isScriptLoading = false;
      resolve();
      return;
    }
    
    // Create and add script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      resolve();
      loadCallbacks.forEach(cb => cb());
      loadCallbacks = [];
    };
    
    script.onerror = (error) => {
      isScriptLoading = false;
      reject(error);
      loadCallbacks.forEach(cb => cb(error));
      loadCallbacks = [];
    };
    
    document.head.appendChild(script);
  });
};