import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DemoTourProvider, useDemoTour } from './context/DemoTourContext';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { FarmerDashboard } from './components/farmer/FarmerDashboard';
import { BuyerDashboard } from './components/buyer/BuyerDashboard';
import { MatchingEngineView } from './components/matching/MatchingEngineView';
import { AIDemandView } from './components/forecast/AIDemandView';
import { AggregationView } from './components/aggregation/AggregationView';
import { RouteOptimizationView } from './components/logistics/RouteOptimizationView';
import { PriceBreakdownView } from './components/price/PriceBreakdownView';
import { OrderLifecycleView } from './components/orders/OrderLifecycleView';
import { MarketplaceView } from './components/marketplace/MarketplaceView';

import { FpoDashboard } from './components/fpo/FpoDashboard';

const MainAppContent: React.FC = () => {
  const { role } = useAuth();
  const { activeTab, setActiveTab } = useDemoTour();
  const [isLanding, setIsLanding] = useState(true);

  if (isLanding) {
    return (
      <LandingPage
        onEnterApp={(tab) => {
          setIsLanding(false);
          if (tab) setActiveTab(tab);
        }}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (role === 'Bulk Buyer') return <BuyerDashboard />;
        if (role === 'Consumer') return <MarketplaceView />;
        if (role === 'FPO') return <FpoDashboard />;
        return <FarmerDashboard />;
      case 'my-produce':
        return <FarmerDashboard />;
      case 'requirements':
        return <BuyerDashboard />;
      case 'matching':
        return <MatchingEngineView />;
      case 'ai-demand':
        return <AIDemandView />;
      case 'aggregation':
        return <AggregationView />;
      case 'logistics':
      case 'route-optimization':
        return <RouteOptimizationView />;
      case 'price-breakdown':
        return <PriceBreakdownView />;
      case 'orders':
        return <OrderLifecycleView />;
      case 'marketplace':
        return <MarketplaceView />;
      default:
        if (role === 'Bulk Buyer') return <BuyerDashboard />;
        if (role === 'Consumer') return <MarketplaceView />;
        if (role === 'FPO') return <FpoDashboard />;
        return <FarmerDashboard />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      {/* Main SaaS Navbar */}
      <Navbar onNavigateLanding={() => setIsLanding(true)} />

      {/* Main Layout: Sidebar + Dashboard Content */}
      <div className="app-container">
        <Sidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />
        <main className="main-content">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DemoTourProvider>
          <MainAppContent />
        </DemoTourProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
