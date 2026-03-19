// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// Configura la ruta base según la variable de entorno BASE_PATH.
// Ejemplo: BASE_PATH=/infocab npm run build
// Si no se define, el sitio se sirve desde la raíz ("/").
const rawBase = process.env.BASE_PATH ?? '/';
const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';

// https://astro.build/config
export default defineConfig({
  base,
  vite: {
    plugins: [tailwindcss()]
  }
});
