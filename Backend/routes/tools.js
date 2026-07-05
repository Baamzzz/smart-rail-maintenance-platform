const express = require('express');
const router = express.Router();

const tools = [
    { markerId: 'T001', name: 'Rail Tension Gauge', status: 'Available', location: 'Depot 3', lastChecked: '2024-05-13' },
    { markerId: 'T002', name: 'Track Alignment Tool', status: 'In Use', location: 'Waterloo Station', lastChecked: '2024-05-14' },
    { markerId: 'T003', name: 'Catenary Tester', status: 'Faulty', location: 'Equipment Depot 12', lastChecked: '2024-05-12' },
    { markerId: 'T004', name: 'Signal Tester', status: 'Available', location: 'Depot 1', lastChecked: '2024-05-14' },
];

router.get('/marker/:id', (req, res) => {
    const tool = tools.find(t => t.markerId === req.params.id);
    if (!tool) return res.status(404).json({ message: 'Marker not found' });
    res.json(tool);
});

router.get("/", (req, res) => {
    res.json(tools);
  });
  router.post("/report", (req, res) => {
    const { name, location, severity } = req.body;
  
    const newToolFault = {
      markerId: `T00${tools.length + 1}`,
      name,
      status: "Faulty",
      location,
      lastChecked: new Date().toISOString().split("T")[0],
      severity,
    };
  
    tools.push(newToolFault);
  
    res.status(201).json(newToolFault);
  });
module.exports = router;
