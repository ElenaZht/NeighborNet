// Singleton loader to prevent duplicate script tags
let isScriptLoaded = false;
let isScriptLoading = false;
let loadCallbacks = [];

export const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google && window.google.maps) {
      isScriptLoaded = true;
      resolve();
      return;
    }
    
    // If already in process of loading
    if (isScriptLoading) {
      loadCallbacks.push(resolve);
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDZbVH4NZTDe_1trTVbRSEwa_51eHWbx8k&libraries=places&callback=Function.prototype`;
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