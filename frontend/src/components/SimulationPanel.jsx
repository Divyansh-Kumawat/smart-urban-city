import React from 'react';
import { CloudRain, ThermometerSun, Droplets, Zap, Activity } from 'lucide-react';
import './SimulationPanel.css';

const SimulationPanel = ({ 
  zone, 
  params, 
  onParamChange, 
  onSimulate, 
  isLoading 
}) => {
  if (!zone) {
    return (
      <div className="sim-panel glass-card empty-state">
        <Activity size={32} className="empty-icon" />
        <h3>No Zone Selected</h3>
        <p>Click on a map zone to start a simulation</p>
      </div>
    );
  }

  return (
    <div className="sim-panel glass-card animate-slide-in-right">
      <div className="sim-header">
        <div className="zone-badge" style={{ borderColor: zone.color, color: zone.color }}>
          {zone.type}
        </div>
        <h2>{zone.name}</h2>
        <p>Adjust environmental factors to run AI predictions</p>
      </div>

      <div className="sim-controls">
        {/* Rainfall Slider */}
        <div className="control-group">
          <div className="control-header">
            <div className="control-label">
              <CloudRain size={18} className="text-blue" />
              <span>Rainfall</span>
            </div>
            <span className="control-value">{params.rainfall} mm</span>
          </div>
          <input 
            type="range" 
            className="styled-slider bg-blue"
            min="0" max="250" step="5"
            value={params.rainfall}
            onChange={(e) => onParamChange('rainfall', parseFloat(e.target.value))}
          />
          <div className="control-scale">
            <span>Dry</span>
            <span>Flooding</span>
          </div>
        </div>

        {/* Temperature Slider */}
        <div className="control-group">
          <div className="control-header">
            <div className="control-label">
              <ThermometerSun size={18} className="text-orange" />
              <span>Temperature</span>
            </div>
            <span className="control-value">{params.temperature} °C</span>
          </div>
          <input 
            type="range" 
            className="styled-slider bg-orange"
            min="10" max="50" step="1"
            value={params.temperature}
            onChange={(e) => onParamChange('temperature', parseFloat(e.target.value))}
          />
          <div className="control-scale">
            <span>Cool</span>
            <span>Heatwave</span>
          </div>
        </div>

        {/* Soil Moisture Slider */}
        <div className="control-group">
          <div className="control-header">
            <div className="control-label">
              <Droplets size={18} className="text-teal" />
              <span>Initial Soil Moisture</span>
            </div>
            <span className="control-value">{params.soil_moisture}%</span>
          </div>
          <input 
            type="range" 
            className="styled-slider bg-teal"
            min="0" max="100" step="5"
            value={params.soil_moisture}
            onChange={(e) => onParamChange('soil_moisture', parseFloat(e.target.value))}
          />
          <div className="control-scale">
            <span>Dry</span>
            <span>Saturated</span>
          </div>
        </div>
      </div>

      <button 
        className={`simulate-btn ${isLoading ? 'loading' : ''}`}
        onClick={onSimulate}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <div className="spinner"></div>
            Analyzing Data...
          </>
        ) : (
          <>
            <Zap size={18} />
            Run AI Simulation
          </>
        )}
      </button>
    </div>
  );
};

export default SimulationPanel;
