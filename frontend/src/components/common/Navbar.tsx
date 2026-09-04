import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDemoTour } from '../../context/DemoTourContext';
import { demoService } from '../../services/api';
import {
  Sprout,
  Users,
  Building2,
  ShoppingCart,
  TrendingUp,
  RotateCcw,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Bell,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../../types';

interface NavbarProps {
  onNavigateLanding?: () => void;
  isLanding?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateLanding, isLanding = false }) => {
  const { user, role, switchDemoRole, logout } = useAuth();
  const { showToast } = useToast();
  const { setActiveTab } = useDemoTour();
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await demoService.resetDemoData();
      showToast('success', 'Database Reset', 'Demo data successfully refreshed to original pristine state.');
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (e) {
      showToast('error', 'Reset Failed', 'Could not reset demo database.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleRoleSelect = (targetRole: UserRole) => {
    switchDemoRole(targetRole);
    setRoleDropdownOpen(false);
    if (targetRole === 'Farmer') setActiveTab('dashboard');
    else if (targetRole === 'Bulk Buyer') setActiveTab('matching');
    else if (targetRole === 'Consumer') setActiveTab('marketplace');
    else if (targetRole === 'FPO') setActiveTab('aggregation');
  };

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
    }}>
      {/* Brand Logo */}
      <div
        onClick={onNavigateLanding}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(21, 128, 61, 0.25)'
        }}>
          <Sprout size={24} color="#fef08a" />
        </div>
        <div>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            color: '#15803d',
            lineHeight: 1.1,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            KisanSetu
          </div>
          <div style={{ fontSize: '0.75rem', color: '#738378', fontWeight: 500 }}>
            Farm-to-Market Operating System
          </div>
        </div>
      </div>

      {/* Center Actions / Links */}
      {!isLanding && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('ai-demand')}
            className="btn btn-ghost btn-sm"
            style={{ color: '#15803d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={16} color="#eab308" />
            AI Demand Forecast
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="btn btn-ghost btn-sm"
            style={{ fontWeight: 600 }}
          >
            <ShoppingCart size={16} />
            Marketplace
          </button>
          <button
            onClick={() => setActiveTab('price-breakdown')}
            className="btn btn-ghost btn-sm"
            style={{ fontWeight: 600 }}
          >
            <TrendingUp size={16} />
            Price Breakdown
          </button>
        </div>
      )}

      {/* Right Controls: Role Selector, Reset, User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          disabled={isResetting}
          title="Reset database to original demo state"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-medium)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: '#4b5a50',
            cursor: isResetting ? 'wait' : 'pointer'
          }}
        >
          <RotateCcw size={14} className={isResetting ? 'spin' : ''} />
          <span>Reset Demo</span>
        </button>

        {/* 1-Click Role Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f0fdf4',
              border: '1.5px solid #86efac',
              borderRadius: '10px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              color: '#166534'
            }}
          >
            {role === 'Farmer' && <Sprout size={16} color="#15803d" />}
            {role === 'Bulk Buyer' && <Building2 size={16} color="#ea580c" />}
            {role === 'FPO' && <Users size={16} color="#0284c7" />}
            {role === 'Consumer' && <ShoppingCart size={16} color="#9333ea" />}
            <span>Role: <strong>{role}</strong></span>
            <ChevronDown size={14} />
          </button>

          {roleDropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 6px)',
              width: '240px',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              padding: '6px',
              zIndex: 100,
              animation: 'fadeIn 0.15s ease-out'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#738378', padding: '6px 10px', textTransform: 'uppercase' }}>
                Switch Demo Persona
              </div>
              <button
                onClick={() => handleRoleSelect('Farmer')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'Farmer' ? '#f0fdf4' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: role === 'Farmer' ? 700 : 500,
                  color: '#15803d',
                  fontSize: '0.875rem'
                }}
              >
                <Sprout size={16} />
                <div>
                  <div>Farmer (Ramesh Patil)</div>
                  <div style={{ fontSize: '0.75rem', color: '#738378', fontWeight: 400 }}>Nashik Produce Lister</div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('Bulk Buyer')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'Bulk Buyer' ? '#fff7ed' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: role === 'Bulk Buyer' ? 700 : 500,
                  color: '#ea580c',
                  fontSize: '0.875rem'
                }}
              >
                <Building2 size={16} />
                <div>
                  <div>Bulk Buyer (Taj Hotels)</div>
                  <div style={{ fontSize: '0.75rem', color: '#738378', fontWeight: 400 }}>1,000kg Institutional Order</div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('FPO')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'FPO' ? '#f0f9ff' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: role === 'FPO' ? 700 : 500,
                  color: '#0284c7',
                  fontSize: '0.875rem'
                }}
              >
                <Users size={16} />
                <div>
                  <div>FPO (Sahyadri Co.)</div>
                  <div style={{ fontSize: '0.75rem', color: '#738378', fontWeight: 400 }}>Cluster Aggregator</div>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('Consumer')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: 'none',
                  background: role === 'Consumer' ? '#faf5ff' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: role === 'Consumer' ? 700 : 500,
                  color: '#9333ea',
                  fontSize: '0.875rem'
                }}
              >
                <ShoppingCart size={16} />
                <div>
                  <div>Consumer (Priya Sharma)</div>
                  <div style={{ fontSize: '0.75rem', color: '#738378', fontWeight: 400 }}>Retail Direct Buyer</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* User Badge */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=100&q=80'}
              alt={user.full_name}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #86efac'
              }}
            />
          </div>
        )}
      </div>
    </header>
  );
};
