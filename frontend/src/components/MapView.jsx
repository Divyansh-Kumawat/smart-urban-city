import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { PolygonLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import './MapView.css';

const MAP_CENTER = {
  longitude: 77.2090,
  latitude: 28.6145,
  zoom: 15,
  pitch: 45,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

const MapView = ({ zones, selectedZoneId, onZoneSelect, analyticsData }) => {
  const [hoverInfo, setHoverInfo] = useState({});

  // Format data for Deck.gl (needs [lng, lat] and a specific structure)
  const layerData = zones.map((zone) => {
    // Convert [lat, lng] to [lng, lat] and wrap in an array as required for Polygons
    const deckPolygon = [zone.coordinates.map(coord => [coord[1], coord[0]])];
    
    // Find analytics for colors and elevation
    let colorHex = zone.color || '#3b82f6';
    let elevation = 20; // Default elevation
    
    if (analyticsData && analyticsData.length > 0) {
      const zoneAnalytics = analyticsData.find(a => a.id === zone.id);
      if (zoneAnalytics) {
        colorHex = zoneAnalytics.floodColor;
        // Use energy usage for visual height (scaled down for better visuals)
        elevation = Math.max(zoneAnalytics.energyUsage * 0.5, 20); 
      }
    }

    // Convert hex to rgb array for Deck.gl
    const r = parseInt(colorHex.slice(1, 3), 16) || 59;
    const g = parseInt(colorHex.slice(3, 5), 16) || 130;
    const b = parseInt(colorHex.slice(5, 7), 16) || 246;

    return {
      ...zone,
      polygon: deckPolygon,
      rgbColor: [r, g, b, 180], // Fill color with opacity
      lineColor: selectedZoneId === zone.id ? [255, 255, 255, 255] : [r, g, b, 255],
      elevation: elevation
    };
  });

  const layers = [
    new PolygonLayer({
      id: 'zones-layer',
      data: layerData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: true,
      wireframe: true,
      lineWidthMinPixels: selectedZoneId ? 2 : 1,
      getPolygon: d => d.polygon,
      getFillColor: d => d.rgbColor,
      getLineColor: d => d.lineColor,
      getElevation: d => d.elevation,
      updateTriggers: {
        getFillColor: [analyticsData],
        getLineColor: [selectedZoneId, analyticsData],
        getElevation: [analyticsData]
      },
      onHover: info => setHoverInfo(info),
      onClick: info => {
        if (info.object) onZoneSelect(info.object.id);
      }
    })
  ];

  return (
    <div className="map-container glass-card animate-fade-in-up">
      <div className="map-header">
        <h2>3D Digital Twin</h2>
        <div className="map-status">
          <span className="live-badge"></span>
          Live Monitoring
        </div>
      </div>
      
      <div className="map-wrapper" style={{ position: 'relative' }}>
        <DeckGL
          initialViewState={MAP_CENTER}
          controller={true}
          layers={layers}
          getTooltip={({object}) => object && `${object.name}\n${object.type.toUpperCase()}`}
        >
          <Map mapStyle={MAP_STYLE} />
        </DeckGL>

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
          <div className="legend-elevation-note">
            <small>Block height represents relative energy consumption.</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
