/**
 * Interfaz que define la estructura de datos para un proyecto del portafolio.
 * Nos ayuda a asegurar la consistencia y el tipado en todo el código.
 */
export interface Project {
  name: string;
  description: string;
  repositoryUrl: string;
  technologies: string[];
  demoUrl?: string; // Opcional, por si algún proyecto no tiene demo desplegada.
  isNew?: boolean;
}
