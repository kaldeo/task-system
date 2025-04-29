const express = require('express');
const path = require('path');
require('dotenv').config();
const app = express();
const db = require('./db');

// Middleware pour servir les fichiers statiques depuis le dossier frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// Lancer le serveur
app.listen(process.env.DB_PORT, () => {
  console.log(`✅ \x1b[32mServeur démarré sur http://localhost:${process.env.DB_PORT}\x1b[0m`);
  db.client.connect();
});











// Importation des routes

const getRoutes = require('./routes/get.routes');
const postRoutes = require('./routes/post.routes');
const deleteRoutes = require('./routes/delete.routes');

// Montage sans préfixe, les routes sont utilisées telles quelles

app.use(getRoutes);
app.use(postRoutes);
app.use(deleteRoutes);




