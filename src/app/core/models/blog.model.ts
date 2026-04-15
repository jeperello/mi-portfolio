/**
 * Interfaz que define la estructura de datos para un blog del portafolio.
 */
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
}
