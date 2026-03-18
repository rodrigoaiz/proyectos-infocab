import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectsPath = join(__dirname, '..', 'src', 'data', 'projects.ts');

// Leer archivo
const content = readFileSync(projectsPath, 'utf-8');

// Definir áreas (sin General, agrupando Idiomas en Talleres)
const AREAS = {
  MATEMATICAS: 'Matemáticas',
  EXPERIMENTALES: 'Ciencias Experimentales',
  HISTORICO_SOCIAL: 'Histórico-Social',
  TALLERES: 'Talleres'
};

// Función mejorada para inferir área
function inferirArea(title, category, description, currentArea) {
  const texto = `${title} ${category} ${description}`.toLowerCase();
  
  // Histórico-Social (verificar PRIMERO antes que Talleres)
  if (texto.match(/historia|histórico|historico|capitalismo|imperialista|revolución|revolucion|política|politica|sociedad|economía|economia|globalizacion|globalización|neoliberalismo|mesoamericana|civilización|estado|proyectos politicos|caricatura política|auge.*industrial|transicion.*capitalista/i)) {
    return AREAS.HISTORICO_SOCIAL;
  }
  
  // Matemáticas
  if (category.match(/matemáticas|matematicas/i) ||
      texto.match(/matemáticas|matematicas|trigonométricas|trigonometricas|trigonometría|trigonometria|números reales|numeros reales|cibernetica|cibernética|álgebra|algebra|cálculo|calculo|estadística|estadistica|razones.*trigonometricas/i)) {
    return AREAS.MATEMATICAS;
  }
  
  // Ciencias Experimentales
  if (category.match(/química|quimica|física|fisica|biología|biologia|manuales de prácticas/i) ||
      texto.match(/química|quimica|física|fisica|biología|biologia|experimento|experimental|laboratorio|enzimas|catalizadores|metabolicos|gigantismo|aves|mamíferos|industria quimica|reacciones|cuaderno.*fisica|procesos metabolicos/i)) {
    return AREAS.EXPERIMENTALES;
  }
  
  // Talleres (incluye Idiomas + comunicación + tecnología + creatividad)
  if (currentArea === 'Talleres de Idiomas' || currentArea === 'Talleres de Lenguaje y Comunicación' ||
      category.match(/inglés|ingles|english/i) ||
      texto.match(/inglés|ingles|english|modal verbs|kahoot|herramientas tecnologicas|diplomado|radio|produccion|edicion|audio|creativa|creadoras|medios.*comunicacion/i)) {
    return AREAS.TALLERES;
  }
  
  // Default a Talleres para recursos sin clasificación clara
  console.log(`⚠️  Clasificado como Talleres por defecto: "${title}"`);
  return AREAS.TALLERES;
}

// Parsear y actualizar
let updated = content;

// Primero, arreglar el tipo duplicado
updated = updated.replace(/  area: string;\n  area: string;/, '  area: string;');

// Luego actualizar cada proyecto
const projectRegex = /{[\s\S]*?"id":\s*"([^"]+)"[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"description":\s*"([^"]+)"[\s\S]*?"area":\s*"([^"]+)"[\s\S]*?"category":\s*"([^"]+)"[\s\S]*?}/g;

let match;
const replacements = [];

while ((match = projectRegex.exec(content)) !== null) {
  const [fullMatch, id, title, description, currentArea, category] = match;
  const newArea = inferirArea(title, category, description, currentArea);
  
  if (newArea !== currentArea) {
    const updatedProject = fullMatch.replace(`"area": "${currentArea}"`, `"area": "${newArea}"`);
    replacements.push({ old: fullMatch, new: updatedProject });
    console.log(`🔄 ${title}: "${currentArea}" → "${newArea}"`);
  }
}

// Aplicar reemplazos
for (const { old, new: newVal } of replacements) {
  updated = updated.replace(old, newVal);
}

// Escribir archivo
writeFileSync(projectsPath, updated, 'utf-8');

console.log(`\n✅ Actualización completada`);
console.log(`📊 Proyectos actualizados: ${replacements.length}`);
