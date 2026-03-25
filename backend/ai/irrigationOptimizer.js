/**
 * Smart Irrigation Optimizer
 * Analyzes soil moisture, temperature, rainfall, and green cover
 * to produce optimal irrigation schedules.
 */

function optimizeIrrigation(zoneData, simParams) {
  const soilMoisture = simParams.soil_moisture ?? zoneData.soil_moisture;
  const temperature = simParams.temperature ?? 30;
  const rainfall = simParams.rainfall ?? zoneData.rainfall;
  const greenCover = zoneData.green_cover;
  const zoneType = zoneData.type ?? 'residential';

  // Ideal soil moisture targets by zone type
  const idealMoisture = {
    park: 65,
    residential: 45,
    commercial: 30,
    industrial: 20,
  };

  const target = idealMoisture[zoneType] || 40;
  const moistureDeficit = Math.max(target - soilMoisture, 0);

  // Evapotranspiration estimate (simplified Hargreaves)
  const etFactor = Math.max(0, (temperature - 10) * 0.0023 * 2.5);

  // Rainfall offset — less irrigation needed if it rained
  const rainfallOffset = rainfall * 0.6;

  // Base water need (liters per sq meter)
  const baseWaterNeed = (moistureDeficit * 0.8) + (etFactor * 15) - rainfallOffset;
  const waterNeeded = Math.max(Math.round(baseWaterNeed * (greenCover / 50)), 0);

  // Efficiency score (0-100): higher = current conditions need less intervention
  const efficiency = Math.round(
    Math.max(0, Math.min(100, 100 - moistureDeficit - (etFactor * 20) + (rainfall * 0.5)))
  );

  // Schedule recommendation
  let schedule, frequency;
  if (waterNeeded <= 5) {
    schedule = 'No irrigation needed';
    frequency = 'none';
  } else if (waterNeeded <= 20) {
    schedule = temperature > 35 ? 'Early morning (5-6 AM)' : 'Evening (6-7 PM)';
    frequency = 'every 3 days';
  } else if (waterNeeded <= 50) {
    schedule = 'Early morning (5-6 AM) & Evening (6-7 PM)';
    frequency = 'every 2 days';
  } else {
    schedule = 'Morning (5-6 AM), Afternoon mist (2 PM), Evening (6-7 PM)';
    frequency = 'daily';
  }

  const suggestions = [];
  if (soilMoisture < 20) suggestions.push('Critical: Soil is dangerously dry — immediate irrigation needed');
  if (temperature > 40) suggestions.push('Apply mulch layer to reduce evaporation by up to 30%');
  if (rainfall > 50) suggestions.push('Skip irrigation today — sufficient natural rainfall');
  if (greenCover < 20) suggestions.push('Consider drought-resistant native plants to reduce water needs');
  if (efficiency > 80) suggestions.push('Current conditions are optimal — minimal intervention needed');
  if (suggestions.length === 0) suggestions.push('Maintain regular irrigation schedule');

  // Water savings vs unoptimized
  const unoptimizedWater = Math.round(moistureDeficit * 2.5 * (greenCover / 50));
  const waterSaved = Math.max(0, unoptimizedWater - waterNeeded);
  const savingsPercent = unoptimizedWater > 0 ? Math.round((waterSaved / unoptimizedWater) * 100) : 0;

  return {
    waterNeeded,
    waterUnit: 'L/m²',
    schedule,
    frequency,
    efficiency,
    targetMoisture: target,
    currentMoisture: soilMoisture,
    moistureDeficit,
    waterSaved,
    savingsPercent,
    suggestions,
  };
}

module.exports = { optimizeIrrigation };
