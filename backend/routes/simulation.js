const express = require('express');
const router = express.Router();
const zones = require('../data/zones.json');
const { predictFloodRisk } = require('../ai/floodPredictor');
const { optimizeIrrigation } = require('../ai/irrigationOptimizer');
const { optimizeEnergy } = require('../ai/energyOptimizer');

// GET all zones
router.get('/zones', (req, res) => {
  res.json(zones);
});

// POST full simulation for a zone
router.post('/simulate', (req, res) => {
  const { zoneId, rainfall, temperature, soil_moisture } = req.body;
  const zone = zones.find((z) => z.id === zoneId);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });

  const simParams = { rainfall, temperature, soil_moisture };

  const flood = predictFloodRisk(zone.baseData, simParams);
  const irrigation = optimizeIrrigation({ ...zone.baseData, type: zone.type }, simParams);
  const energy = optimizeEnergy({ ...zone.baseData, type: zone.type }, simParams);

  res.json({
    zone: { id: zone.id, name: zone.name, type: zone.type },
    simulation: { rainfall, temperature, soil_moisture },
    results: { flood, irrigation, energy },
  });
});

// POST flood prediction for a zone
router.post('/predict-flood', (req, res) => {
  const { zoneId, rainfall, soil_moisture } = req.body;
  const zone = zones.find((z) => z.id === zoneId);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });

  const result = predictFloodRisk(zone.baseData, { rainfall, soil_moisture });
  res.json({ zone: zone.name, ...result });
});

// POST energy optimization for a zone
router.post('/optimize-energy', (req, res) => {
  const { zoneId, temperature, energy_usage } = req.body;
  const zone = zones.find((z) => z.id === zoneId);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });

  const result = optimizeEnergy({ ...zone.baseData, type: zone.type }, { temperature, energy_usage });
  res.json({ zone: zone.name, ...result });
});

// POST irrigation plan for a zone
router.post('/irrigation-plan', (req, res) => {
  const { zoneId, temperature, soil_moisture, rainfall } = req.body;
  const zone = zones.find((z) => z.id === zoneId);
  if (!zone) return res.status(404).json({ error: 'Zone not found' });

  const result = optimizeIrrigation({ ...zone.baseData, type: zone.type }, { temperature, soil_moisture, rainfall });
  res.json({ zone: zone.name, ...result });
});

// GET analytics overview (all zones)
router.get('/analytics', (req, res) => {
  const rainfall = parseFloat(req.query.rainfall) || 15;
  const temperature = parseFloat(req.query.temperature) || 30;
  const soil_moisture = parseFloat(req.query.soil_moisture) || 40;
  const simParams = { rainfall, temperature, soil_moisture };

  const analytics = zones.map((zone) => {
    const flood = predictFloodRisk(zone.baseData, simParams);
    const irrigation = optimizeIrrigation({ ...zone.baseData, type: zone.type }, simParams);
    const energy = optimizeEnergy({ ...zone.baseData, type: zone.type }, simParams);
    return {
      id: zone.id,
      name: zone.name,
      type: zone.type,
      floodRisk: flood.probability,
      floodLevel: flood.riskLevel,
      floodColor: flood.color,
      waterNeeded: irrigation.waterNeeded,
      irrigationEfficiency: irrigation.efficiency,
      energyUsage: energy.currentUsage,
      energyOptimized: energy.optimizedUsage,
      energySavings: energy.savingsPercent,
      carbonSaved: energy.carbonSaved,
    };
  });

  res.json(analytics);
});

module.exports = router;
