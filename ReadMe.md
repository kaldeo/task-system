# Projet BTS API Express avec Node.js

## 1. Installer toutes les application nécéssaire au fonctionnement de l'api

- WAMP SERVER ( Il est très important d'utiliser WAMP SERVER et non autre chose comme Postgres SQL car les requêtes SQL de l'api sont faites pour fonctionner sur PHP MY ADMIN ) https://www.wampserver.com/2011/11/11/installation/

- Node.JS https://nodejs.org/en/download

- IDE ( VS Code, NotePad++, Sublime text, atom peu importe)

## 2. Créer la base de données

Une fois sur la page de php my admin, créer une base de données avec le nom que vous souhaitez. Allez dans l'onglet importer et importez le fichier SQL se trouvant dans le dossier backend. 

## 3. Changement des variables d'envirronement

Pour mettre en relation l'application et la base de données il est important de mettre des données de connexion. Pour ça, dans le dossier backend, créez un fichier ".env" et mettez ceci dedans toute en modifiant en fonction de vos informations : 


```
DB_HOST=localhost
DB_NAME=//NOM DE LA BDD
DB_PORT=// PORT AU CHOIX
DB_USER=// LOGIN MY SQL
DB_PASSWORD=// MDP MY SQL
```
Après ça, le dernier changement dans le code à faire ce trouve dans le fichier user.js se trouvant dans le frontend. 

A la ligne 1 dans l'url changer le port par le port que vous avez mis dans le fichier .env (très important)

Exemple, changer le 3000 : 
```
const url = "http://localhost:3000";
```

## 4. Comment lancer l'application

Avant de lancer l'application, vérifier si toutes les dépendances sont bien iunstaller. Pour ce faire, ouvrir un cmd dans le dossier backend et faire la commande : 
```
npm i
```
Toutes les dépendances seront installer, si une des dépendances ne s'est pas installer il suffira de l'installer manuellement avec la même commande ci-dessus en ajoutant le nom de la dépendance derrière. 

Pour lancer l'application, ouvrir à nouveau un cmd dans le backend et effectuer la commande : 
```
node server.js
```
L'application se lancera et vous devriez vois à l'écran dans le cdm ceci : 
```
✅ Serveur démarré sur http://localhost:PORT
✅ Connecté à la base de données MySQL
```








































