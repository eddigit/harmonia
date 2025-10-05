// Test rapide du serveur
const server = require('./server');

console.log('✅ Serveur importé avec succès');
console.log('📋 Vérification des routes disponibles...');

// Test des presets
fetch('http://localhost:3001/presets')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Route /presets fonctionne');
    console.log('📊 Nombre de catégories de presets:', Object.keys(data).length);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erreur lors du test:', error.message);
    process.exit(1);
  });