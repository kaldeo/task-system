require('dotenv').config();
const mysql = require('mysql2/promise');

let connection;

const client = {
    async connect() {
        try {
            connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            });
            console.log('✅ \x1b[32mConnecté à la base de données MySQL\x1b[0m');
        } catch (err) {
            console.error('❌ \x1b[31mErreur de connexion à la base de données\x1b[0m', err);
            setTimeout(() => client.connect(), 1800000); // Reconnexion dans 30 min
        }
    },

    getConnection() {
        return connection;
    }
};
    
module.exports = { client };
