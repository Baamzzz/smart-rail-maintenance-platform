// TechIn Backend Server
// Sets up Express, connects to MongoDB, and registers API route groups.

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const faultsRoutes = require('./routes/faults');
const toolsRoutes = require('./routes/tools');
const tasksRoutes = require('./routes/tasks');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

// Global middleware
app.use(express.json());
app.use(cors());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/faults', authMiddleware, faultsRoutes);
app.use('/api/tools', authMiddleware, toolsRoutes);
app.use('/api/tasks', authMiddleware, tasksRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log ('MongoDB Connected'))
.catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('API is running')
});

// Server start
const PORT = process.env.PORT || 5000;

app.get('/api/protected', authMiddleware, (req, res) => {

    res.json({
        message: 'Protected route accessed',
        user: req.user
    });

});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
