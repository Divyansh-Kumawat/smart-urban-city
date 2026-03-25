import React from 'react';
import {
  LayoutDashboard,
  Map,
  BarChart3,
  Leaf,
  Settings,
  ShieldAlert,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Digital Twin', icon: Map },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'sdg', label: 'SDG Impact', icon: Leaf },
  ];

  return (
    <aside className="sidebar glass-card">
      <div className="sidebar-header">
        <div className="logo-container">
          <ShieldAlert className="logo-icon" size={28} />
        </div>
        <div>
          <h1 className="brand-title">SmartUrban</h1>
          <p className="brand-subtitle">AI Landscape Engine</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} className="nav-icon" />
              <span>{item.label}</span>
              {activeTab === item.id && <div className="active-indicator" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <Settings size={20} className="nav-icon" />
          <span>Settings</span>
        </button>
        <div className="system-status">
          <div className="status-dot"></div>
          <span>System Online</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
