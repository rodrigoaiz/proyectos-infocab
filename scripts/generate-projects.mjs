import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = new URL('..', import.meta.url);
const docsPath = new URL('../docs/repositrio-infocabs.md', import.meta.url);
const outputPath = new URL('../src/data/projects.ts', import.meta.url);

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const sentenceCase = (value) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const buildDescription = ({ title, category }) => {
  const normalizedCategory = category
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Handle specific categories
  if (category === 'General') {
    return `Publicacion digital del Portal Academico para consulta de ${title.replace(/^Libro de Texto:\s*/i, '').toLowerCase()}.`;
  }

  if (normalizedCategory.startsWith('Ingles')) {
    return `Objeto de aprendizaje de ${category} alojado en el Portal Academico para practicar el tema \"${title}\".`;
  }

  if (category === 'Química') {
    return `Objeto de aprendizaje del Portal Academico para la asignatura de ${category.toLowerCase()} sobre ${title.toLowerCase()}.`;
  }

  const descriptions = {
    'Videos educativos': `Video educativo del Portal Academico sobre ${title.toLowerCase()}.`,
    'Manuales de practicas': `Manual de practicas disponible en el Portal Academico para ${title.toLowerCase()}.`,
    'Material educativo de audio': `Recurso sonoro del Portal Academico centrado en ${title.toLowerCase()}.`,
    Infografias: `Infografia educativa del Portal Academico sobre ${title.toLowerCase()}.`,
    'Estrategias didacticas': `Estrategia didactica del Portal Academico para trabajar el tema ${title.toLowerCase()}.`,
    'Cuadernos de trabajo': `Cuaderno de trabajo del Portal Academico para apoyar el estudio de ${title.toLowerCase()}.`,
    'Actividades creativas': `Actividad creativa del Portal Academico enfocada en ${title.toLowerCase()}.`,
  };

  return descriptions[normalizedCategory] ?? `Recurso academico del Portal Academico sobre ${title.toLowerCase()}.`;
};

const buildTags = ({ area, category, title }) => {
  const tokens = new Set([
    area,
    category,
    ...title
      .replace(/[?!:(),.]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 3),
  ]);

  return [...tokens]
    .filter(Boolean)
    .map((token) => sentenceCase(token.trim()))
    .slice(0, 8);
};

const source = await readFile(docsPath, 'utf8');
const lines = source.split(/\r?\n/);

let area = '';
let category = '';
const projects = [];

for (const line of lines) {
  const trimmed = line.trim();

  if (trimmed.startsWith('## ')) {
    area = trimmed.slice(3).trim();
    category = '';
    continue;
  }

  if (trimmed.startsWith('### ')) {
    category = trimmed.slice(4).trim();
    continue;
  }

  const match = trimmed.match(/^- \[(.+)\]\((.+)\)$/);
  if (!match) continue;

  const title = match[1].trim();
  const url = match[2].trim();
  const normalizedCategory = category || 'General';

  projects.push({
    id: slugify(`${area}-${normalizedCategory}-${title}`),
    title,
    url,
    description: buildDescription({ title, category: normalizedCategory }),
    area,
    category: normalizedCategory,
    tags: buildTags({ area, category: normalizedCategory, title }),
  });
}

projects.sort((left, right) => left.title.localeCompare(right.title, 'es'));

const fileContent = `export type Project = {\n  id: string;\n  title: string;\n  url: string;\n  description: string;\n  area: string;\n  category: string;\n  tags: string[];\n};\n\nexport const projects: Project[] = ${JSON.stringify(projects, null, 2)};\n`;

await mkdir(path.dirname(outputPath.pathname), { recursive: true });
await writeFile(outputPath, fileContent);

const relativeOutput = path.relative(new URL(rootDir).pathname, outputPath.pathname);
console.log(`Generated ${projects.length} projects into ${relativeOutput}`);
