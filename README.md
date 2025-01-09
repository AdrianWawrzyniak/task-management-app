# Task Management App

Task Management App to prosta aplikacja która pozwala stworzyć użytkownika, zalogowac się, tworzyć i usuwać zadania, dodawać ich tytuł, opis, priority oraz je usuwać.

## Wymagania

Node.js
MySQL/Postgres/MariaDB
(Projekt był tworzony z użyciem Postgres)


## Instalacja

### 1. Sklonuj repozytorium
```bash
git clone https://github.com/AdrianWawrzyniak/task-management-app.git

# Przejdź do lokalizacji task-management-app

# Zainstaluj zależności
npm install

# Należy stworzyć baze danych o przykładowej nazwie np: task_management
# W bazie danych należy utworzyć tabele:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority priority_type DEFAULT 'low',
    createdBy INTEGER REFERENCES users(id) ON DELETE SET NULL,
    assignedTo INTEGER REFERENCES users(id) ON DELETE SET NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
# Jeżeli wystąpi błąd z ENUM, przed tworzeniem tabel trzeba zainicjowac ENUM
CREATE TYPE priority_type AS ENUM ('low', 'mid', 'high');

# By skonfigurowac baze danych należy wejść w server/config/database.js
I zaktualizować w przykładowy sposób: (przykład dla postgres)
```
const { Sequelize } = require('sequelize');

// Konfiguracja bazy PostgreSQL
const sequelize = new Sequelize('nazwabazydanych', 'username', 'haslo', {
    host: 'localhost',
    dialect: 'postgres',
});

sequelize.authenticate()
    .then(() => console.log('PostgreSQL connected'))
    .catch(err => console.error('Connection error:', err));

module.exports = sequelize;
```

# Nastepnie w lokalizacji task-management-app/ należy uruchomić serwer backend:
node server/app.js

# Ostatnim korkiem jest otworzenie frontendu (index.html) w przeglądarce, np za pomocą rozszerzenia VSCode "Live Server" lub innego lokalnego servera
