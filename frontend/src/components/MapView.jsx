import React from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Center of New Delhi for the demo (since coordinates are there)
const MAP_CENTER = [28.6145, 77.2090];
const MAP_ZOOM = 16;

const MapView = ({ zones, selectedZoneId, onZoneSelect, analyticsData }) => {
  // If we have analytics data, use the color from the flood prediction
  const getZoneColor = (zone) => {
    if (analyticsData && analyticsData.length > 0) {
      const zoneAnalytics = analyticsData.find(a => a.id === zone.id);
      if (zoneAnalytics) {
        return zoneAnalytics.floodColor;
      }
    }
    return zone.color || '#3b82f6';
  };

  return (
    <div className="map-container glass-card animate-fade-in-up">
      <div className="map-header">
        <h2>Digital Twin</h2>
        <div className="map-status">
          <span className="live-badge"></span>
          Live Monitoring
        </div>
      </div>
      
      <div className="map-wrapper">
        <MapContainer 
          center={MAP_CENTER} 
          zoom={MAP_ZOOM} 
          scrollWheelZoom={true}
          className="leaflet-map"
          attributionControl={false}
        >
          {/* Dark themed map tiles (CartoDB Dark Matter) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {zones.map((zone) => {
            const isSelected = selectedZoneId === zone.id;
            const zoneColor = getZoneColor(zone);
            
            return (
              <Polygon
                key={zone.id}
                positions={zone.coordinates}
                pathOptions={{
                  color: isSelected ? '#ffffff' : zoneColor,
                  fillColor: zoneColor,
                  fillOpacity: isSelected ? 0.6 : 0.4,
                  weight: isSelected ? 3 : 2,
                  dashArray: isSelected ? '5, 5' : 'none',
                }}
                eventHandlers={{
                  click: () => onZoneSelect(zone.id),
                }}
              >
                <Tooltip permanent={isSelected} direction="center" className="zone-tooltip">
                  <div className="tooltip-content">
                    <strong>{zone.name}</strong>
                    <span className="tooltip-type">{zone.type}</span>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
        </MapContainer>
        
        {/* Map Legend Overlay */}
        <div className="map-legend glass-card">
          <h4>Risk Legend</h4>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#22c55e' }}></span>
            <span>Normal Profile</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#f59e0b' }}></span>
            <span>Medium Risk</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#f97316' }}></span>
            <span>High Risk</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ background: '#ef4444' }}></span>
            <span>Critical Severity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
