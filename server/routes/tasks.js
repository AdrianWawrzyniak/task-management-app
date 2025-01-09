const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Tworzenie zadania
router.post('/', async (req, res) => {
    try {
        const { title, description, priority, createdBy, assignedTo } = req.body;

        const task = await Task.create({ title, description, priority, createdBy, assignedTo });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Error creating task' });
    }
});

// Pobieranie wszystkich zadań
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});


// Usuwanie zadania
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        await task.destroy();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task' });
    }
});

module.exports = router;
