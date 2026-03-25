import { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';
import SimulationPanel from './components/SimulationPanel';
import InsightsPanel from './components/InsightsPanel';
import AnalyticsCharts from './components/AnalyticsCharts';
import SDGSection from './components/SDGSection';
import { fetchZones, runSimulation, fetchAnalytics } from './utils/api';
import { Layers } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [simParams, setSimParams] = useState({
    rainfall: 15,
    temperature: 30,
    soil_moisture: 40
  });
  const [simResults, setSimResults] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Initial Data Load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const data = await fetchZones();
        setZones(data);
        if (data.length > 0) {
          // fetch initial analytics for the map colors
          const analytics = await fetchAnalytics(simParams);
          setAnalyticsData(analytics);
        }
      } catch (error) {
        console.error("Failed to fetch zones:", error);
      } finally {
        setIsAppLoading(false);
      }
    };
    loadInitialData();
  }, []); // Run once on mount

  const handleParamChange = (key, value) => {
    setSimParams(prev => ({ ...prev, [key]: value }));
  };

  const handleSimulate = async () => {
    if (!selectedZoneId) return;
    
    setIsLoading(true);
    try {
      // 1. Run detailed simulation for selected zone
      const result = await runSimulation(selectedZoneId, simParams);
      setSimResults(result.results);
      
      // 2. Update global analytics to recolor the map
      const analytics = await fetchAnalytics(simParams);
      setAnalyticsData(analytics);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // When clicking a new zone, clear previous specific results
  const handleZoneSelect = (zoneId) => {
    setSelectedZoneId(zoneId);
    setSimResults(null); 
  };

  const selectedZone = zones.find(z => z.id === selectedZoneId);

  if (isAppLoading) {
    return (
      <div className="app-loading">
        <div className="spinner-large"></div>
        <h2>Initializing SmartUrban Engine...</h2>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {/* Top Navigation Bar */}
        <header className="top-header">
          <div className="header-title">
            <Layers size={24} className="text-blue" />
            <h1>{activeTab === 'dashboard' ? 'Urban Overview' 
               : activeTab === 'map' ? 'Digital Twin Simulation'
               : activeTab === 'analytics' ? 'City-wide Analytics'
               : 'SDG Alignment Impact'}</h1>
          </div>
          <div className="user-profile">
            <div className="avatar">PA</div>
            <div className="user-info">
              <span className="name">PA User</span>
              <span className="role">City Planner</span>
            </div>
          </div>
        </header>

        {/* Content Area Routing */}
        <div className="content-scroll">
          
          {(activeTab === 'dashboard' || activeTab === 'map') && (
            <div className="dashboard-grid">
              
              <div className="main-column">
                <MapView 
                  zones={zones} 
                  selectedZoneId={selectedZoneId} 
                  onZoneSelect={handleZoneSelect}
                  analyticsData={analyticsData}
                />
              </div>
              
              <div className="side-column">
                <div className="panel-wrapper glass-card">
                  <SimulationPanel 
                    zone={selectedZone}
                    params={simParams}
                    onParamChange={handleParamChange}
                    onSimulate={handleSimulate}
                    isLoading={isLoading}
                  />
                </div>
                
                <div className="panel-wrapper">
                  <InsightsPanel 
                    results={simResults} 
                    zone={selectedZone}
                  />
                </div>
              </div>
              
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsCharts simParams={simParams} />
          )}

          {activeTab === 'sdg' && (
            <SDGSection />
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
