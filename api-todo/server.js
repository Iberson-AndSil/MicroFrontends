// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const filePath = path.join(__dirname, 'tasks.json');

// Load tasks from file
const loadTasks = () => {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return [];
};

// Save tasks to file
const saveTasks = (tasks) => {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(loadTasks());
});

// Add a new task
app.post('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  const newTask = req.body;
  tasks.push(newTask);
  saveTasks(tasks);
  res.status(201).json(newTask);
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  let tasks = loadTasks();
  tasks = tasks.filter(task => task.id !== parseInt(req.params.id));
  saveTasks(tasks);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
