import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectsPath = join(__dirname, '..', 'src', 'data', 'projects.ts');

// Leer el archivo actual
const content = readFileSync(projectsPath, 'utf-8');

// Definir las áreas del conocimiento CCH (sin General)
const AREAS = {
  MATEMATICAS: 'Matemáticas',
  EXPERIMENTALES: 'Ciencias Experimentales',
  HISTORICO_SOCIAL: 'Histórico-Social',
  TALLERES: 'Talleres'
};

// Función para inferir el área basándose en categoría y título
function inferirArea(category, title, description) {
  const texto = `${category} ${title} ${description}`.toLowerCase();
  
  // Talleres (incluye Idiomas)
  if (category.match(/inglés|ingles|english/i) ||
      texto.match(/inglés|ingles|english|language|idioma|modal verbs/i)) {
    return AREAS.TALLERES;
  }
  
  // Matemáticas (revisar antes que experimentales para capturar trigonometría)
  if (category.match(/matemáticas|matematicas/i) ||
      texto.match(/matemáticas|matematicas|álgebra|algebra|geometría|geometria|cálculo|calculo|trigonométricas|trigonometricas|trigonometría|trigonometria|ecuaciones|estadística|estadistica|razones|números reales|numeros reales|cibernetica|cibernética/i)) {
    return AREAS.MATEMATICAS;
  }
  
  // Ciencias Experimentales
  if (category.match(/química|quimica|física|fisica|biología|biologia|manuales de prácticas/i) ||
      texto.match(/química|quimica|física|fisica|biología|biologia|experimento|experimental|laboratorio|enzimas|catalizadores|metabolicos|metabolismo|gigantismo|aves|mamíferos|industria quimica|reacciones quimicas/i)) {
    return AREAS.EXPERIMENTALES;
  }
  
  // Histórico-Social
  if (texto.match(/historia|histórico|historico|capitalismo|imperialista|revolución|revolucion|social|política|politica|sociedad|economía|economia|filosofía|filosofia|geografía|geografia|caricatura política|proyectos politicos|estado|globalizacion|globalización|neoliberalismo|mesoamericana|civilización/i)) {
    return AREAS.HISTORICO_SOCIAL;
  }
  
  // Talleres (actividades generales, comunicación, tecnología)
  if (texto.match(/lectura|escritura|redacción|redaccion|comunicación|comunicacion|literatura|texto|creativa|creadoras|lenguaje|kahoot|herramientas tecnologicas|diplomado|radio educativa|produccion|edicion|audio/i)) {
    return AREAS.TALLERES;
  }
  
  // Por defecto: basarse en la categoría más común
  console.log(`⚠️  No se pudo clasificar: "${title}" (${category})`);
  return AREAS.TALLERES;
}

// Parsear el archivo TypeScript (simple approach)
const lines = content.split('\n');
const output = [];
let inProject = false;
let currentProject = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Antes del array de proyectos, actualizar el tipo
  if (line.includes('export type Project = {')) {
    output.push(line);
    continue;
  }
  
  if (line.includes('description: string;')) {
    output.push(line);
    output.push('  area: string;');
    continue;
  }
  
  if (line.includes('collection: string;')) {
    // Saltar esta línea, ya fue reemplazada por 'area'
    continue;
  }
  
  // Procesar proyectos
  if (line.trim().startsWith('"id":')) {
    inProject = true;
    currentProject = {};
    const match = line.match(/"id":\s*"([^"]*)"/);
    if (match) currentProject.id = match[1];
  }
  
  if (line.includes('"title":')) {
    const match = line.match(/"title":\s*"([^"]*)"/);
    if (match) currentProject.title = match[1];
  }
  
  if (line.includes('"description":')) {
    const match = line.match(/"description":\s*"([^"]*)"/);
    if (match) currentProject.description = match[1];
  }
  
  if (line.includes('"collection":')) {
    const match = line.match(/"collection":\s*"([^"]*)"/);
    if (match) currentProject.collection = match[1];
    // Reemplazar "collection" por "area"
    const category = currentProject.category || '';
    const title = currentProject.title || '';
    const description = currentProject.description || '';
    const area = inferirArea(category, title, description);
    output.push(line.replace('"collection":', '"area":').replace(currentProject.collection, area));
    continue;
  }
  
  if (line.includes('"category":')) {
    const match = line.match(/"category":\s*"([^"]*)"/);
    if (match) currentProject.category = match[1];
  }
  
  output.push(line);
}

// Escribir el archivo actualizado
writeFileSync(projectsPath, output.join('\n'), 'utf-8');
console.log('✅ Migración completada: collection → area');
console.log('📊 Áreas del conocimiento CCH aplicadas');
console.log('\nVerifica los cambios con: git diff src/data/projects.ts');
