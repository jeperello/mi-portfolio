export interface ChapterItem {
  title: string;
  status: 'Done' | 'Actual' | 'Próximo';
  postId?: string;
}

/**
 * Interfaz que define la estructura de un comentario en el blog.
 */
export interface BlogComment {
  id?: string;
  author: string;
  content: string;
  date: string;
}

/**
 * Interfaz que define la estructura de datos para un blog del portafolio.
 */
export interface Blog {
  id: string;
  title: string;
  subtitle?: string;
  status?: string;
  showCard?: boolean;
  excerpt: string;
  content: string;
  contentUrl?: string;
  date: string;
  author: string;
  tags: string[];
  chapters?: ChapterItem[];
  comments?: BlogComment[];
}
