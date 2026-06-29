/**
 * Detects if the application is running in a local development environment.
 * Safe for Server-Side Rendering (SSR) / Hydration by checking if window is defined.
 */
export const isLocalEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
};
