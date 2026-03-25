/**
 * Flood Risk Prediction Model
 * Uses weighted scoring based on rainfall, drainage capacity,
 * soil moisture, elevation, and green cover.
 */

function predictFloodRisk(zoneData, simParams) {
  const rainfall = simParams.rainfall ?? zoneData.rainfall;
  const soilMoisture = simParams.soil_moisture ?? zoneData.soil_moisture;
  const drainage = zoneData.drainage_capacity;
  const elevation = zoneData.elevation;
  const greenCover = zoneData.green_cover;

  // Normalize factors to 0-1 scale
  const rainfallFactor = Math.min(rainfall / 200, 1);
  const saturationFactor = soilMoisture / 100;
  const drainageFactor = 1 - (drainage / 100);
  const elevationFactor = 1 - Math.min(elevation / 300, 1);
  const greenFactor = 1 - (greenCover / 100);

  // Weighted risk score
  const weights = {
    rainfall: 0.35,
    saturation: 0.20,
    drainage: 0.25,
    elevation: 0.10,
    green: 0.10,
  };

  const riskScore =
    weights.rainfall * rainfallFactor +
    weights.saturation * saturationFactor +
    weights.drainage * drainageFactor +
    weights.elevation * elevationFactor +
    weights.green * greenFactor;

  // Non-linear amplification for heavy rainfall
  const amplifiedScore = rainfall > 100
    ? Math.min(riskScore * 1.3, 1)
    : riskScore;

  const probability = Math.round(amplifiedScore * 100);

  let riskLevel, color;
  if (probability < 25) {
    riskLevel = 'LOW';
    color = '#22c55e';
  } else if (probability < 50) {
    riskLevel = 'MEDIUM';
    color = '#f59e0b';
  } else if (probability < 75) {
    riskLevel = 'HIGH';
    color = '#f97316';
  } else {
    riskLevel = 'CRITICAL';
    color = '#ef4444';
  }

  const recommendations = [];
  if (rainfall > 80) recommendations.push('Activate emergency drainage pumps');
  if (drainage < 50) recommendations.push('Upgrade drainage infrastructure capacity');
  if (soilMoisture > 70) recommendations.push('Deploy temporary water absorption barriers');
  if (greenCover < 30) recommendations.push('Increase permeable green surfaces to absorb runoff');
  if (probability > 60) recommendations.push('Issue flood advisory for this zone');
  if (recommendations.length === 0) recommendations.push('No immediate action required');

  return {
    riskLevel,
    probability,
    color,
    recommendations,
    factors: {
      rainfall: { value: rainfall, impact: (weights.rainfall * rainfallFactor * 100).toFixed(1) },
      soilSaturation: { value: soilMoisture, impact: (weights.saturation * saturationFactor * 100).toFixed(1) },
      drainageCapacity: { value: drainage, impact: (weights.drainage * drainageFactor * 100).toFixed(1) },
      elevation: { value: elevation, impact: (weights.elevation * elevationFactor * 100).toFixed(1) },
      greenCover: { value: greenCover, impact: (weights.green * greenFactor * 100).toFixed(1) },
    },
  };
}

module.exports = { predictFloodRisk };
