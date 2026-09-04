import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDemoTour } from '../../context/DemoTourContext';
import { priceService } from '../../services/api';
import { PriceBreakdownResponse } from '../../types';
import {
  TrendingUp,
  ShieldCheck,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PieChart as PieIcon,
  HelpCircle,
  Coins
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';

export const PriceBreakdownView: React.FC = () => {
  const { role } = useAuth();
  const { setActiveTab, nextStep, currentStep } = useDemoTour();

  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [viewMode, setViewMode] = useState<'farmer' | 'buyer'>('farmer');
  const [priceData, setPriceData] = useState<PriceBreakdownResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPriceBreakdown(selectedCrop);
  }, [selectedCrop]);

  const fetchPriceBreakdown = async (crop: string) => {
    setIsLoading(true);
    try {
      const data = await priceService.getPriceBreakdown(crop);
      setPriceData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const breakdownItems = priceData?.breakdown || [
    { component: 'Farmer Direct Realization', amount: 27, unit: '₹/kg', percentage: 84.4, color: '#15803d', description: 'Direct payout to farmer bank account' },
    { component: 'Aggregation & Sorting / QC', amount: 1, unit: '₹/kg', percentage: 3.1, color: '#f59e0b', description: 'Quality inspection & batch crate tagging' },
    { component: 'Cold-Chain & Route Logistics', amount: 2, unit: '₹/kg', percentage: 6.3, color: '#0284c7', description: 'Multi-pickup temperature-controlled Reefer transit' },
    { component: 'KisanSetu Platform Service', amount: 1, unit: '₹/kg', percentage: 3.1, color: '#8b5cf6', description: 'AI demand engine, smart contracts & escrow' },
    { component: 'Handling & Protective Crates', amount: 1, unit: '₹/kg', percentage: 3.1, color: '#64748b', description: 'Sanitized food-grade crates & handling' }
  ];

  const total = priceData?.buyerPricePerKg || 32;
  const farmerPayout = priceData?.farmerPayoutPerKg || 27;

  return (
    <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(21, 128, 61, 0.25)'
            }}>
              <Coins size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Transparent Price Breakdown</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Open-book unit economics showing exactly where every rupee flows between farmgate and consumer.
              </p>
            </div>
          </div>
        </div>

        {/* View Toggle (Farmer View vs Buyer View) */}
        <div style={{ display: 'flex', background: 'var(--bg-surface-subtle)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-medium)' }}>
          <button
            onClick={() => setViewMode('farmer')}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'farmer' ? '#ffffff' : 'transparent',
              fontWeight: viewMode === 'farmer' ? 700 : 500,
              color: viewMode === 'farmer' ? '#15803d' : 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: viewMode === 'farmer' ? 'var(--shadow-xs)' : 'none',
              fontSize: '0.875rem'
            }}
          >
            🌾 Farmer Earnings View
          </button>

          <button
            onClick={() => setViewMode('buyer')}
            style={{
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              background: viewMode === 'buyer' ? '#ffffff' : 'transparent',
              fontWeight: viewMode === 'buyer' ? 700 : 500,
              color: viewMode === 'buyer' ? '#ea580c' : 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: viewMode === 'buyer' ? 'var(--shadow-xs)' : 'none',
              fontSize: '0.875rem'
            }}
          >
            🏢 Bulk Buyer Landed Cost
          </button>
        </div>
      </div>

      {/* Perspective Summary Banner */}
      {viewMode === 'farmer' ? (
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '2px solid #86efac',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>
              Your Net Realization for 500 kg Lot
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#14532d', marginTop: '2px' }}>
              ₹{(500 * farmerPayout).toLocaleString()} <span style={{ fontSize: '1.15rem', fontWeight: 600 }}>(@ ₹{farmerPayout}/kg)</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
              ✓ You retain <strong>84.4%</strong> of the total buyer purchase price. Zero commission deductions.
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '12px 18px', borderRadius: '12px', border: '1px solid #bbf7d0', textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Traditional APMC Mandi Realization</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#dc2626', textDecoration: 'line-through' }}>
              ₹9,700 (@ ₹19.4/kg)
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d' }}>
              +₹3,800 (+39.2%) Extra Earnings via KisanSetu
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
          border: '2px solid #fed7aa',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8125rem', color: '#9a3412', fontWeight: 700, textTransform: 'uppercase' }}>
              Total Landed Cost for 1,000 kg Consignment
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#7c2d12', marginTop: '2px' }}>
              ₹{(1000 * total).toLocaleString()} <span style={{ fontSize: '1.15rem', fontWeight: 600 }}>(@ ₹{total}/kg)</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#c2410c', fontWeight: 600, marginTop: '4px' }}>
              ✓ Includes direct farm payout, Reefer logistics, QC grading and doorstep delivery.
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '12px 18px', borderRadius: '12px', border: '1px solid #fed7aa', textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Traditional Multi-Trader Wholesale Price</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#dc2626', textDecoration: 'line-through' }}>
              ₹41,000 (@ ₹41/kg)
            </div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d' }}>
              -₹9,000 (-21.9%) Total Cost Savings
            </div>
          </div>
        </div>
      )}

      {/* Main Transparent Cost Breakdown Table & Waterfall */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Table of Components */}
        <div className="ks-card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Unit Cost Breakdown (Per kg Basis)
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {breakdownItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '4px', background: item.color }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {item.component}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.description}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: item.color }}>
                    ₹{item.amount.toFixed(2)}/kg
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {item.percentage}% of total
                  </div>
                </div>
              </div>
            ))}

            {/* Total Row */}
            <div style={{
              marginTop: '8px',
              padding: '14px',
              borderRadius: '10px',
              background: '#15803d',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontWeight: 800, fontSize: '1rem' }}>Total Buyer Landed Cost</span>
              <span style={{ fontWeight: 800, fontSize: '1.25rem' }}>₹{total.toFixed(2)}/kg</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualizer */}
        <div className="ks-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
            Value Share Distribution
          </h2>

          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdownItems} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" unit="₹" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="component" tick={{ fontSize: 10, fill: '#475569' }} width={120} />
                <Tooltip formatter={(val: any) => [`₹${val}/kg`, 'Share']} />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                  {breakdownItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '10px',
            background: 'var(--bg-surface-subtle)',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            🌱 <strong>KisanSetu Principle:</strong> We do not claim intermediaries vanish; we eliminate unnecessary speculative layers and make operational costs 100% auditable.
          </div>
        </div>
      </div>
    </div>
  );
};
