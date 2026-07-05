const express = require('express');
const router = express.Router();

const tasks = [
    { id: 1, title: 'Inspect Track Section 4A', assignee: 'Michael A.', status: 'Pending', priority: 'High', due: '2024-05-15' },
    { id: 2, title: 'Replace Signal Unit at Waterloo', assignee: 'Sarah T.', status: 'In Progress', priority: 'High', due: '2024-05-14' },
    { id: 3, title: 'Calibrate Brake System - Train 204', assignee: 'James R.', status: 'Completed', priority: 'Medium', due: '2024-05-13' },
    { id: 4, title: 'Routine Tool Inspection - Depot 12', assignee: 'Unassigned', status: 'Pending', priority: 'Low', due: '2024-05-16' },
];

router.get('/', (req, res) => {
    res.json(tasks);
});

router.patch('/:id', (req, res) => {
    const task = tasks.find(t => t.id === parseInt(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.body.status) task.status = req.body.status;
    res.json(task);
});

module.exports = router;
