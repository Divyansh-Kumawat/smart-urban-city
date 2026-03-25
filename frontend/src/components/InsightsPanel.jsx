import React from 'react';
import { ShieldAlert, Droplets, Zap, TrendingDown, Leaf, Info, AlertTriangle } from 'lucide-react';
import './InsightsPanel.css';

const InsightsPanel = ({ results, zone }) => {
  if (!results) {
    return (
      <div className="insights-panel empty-state">
        <div className="placeholder-content">
          <Info size={40} className="placeholder-icon" />
          <h3>Awaiting Simulation</h3>
          <p>Run a simulation to generate AI insights for this zone</p>
        </div>
      </div>
    );
  }

  const { flood, irrigation, energy } = results;

  return (
    <div className="insights-panel animate-fade-in-up">
      <div className="insights-header">
        <h2>AI Insights</h2>
        <span className="zone-ref">{zone?.name}</span>
      </div>

      {/* Critical Alert Banner if needed */}
      {(flood.riskLevel === 'CRITICAL' || flood.riskLevel === 'HIGH') && (
        <div className={`alert-banner ${flood.riskLevel.toLowerCase()} animate-slide-in-right`}>
          <AlertTriangle size={24} />
          <div className="alert-content">
            <h4>{flood.riskLevel} FLOOD RISK DETECTED</h4>
            <p>Immediate action required for {zone?.name}</p>
          </div>
        </div>
      )}

      <div className="insights-grid">
        {/* Flood Risk Card */}
        <div className="insight-card glass-card" style={{ '--card-color': flood.color }}>
          <div className="card-header">
            <div className="card-title">
              <ShieldAlert size={20} color={flood.color} />
              <h3>Flood Prediction</h3>
            </div>
            <span className="risk-badge" style={{ backgroundColor: `${flood.color}20`, color: flood.color }}>
              {flood.riskLevel}
            </span>
          </div>
          
          <div className="card-body">
            <div className="main-metric">
              <span className="value" style={{ color: flood.color }}>{flood.probability}%</span>
              <span className="label">Probability</span>
            </div>
            
            <div className="recommendations">
              <h4>AI Recommendations:</h4>
              <ul>
                {flood.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Irrigation Card */}
        <div className="insight-card glass-card" style={{ '--card-color': '#14b8a6' }}>
          <div className="card-header">
            <div className="card-title">
              <Droplets size={20} className="text-teal" />
              <h3>Smart Irrigation</h3>
            </div>
            <span className="efficiency-badge">
              {irrigation.efficiency}% Efficient
            </span>
          </div>
          
          <div className="card-body">
            <div className="metrics-row">
              <div className="sub-metric">
                <span className="value text-teal">{irrigation.waterNeeded}</span>
                <span className="label">L/m² Needed</span>
              </div>
              <div className="sub-metric">
                <span className="value text-green">{irrigation.waterSaved}</span>
                <span className="label">L/m² Saved</span>
              </div>
            </div>
            
            <div className="schedule-box">
              <span className="schedule-label">Optimal Schedule:</span>
              <strong>{irrigation.schedule}</strong>
              <span className="frequency">({irrigation.frequency})</span>
            </div>
          </div>
        </div>

        {/* Energy Card */}
        <div className="insight-card glass-card" style={{ '--card-color': '#f59e0b' }}>
          <div className="card-header">
            <div className="card-title">
              <Zap size={20} className="text-amber" />
              <h3>Energy Optimization</h3>
            </div>
            <div className="savings-badge">
              <TrendingDown size={14} />
              {energy.savingsPercent}% Savings
            </div>
          </div>
          
          <div className="card-body">
            <div className="energy-comparison">
              <div className="energy-bar current" style={{ width: '100%' }}>
                <span>{energy.currentUsage} {energy.unit}</span>
                <label>Current</label>
              </div>
              <div className="energy-bar optimized" style={{ width: `${100 - energy.savingsPercent}%` }}>
                <span>{energy.optimizedUsage} {energy.unit}</span>
                <label>Optimized</label>
              </div>
            </div>
            
            <div className="carbon-impact">
              <Leaf size={16} className="text-green" />
              <span><strong>{energy.carbonSaved}</strong> {energy.carbonUnit} averted daily</span>
            </div>
            
            <div className="recommendations mt-3">
              <ul>
                {energy.suggestions.slice(0, 2).map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
