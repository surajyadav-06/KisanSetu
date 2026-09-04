import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDemoTour } from '../../context/DemoTourContext';
import { produceService } from '../../services/api';
import { Produce } from '../../types';
import {
  Sprout,
  TrendingUp,
  Boxes,
  Users,
  PackageCheck,
  Sparkles,
  PlusCircle,
  Eye,
  MapPin,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { AddProduceModal } from './AddProduceModal';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { setActiveTab, isAddModalOpen, setIsAddModalOpen } = useDemoTour();

  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [metrics, setMetrics] = useState({
    totalProduceListedKg: 1250,
    activeOrders: 8,
    revenue: 48500,
    matchedBuyers: 12,
    aiInsight: 'Tomato demand is expected to increase over the next 7 days (+21%). Action: Increase Grade-A supply.'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await produceService.getFarmerMetrics(user?.id);
      if (data && data.inventory) {
        setProduceList(data.inventory);
        setMetrics(data.metrics);
      }
    } catch (e) {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleProduceAdded = (newProduce: Produce) => {
    setProduceList((prev) => [newProduce, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalProduceListedKg: prev.totalProduceListedKg + (newProduce.quantity_available || 500)
    }));
  };

  return (
    <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Namaste, {user?.full_name?.split(' ')[0] || 'Ramesh'}! 🌾
            </h1>
            <span className="badge badge-success">
              <ShieldCheck size={14} />
              Verified {user?.location?.split(',')[0] || 'Nashik'} Farmer
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
            Here is your produce list, market demand, and matched buyers.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('ai-demand')}
            className="btn btn-secondary"
          >
            <Sparkles size={16} color="#eab308" />
            <span>What Buyers May Need</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            <PlusCircle size={18} />
            <span>+ Add Fresh Produce</span>
          </button>
        </div>
      </div>

      {/* AI Demand Alert Banner (Core Differentiating Feature) */}
      <div style={{
        background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
        border: '1.5px solid #fde68a',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#f59e0b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#92400e' }}>
                AI Demand Signal: Tomato +21% Growth Predicted
              </span>
              <span style={{
                background: '#15803d',
                color: '#ffffff',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                87% Confidence
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#78350f', lineHeight: 1.4 }}>
              <strong>Recommended Action:</strong> Consider increasing Grade-A tomato supply by approximately 350–400 kg. High demand expected from Mumbai institutional kitchens.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('ai-demand')}
          className="btn btn-harvest btn-sm"
        >
          <span>View Forecast & Analytics</span>
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid-cols-auto-fit">
        {/* Stat 1: Total Produce Listed */}
        <div className="ks-card" style={{ borderLeft: '4px solid #15803d' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Produce Added
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={20} color="#15803d" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.totalProduceListedKg.toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500 }}>kg</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={13} />
            <span>Available to buyers</span>
          </div>
        </div>

        {/* Stat 2: Active Orders */}
        <div className="ks-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Your Orders
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PackageCheck size={20} color="#0284c7" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.activeOrders} <span style={{ fontSize: '1rem', fontWeight: 500 }}>orders</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, marginTop: '4px' }}>
            Next dispatch: 10 Sept (Mumbai Reefer Route)
          </div>
        </div>

        {/* Stat 3: Realized Revenue */}
        <div className="ks-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Earnings
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} color="#d97706" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ₹{metrics.revenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
            +39% higher than APMC mandi baseline
          </div>
        </div>

        {/* Stat 4: Matched Buyers */}
        <div className="ks-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Interested Buyers
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color="#8b5cf6" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {metrics.matchedBuyers} <span style={{ fontSize: '1rem', fontWeight: 500 }}>buyers</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600, marginTop: '4px' }}>
            Taj Hotels, BigBasket Hub, Mumbai Fresh
          </div>
        </div>
      </div>

      {/* Produce Inventory Section */}
      <div className="ks-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Produce List</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              All crops you have added for sale.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              <PlusCircle size={15} />
              <span>Add New Lot</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="ks-table-container">
          <table className="ks-table">
            <thead>
              <tr>
                <th>Crop & Photo</th>
                <th>Quantity</th>
                <th>Grade</th>
                <th>Perishability</th>
                <th>Farm Location</th>
                <th>Expected Price</th>
                <th>Status</th>
                <th>Harvest / Available</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {produceList.length > 0 ? (
                produceList.map((item) => {
                  const perishability = item.perishability || (['Tomato', 'Grapes'].includes(item.crop_name) ? 'High' : ['Banana'].includes(item.crop_name) ? 'Medium' : 'Low');
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=80'}
                            alt={item.crop_name}
                            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                          />
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.crop_name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lot #{item.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, fontSize: '0.9375rem' }}>
                        {item.quantity_available} {item.unit}
                      </td>
                      <td>
                        <span className="badge badge-primary">{item.grade}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: perishability === 'High' ? '#fee2e2' : perishability === 'Medium' ? '#fef3c7' : '#dcfce7',
                            color: perishability === 'High' ? '#991b1b' : perishability === 'Medium' ? '#92400e' : '#166534',
                            border: `1px solid ${perishability === 'High' ? '#fecaca' : perishability === 'Medium' ? '#fde68a' : '#bbf7d0'}`
                          }}
                        >
                          {perishability}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem' }}>
                          <MapPin size={14} color="#15803d" />
                          <span>{item.location}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: '#15803d', fontSize: '0.9375rem' }}>
                        ₹{item.expected_price}/{item.unit}
                      </td>
                      <td>
                        <span className={`badge ${item.status === 'Sold Out' ? 'badge-danger' : 'badge-success'}`}>
                          <CheckCircle2 size={12} />
                          {item.status || 'Available'}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} />
                          <span>{item.harvest_date ? `Harvest: ${item.harvest_date}` : item.available_from || '10 Sept 2026'}</span>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => setActiveTab('matching')}
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        >
                          <Eye size={13} />
                          <span>View Matches</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    You haven't listed any produce yet. Click "Add Fresh Produce" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Produce Modal */}
      <AddProduceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProduceAdded={handleProduceAdded}
      />
    </div>
  );
};
