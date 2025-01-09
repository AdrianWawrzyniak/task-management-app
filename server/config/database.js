const { Sequelize } = require('sequelize');

// Konfiguracja bazy PostgreSQL
const sequelize = new Sequelize('task_management', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected'))
    .catch(err => console.error('Connection error:', err));

module.exports = sequelize;
