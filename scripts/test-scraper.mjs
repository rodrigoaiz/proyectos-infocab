import { scrapePortalURL } from './scraper.mjs';

// URLs de prueba con diferentes estructuras
const testUrls = [
  'https://portalacademico.cch.unam.mx/recursos-de-apoyo/video-educativo/actividad-experimental-caminantes-presencial',
  'https://portalacademico.cch.unam.mx/recursos-de-apoyo/reporte-de-investigacion/exploracion-conocimiento-docente-geometria-plana',
  'https://portalacademico.cch.unam.mx/ingles2/can-you-find-the-place'
];

console.log('🧪 Testing scraper with 3 different URL types\n');

for (const url of testUrls) {
  console.log(`\n📍 Testing: ${url}`);
  console.log('─'.repeat(80));
  
  const data = await scrapePortalURL(url);
  
  console.log('\n✅ Extracted data:');
  console.log(JSON.stringify(data, null, 2));
  console.log('─'.repeat(80));
}

console.log('\n✨ Test completed!');
