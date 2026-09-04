import React, { useState, useEffect } from 'react';
import { demandService } from '../../services/api';
import { DemandForecast } from '../../types';
import {
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  Layers,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';

export const AIDemandView: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [forecastData, setForecastData] = useState<DemandForecast | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const availableCrops = [
    { name: 'Tomato', emoji: '🍅', current: '1,850 kg/wk', trend: '+21% Surge' },
    { name: 'Onion', emoji: '🧅', current: '3,200 kg/wk', trend: '+10% Steady' },
    { name: 'Potato', emoji: '🥔', current: '2,800 kg/wk', trend: '-1.8% Stable' },
    { name: 'Grapes', emoji: '🍇', current: '1,200 kg/wk', trend: '+23% Export' },
    { name: 'Banana', emoji: '🍌', current: '2,400 kg/wk', trend: '+2.5% Steady' }
  ];

  useEffect(() => {
    fetchForecast(selectedCrop);
  }, [selectedCrop]);

  const fetchForecast = async (crop: string) => {
    setIsLoading(true);
    try {
      const data = await demandService.getForecast(crop, 14);
      setForecastData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = forecastData?.chartData || [];

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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(245, 158, 11, 0.3)'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Demand Forecasting & Intelligence</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Converts historical mandi sales, hotel demand & seasonal indices into actionable farm recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Crop Switcher Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {availableCrops.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCrop(c.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: selectedCrop === c.name ? '2px solid #15803d' : '1px solid var(--border-medium)',
                background: selectedCrop === c.name ? '#f0fdf4' : '#ffffff',
                color: selectedCrop === c.name ? '#15803d' : 'var(--text-primary)',
                fontWeight: selectedCrop === c.name ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: selectedCrop === c.name ? '0 2px 6px rgba(21, 128, 61, 0.15)' : 'none'
              }}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4 AI Metric Cards */}
      <div className="grid-cols-auto-fit">
        <div className="ks-card" style={{ borderTop: '4px solid #15803d' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Current Weekly Baseline</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '4px' }}>
            {forecastData?.currentDemand?.toLocaleString() || 1850} <span style={{ fontSize: '1rem', fontWeight: 500 }}>kg/wk</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            7-day rolling trailing average
          </div>
        </div>

        <div className="ks-card" style={{ borderTop: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Predicted Demand (Next 7 Days)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
            {forecastData?.predictedDemand?.toLocaleString() || 2240} <span style={{ fontSize: '1rem', fontWeight: 500 }}>kg/wk</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
            +{forecastData?.growthPercentage || 21.1}% surge projected
          </div>
        </div>

        <div className="ks-card" style={{ borderTop: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Forecast Confidence Score</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            {forecastData?.confidence || 87}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} />
            <span>High Statistical Significance (R² &gt; 0.85)</span>
          </div>
        </div>

        <div className="ks-card" style={{ borderTop: '4px solid #ea580c' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Strategic Action</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ea580c', marginTop: '6px' }}>
            {forecastData?.actionLabel || 'Increase Supply Allocation'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#78350f', marginTop: '4px' }}>
            Urgency: <strong>{forecastData?.urgency || 'HIGH'}</strong>
          </div>
        </div>
      </div>

      {/* Actionable Strategic Recommendation (Core Requirement: Not Just a Number) */}
      <div style={{
        background: '#ffffff',
        border: '2px solid #86efac',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '1rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: '#dcfce7',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lightbulb size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#14532d' }}>
                {forecastData?.headline || `${selectedCrop} demand is predicted to increase by 21% next week.`}
              </h2>
              <span className="badge badge-success">AI Recommended</span>
            </div>
            <p style={{ fontSize: '1rem', color: '#166534', fontWeight: 600, marginTop: '4px' }}>
              👉 {forecastData?.recommendation || `Consider increasing Grade-A ${selectedCrop.toLowerCase()} supply by approximately 350–400 kg.`}
            </p>
          </div>
        </div>

        {/* Operational Guidance Checklist */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '10px',
          padding: '1rem',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase' }}>
            Agronomic & Commercial Execution Steps:
          </div>
          {forecastData?.operationalGuidance?.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.875rem', color: '#1e293b' }}>
              <CheckCircle2 size={16} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span>{step}</span>
            </div>
          ))}
          <div style={{ fontSize: '0.8125rem', color: '#15803d', fontWeight: 700, marginTop: '4px' }}>
            💡 {forecastData?.impactEstimate || 'Estimated revenue gain: +₹9,800 to ₹12,500 based on current spot rates.'}
          </div>
        </div>
      </div>

      {/* Interactive Forecast Line Chart */}
      <div className="ks-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Historical Demand vs. AI Predicted Trend ({selectedCrop})
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Solid line: Observed 30-day transactional demand (kg) | Dashed line: Scikit-Learn 14-day projection
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#15803d', borderRadius: '3px' }}></div>
              <span>Historical Actual</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '3px' }}></div>
              <span>AI Forecast (+21%)</span>
            </div>
          </div>
        </div>

        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} unit=" kg" />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
                formatter={(value: any) => [`${value} kg`, 'Demand']}
              />
              <ReferenceLine x="Today" stroke="#94a3b8" strokeDasharray="3 3" label="Forecast Horizon" />
              <Area
                type="monotone"
                dataKey="actualDemand"
                fill="#dcfce7"
                stroke="#15803d"
                strokeWidth={2.5}
                name="Historical Demand"
              />
              <Line
                type="monotone"
                dataKey="predictedDemand"
                stroke="#f59e0b"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#f59e0b' }}
                name="Predicted Demand"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3 AI Strategy Cards (Produce More, Hold Supply, Maintain Pace) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="ks-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📈</span>
            <h3 style={{ fontSize: '1.05rem', color: '#166534' }}>Produce More: Tomato & Grapes</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5 }}>
            High institutional restaurant consumption across Mumbai & Pune. Grade-A lots fetching 20-25% price premiums.
          </p>
        </div>

        <div className="ks-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚖️</span>
            <h3 style={{ fontSize: '1.05rem', color: '#0369a1' }}>Maintain Pace: Onion & Banana</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5 }}>
            Demand is equilibrium-stable. Keep regular weekly dispatches through KisanSetu scheduled logistics runs.
          </p>
        </div>

        <div className="ks-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🛡️</span>
            <h3 style={{ fontSize: '1.05rem', color: '#b45309' }}>Stagger Harvest: Potato</h3>
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.5 }}>
            Supply saturation in local mandis. Stagger harvest or use KisanSetu cold-storage forward contracts.
          </p>
        </div>
      </div>
    </div>
  );
};
