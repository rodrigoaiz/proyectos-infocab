import { projects, type Project } from '../data/projects';

export type ProjectFilters = {
  query?: string;
  area?: string;
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
    project.area,
    project.category,
    project.tags.join(' '),
  ].join(' '));

export const filterProjects = (
  source: Project[],
  { query = '', area = '', category = '' }: ProjectFilters,
) => {
  const normalizedQuery = normalize(query);

  return source.filter((project) => {
    if (area && project.area !== area) return false;
    if (category && project.category !== category) return false;
    if (!normalizedQuery) return true;

    return searchableText(project).includes(normalizedQuery);
  });
};

export const getAreas = (source: Project[]) =>
  [...new Set(source.map((project) => project.area))].sort((left, right) =>
    left.localeCompare(right, 'es'),
  );

export const getCategories = (source: Project[]) =>
  [...new Set(source.map((project) => project.category))].sort((left, right) =>
    left.localeCompare(right, 'es'),
  );

export const getStats = (source: Project[]) => ({
  total: source.length,
  areas: getAreas(source).length,
  categories: getCategories(source).length,
});

export const getAreaTone = (area: string) => {
  switch (area) {
    case 'Matemáticas':
      return {
        accent: 'var(--portal-orange)',
        soft: 'var(--portal-orange-soft)',
      };
    case 'Ciencias Experimentales':
      return {
        accent: 'var(--portal-teal)',
        soft: 'var(--portal-teal-soft)',
      };
    case 'Histórico-Social':
      return {
        accent: 'var(--portal-blue)',
        soft: 'var(--portal-blue-soft)',
      };
    case 'Talleres':
      return {
        accent: 'var(--portal-plum)',
        soft: 'var(--portal-plum-soft)',
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
