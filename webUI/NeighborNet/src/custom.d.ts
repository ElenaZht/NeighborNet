declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

interface ImportMetaEnv {
    readonly VITE_DEV_BASE_URL: string;
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    // Add other environment variables here if needed
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Add Window interface to support google maps
declare global {
    interface Window {
        google: typeof google;
    }
}
