
# Añadir antes de entregar a SG

- ~~Añadir categorías de areas~~ ✅ Completado
- ~~Revisar que no está funcionando busqueda~~ ✅ Arreglado
- ~~Quitar colección~~ ✅ Completado
- ~~Añadir en vez de colección categoría por areas del conocimiento~~ ✅ Completado
- Los colores no corresponden
- Quitar General
- Solo sean 4 areas
- Añadir descripción
- Añadir banner en front de PACCH

## Cambios realizados

### ✅ Migración de "colección" a "áreas del conocimiento"

- Reemplazado el campo `collection` por `area` en todos los proyectos
- Las 5 áreas del conocimiento CCH implementadas:
  - Matemáticas (2 proyectos)
  - Ciencias Experimentales (11 proyectos)
  - Histórico-Social (4 proyectos)
  - Talleres de Lenguaje y Comunicación (2 proyectos)
  - Talleres de Idiomas (19 proyectos)
  - General (12 proyectos - recursos transversales)

### ✅ Componentes actualizados

- `Hero.astro`: Ahora muestra "Áreas" en vez de "Colecciones"
- `SearchFilters.astro`: Filtro por "Área del conocimiento" en vez de "Colección"
- `ProjectCard.astro`: Muestra el área en la tarjeta del proyecto
- `index.astro`: Script de búsqueda actualizado para usar `area`
- `lib/projects.ts`: Funciones `getAreas()` y `getAreaTone()` implementadas

### ✅ Corrección de búsqueda

- Eliminado el auto-cierre del panel de filtros
- Restaurado el elemento `data-results-label` para actualización en tiempo real
- La búsqueda ahora funciona correctamente sin ocultar el menú
