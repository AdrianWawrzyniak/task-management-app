const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database'); // Import bazy danych
const User = require('./models/User');
const Task = require('./models/Task');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Test endpoint
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Synchronizacja bazy danych
sequelize.sync({ force: false }) // Ustawienie "force: true" wyczyści tabelę przy każdej synchronizacji
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Database synchronization error:', err));

// Import i użycie routerów
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Uruchomienie serwera
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
