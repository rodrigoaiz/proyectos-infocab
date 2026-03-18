#!/usr/bin/env node
import { projects } from '../src/data/projects.ts';

// Group projects by area
const byArea = projects.reduce((acc, project) => {
  if (!acc[project.area]) {
    acc[project.area] = [];
  }
  acc[project.area].push(project);
  return acc;
}, {});

// Sort areas in the desired order
const areaOrder = [
  'Matemáticas',
  'Ciencias Experimentales',
  'Histórico-Social',
  'Talleres'
];

// Generate markdown
let markdown = '# Materiales INFOCAB alojados en el Portal Académico del CCH\n\n';
markdown += 'Este repositorio contiene todos los materiales INFOCAB organizados por áreas del conocimiento del CCH.\n\n';

areaOrder.forEach(area => {
  const areaProjects = byArea[area] || [];
  if (areaProjects.length === 0) return;
  
  markdown += `## ${area}\n\n`;
  
  // Group by category within each area
  const byCategory = areaProjects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {});
  
  // Sort categories alphabetically
  const categories = Object.keys(byCategory).sort((a, b) => a.localeCompare(b, 'es'));
  
  categories.forEach(category => {
    markdown += `### ${category}\n\n`;
    byCategory[category]
      .sort((a, b) => a.title.localeCompare(b.title, 'es'))
      .forEach(project => {
        markdown += `- [${project.title}](${project.url})\n`;
      });
    markdown += '\n';
  });
  
  markdown += '---\n\n';
});

console.log(markdown);
