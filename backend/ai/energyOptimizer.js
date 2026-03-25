/**
 * Energy Optimization Model
 * Analyzes zone energy usage patterns and recommends
 * reductions via renewable integration and load optimization.
 */

function optimizeEnergy(zoneData, simParams) {
  const currentUsage = simParams.energy_usage ?? zoneData.energy_usage;
  const solarPotential = zoneData.solar_potential;
  const zoneType = zoneData.type ?? 'residential';
  const temperature = simParams.temperature ?? 30;
  const greenCover = zoneData.green_cover;
  const populationDensity = zoneData.population_density;

  // Energy usage efficiency baseline by zone type (kWh per capita ideal)
  const efficiencyBaseline = {
    park: 20,
    residential: 120,
    commercial: 250,
    industrial: 400,
  };

  const baseline = efficiencyBaseline[zoneType] || 150;

  // HVAC load factor — higher temperature = more cooling energy
  const hvacFactor = temperature > 30
    ? 1 + ((temperature - 30) * 0.03)
    : temperature < 15
      ? 1 + ((15 - temperature) * 0.02)
      : 1.0;

  // Green cover reduces urban heat island — saves cooling energy
  const greenReduction = greenCover * 0.15; // up to 15% savings from full green cover

  // Solar energy generation potential (kWh equivalent)
  const solarGeneration = Math.round(solarPotential * 0.65 * (currentUsage / 100));

  // Smart grid / load balancing optimization
  const loadOptimization = Math.round(currentUsage * 0.12); // 12% from smart scheduling

  // Total optimized usage
  const totalSavings = solarGeneration + loadOptimization + Math.round(greenReduction);
  const optimizedUsage = Math.max(Math.round(currentUsage - totalSavings), Math.round(currentUsage * 0.3));
  const actualSavings = currentUsage - optimizedUsage;
  const savingsPercent = Math.round((actualSavings / currentUsage) * 100);

  // Renewable mix
  const renewablePercent = Math.min(Math.round((solarGeneration / currentUsage) * 100), 70);

  // Carbon impact (kg CO2 saved, assuming 0.82 kg CO2 per kWh for coal grid)
  const carbonSaved = (actualSavings * 0.82).toFixed(1);

  // Peak hours recommendation
  let peakAdvice;
  if (zoneType === 'commercial') {
    peakAdvice = 'Shift non-critical loads to off-peak hours (9 PM – 6 AM)';
  } else if (zoneType === 'industrial') {
    peakAdvice = 'Stagger heavy machinery operation across shifts';
  } else if (zoneType === 'residential') {
    peakAdvice = 'Use smart meters to incentivize off-peak consumption';
  } else {
    peakAdvice = 'Implement solar-powered lighting with dusk-to-dawn sensors';
  }

  const suggestions = [];
  if (solarPotential > 60) suggestions.push(`Install rooftop solar panels — potential ${renewablePercent}% renewable coverage`);
  if (temperature > 35) suggestions.push('Deploy smart HVAC systems with predictive cooling');
  if (greenCover < 30) suggestions.push('Increase tree canopy to reduce urban heat island effect');
  if (currentUsage > baseline * 1.5) suggestions.push('Usage significantly above baseline — audit recommended');
  suggestions.push(peakAdvice);
  if (savingsPercent > 20) suggestions.push(`Projected annual savings: ₹${(actualSavings * 8 * 365 / 1000).toFixed(0)}K`);

  return {
    currentUsage,
    optimizedUsage,
    savingsPercent,
    unit: 'kWh',
    breakdown: {
      solarGeneration,
      loadOptimization,
      greenCoverSavings: Math.round(greenReduction),
      hvacImpact: ((hvacFactor - 1) * 100).toFixed(1) + '%',
    },
    renewablePercent,
    carbonSaved: parseFloat(carbonSaved),
    carbonUnit: 'kg CO₂',
    suggestions,
  };
}

module.exports = { optimizeEnergy };
