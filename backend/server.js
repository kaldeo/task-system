const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000; 

// Middleware pour servir les fichiers statiques depuis le dossier frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
