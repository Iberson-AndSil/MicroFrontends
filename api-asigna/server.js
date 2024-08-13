// asigna-api/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

let assignments = []; // Esto debería ser persistido en una base de datos en producción

// Endpoint para asignar una tarea a un trabajador
app.post('/api/assign', (req, res) => {
  const { taskId, workerName } = req.body;
  if (!taskId || !workerName) {
    return res.status(400).json({ error: 'taskId y workerName son necesarios' });
  }

  // Agregar la asignación
  assignments.push({ taskId, workerName });
  res.status(201).json({ message: 'Asignación exitosa' });
});

// Endpoint para obtener todas las asignaciones con el nombre de la tarea
app.get('/api/assignments', async (req, res) => {
  try {
    // Obtén la lista de tareas desde el backend de tareas
    const response = await axios.get('http://localhost:3000/api/tasks');
    const tasks = response.data;

    // Mapear el nombre de la tarea a cada asignación
    const assignmentsWithNames = assignments.map((assignment) => {
      const task = tasks.find(task => task.id === assignment.taskId);
      return {
        taskId: assignment.taskId,
        taskName: task ? task.name : 'Desconocida',
        workerName: assignment.workerName
      };
    });

    res.json(assignmentsWithNames);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.listen(port, () => {
  console.log(`Asignación API running at http://localhost:${port}`);
});
