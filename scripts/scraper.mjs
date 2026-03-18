import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

/**
 * Extrae datos enriquecidos de una URL del Portal Académico
 * @param {string} url - URL del recurso
 * @returns {Promise<Object>} Objeto con datos extraídos
 */
export async function scrapePortalURL(url) {
  try {
    console.log(`  Scraping: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      console.log(`  ⚠️  HTTP ${response.status} - Skipping`);
      return {};
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const enrichedData = {};

    // Extraer descripción completa (body field)
    const bodyField = $('.field--name-body .field__item');
    if (bodyField.length > 0) {
      // Limpiar HTML: remover tags pero mantener saltos de línea
      let fullDescription = bodyField.html() || '';
      fullDescription = fullDescription
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      
      if (fullDescription && fullDescription.length > 50) {
        enrichedData.fullDescription = fullDescription;
      }
    }
    
    // Para objetos de aprendizaje que no tienen el wrapper de field
    if (!enrichedData.fullDescription) {
      const bodyFieldAlt = $('.node__content .field--name-body');
      if (bodyFieldAlt.length > 0) {
        let fullDescription = bodyFieldAlt.text().trim();
        if (fullDescription && fullDescription.length > 50) {
          enrichedData.fullDescription = fullDescription;
        }
      }
    }

    // Extraer área del conocimiento (para validación)
    const areaField = $('.field--name-field-area-conocimiento .field__item');
    if (areaField.length > 0) {
      enrichedData.extractedArea = areaField.text().trim();
    }

    // Extraer asignatura
    const subjectField = $('.field--name-field-asignatura .field__item');
    if (subjectField.length > 0) {
      enrichedData.subject = subjectField.text().trim();
    }

    // Extraer formato de recurso
    const formatField = $('.field--name-field-formato-de-recurso .field__item');
    if (formatField.length > 0) {
      enrichedData.format = formatField.text().trim();
    }

    // Extraer autores
    const authorsField = $('.field--name-field-ra-autores .field__item');
    if (authorsField.length > 0) {
      let authors = authorsField.html() || '';
      authors = authors
        .replace(/<br\s*\/?>/gi, ', ')
        .replace(/<[^>]+>/g, '')
        .trim();
      if (authors) {
        enrichedData.authors = authors;
      }
    }

    // Extraer año de publicación
    const yearField = $('.field--name-field-anio-publicacion .field__item');
    if (yearField.length > 0) {
      const year = parseInt(yearField.text().trim(), 10);
      if (!isNaN(year)) {
        enrichedData.year = year;
      }
    }

    return enrichedData;
  } catch (error) {
    console.log(`  ❌ Error scraping ${url}: ${error.message}`);
    return {};
  }
}

/**
 * Crea un resumen de una descripción larga
 * @param {string} text - Texto completo
 * @param {number} maxLength - Longitud máxima del resumen
 * @returns {string} Resumen
 */
export function createSummary(text, maxLength = 200) {
  if (!text || text.length <= maxLength) {
    return text;
  }

  // Intentar cortar en el último punto antes del límite
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  
  if (lastPeriod > maxLength * 0.6) {
    return truncated.substring(0, lastPeriod + 1);
  }

  // Si no hay punto, cortar en el último espacio
  const lastSpace = truncated.lastIndexOf(' ');
  return truncated.substring(0, lastSpace) + '...';
}

/**
 * Añade un delay entre requests para no sobrecargar el servidor
 * @param {number} ms - Milisegundos a esperar
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
