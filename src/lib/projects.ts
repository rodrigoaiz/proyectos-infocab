import { projects, type Project } from '../data/projects';

export type ProjectFilters = {
  query?: string;
  collection?: string;
  category?: string;
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export const searchableText = (project: Project) =>
  normalize([
    project.title,
    project.description,
    project.collection,
    project.category,
    project.tags.join(' '),
  ].join(' '));

export const filterProjects = (
  source: Project[],
  { query = '', collection = '', category = '' }: ProjectFilters,
) => {
  const normalizedQuery = normalize(query);

  return source.filter((project) => {
    if (collection && project.collection !== collection) return false;
    if (category && project.category !== category) return false;
    if (!normalizedQuery) return true;

    return searchableText(project).includes(normalizedQuery);
  });
};

export const getCollections = (source: Project[]) =>
  [...new Set(source.map((project) => project.collection))].sort((left, right) =>
    left.localeCompare(right, 'es'),
  );

export const getCategories = (source: Project[]) =>
  [...new Set(source.map((project) => project.category))].sort((left, right) =>
    left.localeCompare(right, 'es'),
  );

export const getStats = (source: Project[]) => ({
  total: source.length,
  collections: getCollections(source).length,
  categories: getCategories(source).length,
});

export const getCollectionTone = (collection: string) => {
  switch (collection) {
    case 'Recursos de apoyo':
      return {
        accent: 'var(--portal-orange)',
        soft: 'var(--portal-orange-soft)',
      };
    case 'Objetos de aprendizaje':
      return {
        accent: 'var(--portal-teal)',
        soft: 'var(--portal-teal-soft)',
      };
    case 'Publicaciones':
      return {
        accent: 'var(--portal-lime)',
        soft: 'var(--portal-lime-soft)',
      };
    default:
      return {
        accent: 'var(--portal-plum)',
        soft: 'var(--portal-plum-soft)',
      };
  }
};

export { projects };
export type { Project };
