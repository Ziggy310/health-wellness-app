const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Initialize Firebase
require('./config/firebase');

// Route imports
const statusRoutes = require('./routes/status.routes');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const symptomRoutes = require('./routes/symptom.routes');
const mealRoutes = require('./routes/meal.routes');
const reliefRoutes = require('./routes/relief.routes');
const voiceRoutes = require('./routes/voice.routes');
const groceryRoutes = require('./routes/grocery.routes');
const nutrientRoutes = require('./routes/nutrient.routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/status', statusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/relief', reliefRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/grocery', groceryRoutes);
app.use('/api/nutrients', nutrientRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
