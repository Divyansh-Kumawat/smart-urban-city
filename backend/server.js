const express = require('express');
const cors = require('cors');
const simulationRoutes = require('./routes/simulation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', simulationRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    name: 'SmartUrban AI Engine',
    version: '1.0.0',
    endpoints: [
      'GET  /api/zones',
      'POST /api/simulate',
      'POST /api/predict-flood',
      'POST /api/optimize-energy',
      'POST /api/irrigation-plan',
      'GET  /api/analytics',
    ],
  });
});

app.listen(PORT, () => {
  console.log(`🌍 SmartUrban AI Engine running on http://localhost:${PORT}`);
});
