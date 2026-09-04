import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDemoTour } from '../../context/DemoTourContext';
import {
  LayoutDashboard,
  Sprout,
  Sparkles,
  Users2,
  Boxes,
  Truck,
  MapPin,
  TrendingUp,
  PackageCheck,
  ShoppingCart,
  FilePlus2,
  FileSpreadsheet,
  UserCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { role, user } = useAuth();
  const { setIsAddModalOpen, setIsRequirementModalOpen } = useDemoTour();

  // Role-specific navigation items
  const getNavItems = () => {
    switch (role) {
      case 'Farmer':
        return [
          { id: 'dashboard', label: 'My Farm Dashboard', icon: LayoutDashboard },
          { id: 'ai-demand', label: 'What Buyers Need (AI)', icon: Sparkles, badge: '+21% Tomato' },
          { id: 'matching', label: 'Matched Buyers', icon: Users2 },
          { id: 'price-breakdown', label: 'My Price Breakdown', icon: TrendingUp },
          { id: 'orders', label: 'My Farm Orders', icon: PackageCheck }
        ];
      case 'Bulk Buyer':
        return [
          { id: 'dashboard', label: 'Procurement Dashboard', icon: LayoutDashboard },
          { id: 'matching', label: 'Supply Matching Engine', icon: Users2, badge: '1,000kg Match' },
          { id: 'aggregation', label: 'Supply Aggregation Hub', icon: Boxes },
          { id: 'route-optimization', label: 'Cold-Chain Route Map', icon: Truck },
          { id: 'price-breakdown', label: 'Transparent Price', icon: TrendingUp },
          { id: 'orders', label: 'Bulk Orders Lifecycle', icon: PackageCheck }
        ];
      case 'FPO':
        return [
          { id: 'dashboard', label: 'FPO Cluster Overview', icon: LayoutDashboard },
          { id: 'aggregation', label: 'Supply Aggregation Hub', icon: Boxes },
          { id: 'ai-demand', label: 'AI Demand Forecast', icon: Sparkles },
          { id: 'route-optimization', label: 'Cluster Route Map', icon: Truck },
          { id: 'orders', label: 'Dispatches & Orders', icon: PackageCheck }
        ];
      case 'Consumer':
        return [
          { id: 'marketplace', label: 'Direct Marketplace', icon: ShoppingCart },
          { id: 'orders', label: 'My Orders & Tracking', icon: PackageCheck },
          { id: 'price-breakdown', label: 'Direct Price Breakdown', icon: TrendingUp }
        ];
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart }
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <aside style={{
      width: '260px',
      background: '#ffffff',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.85rem',
      gap: '1.5rem',
      flexShrink: 0
    }}>
      {/* Role Context Profile Card */}
      <div style={{
        background: 'var(--bg-surface-subtle)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=100&q=80'}
          alt={user?.full_name}
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
            {user?.full_name || 'Active User'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-700)', fontWeight: 600 }}>
            {role} • {user?.location?.split(',')[0] || 'Maharashtra'}
          </div>
        </div>
      </div>

      {/* Quick Role Actions */}
      {role === 'Farmer' && (
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn btn-primary btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Sprout size={16} />
          <span>+ Add Fresh Produce</span>
        </button>
      )}

      {role === 'Bulk Buyer' && (
        <button
          onClick={() => setIsRequirementModalOpen(true)}
          className="btn btn-accent btn-sm"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <FilePlus2 size={16} />
          <span>+ Post Bulk Requirement</span>
        </button>
      )}

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: '8px', marginBottom: '4px' }}>
          Core Workflow
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'var(--color-primary-100)' : 'transparent',
                color: isActive ? 'var(--color-primary-900)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color={isActive ? '#15803d' : '#64748b'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  background: '#fef3c7',
                  color: '#b45309',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  border: '1px solid #fde68a'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Trust & Transparency Footer */}
      <div style={{
        padding: '0.85rem',
        background: '#f8fafc',
        borderRadius: '10px',
        fontSize: '0.75rem',
        color: '#64748b',
        lineHeight: 1.4,
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ fontWeight: 700, color: '#334155', marginBottom: '2px' }}>🌱 KisanSetu Direct</div>
        No hidden middleman margins. 100% transparent cost breakdown on all shipments.
      </div>
    </aside>
  );
};
