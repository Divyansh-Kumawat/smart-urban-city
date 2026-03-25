import React from 'react';
import './SDGSection.css';
import { Droplets, Zap, Building2, Globe2 } from 'lucide-react';

const SDGSection = () => {
  const sdgs = [
    {
      id: 6,
      title: 'Clean Water & Sanitation',
      color: '#26bde2', // SDG 6 Official Color
      icon: Droplets,
      description: 'Smart stormwater management and predictive irrigation models reduce water waste by analyzing soil moisture and rainfall data in real-time.',
      metrics: ['20-40% Water Savings', 'Reduced Urban Runoff']
    },
    {
      id: 7,
      title: 'Affordable & Clean Energy',
      color: '#fcc30b', // SDG 7 Official Color
      icon: Zap,
      description: 'Energy optimization algorithms identify patterns to shift loads, maximize solar potential, and reduce overall consumption.',
      metrics: ['Load Balancing', 'Renewable Integration']
    },
    {
      id: 11,
      title: 'Sustainable Cities',
      color: '#fd9d24', // SDG 11 Official Color
      icon: Building2,
      description: 'The Digital Twin creates a virtual replica of the city, enabling planners to simulate scenarios and improve urban resilience.',
      metrics: ['Flood Prediction', 'Green Cover Analysis']
    },
    {
      id: 13,
      title: 'Climate Action',
      color: '#3f7e44', // SDG 13 Official Color
      icon: Globe2,
      description: 'By addressing both water and energy efficiency, the system actively monitors and reduces carbon footprint across city zones.',
      metrics: ['Carbon Footprint Tracking', 'Heat Island Reduction']
    }
  ];

  return (
    <div className="sdg-container animate-fade-in-up">
      <div className="sdg-header">
        <h2>Sustainable Development Goals</h2>
        <p>How the Smart Urban Landscape engine aligns with the UN 2030 Agenda</p>
      </div>
      
      <div className="sdg-grid">
        {sdgs.map((sdg) => {
          const Icon = sdg.icon;
          return (
            <div 
              key={sdg.id} 
              className="sdg-card glass-card"
              style={{ '--sdg-color': sdg.color }}
            >
              <div className="sdg-card-header" style={{ background: sdg.color }}>
                <span className="sdg-number">SDG {sdg.id}</span>
                <Icon size={24} className="sdg-icon" />
              </div>
              
              <div className="sdg-card-body">
                <h3 style={{ color: sdg.color }}>{sdg.title}</h3>
                <p>{sdg.description}</p>
                
                <ul className="sdg-metrics">
                  {sdg.metrics.map((metric, idx) => (
                    <li key={idx}>
                      <span className="metric-dot" style={{ background: sdg.color }}></span>
                      {metric}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SDGSection;
