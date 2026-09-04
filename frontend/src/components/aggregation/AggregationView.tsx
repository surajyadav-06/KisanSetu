import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDemoTour } from '../../context/DemoTourContext';
import { aggregationService } from '../../services/api';
import { Aggregation } from '../../types';
import {
  Boxes,
  Truck,
  Building2,
  Sprout,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Scale,
  MapPin,
  FileSpreadsheet
} from 'lucide-react';

export const AggregationView: React.FC = () => {
  const { setActiveTab, nextStep, currentStep } = useDemoTour();
  const [aggregations, setAggregations] = useState<Aggregation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAggregations();
  }, []);

  const fetchAggregations = async () => {
    setIsLoading(true);
    try {
      const data = await aggregationService.getAggregations();
      if (data && data.length > 0) {
        setAggregations(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const latestAgg = aggregations.length > 0 ? aggregations[0] : null;

  const farmers = (latestAgg && latestAgg.items && latestAgg.items.length > 0)
    ? latestAgg.items.map((item) => ({
        name: item.farmer_name,
        location: item.location,
        qty: item.allocated_quantity,
        price: item.unit_price,
        grade: item.grade || 'Grade A',
        share: `${Math.round((item.allocated_quantity / (latestAgg.total_quantity || 1000)) * 100)}%`
      }))
    : [
        { name: 'Farmer A (Ramesh Patil)', location: 'Nashik', qty: 500, price: 28, grade: 'Grade A', share: '50%' },
        { name: 'Farmer B (Suresh Shinde)', location: 'Nashik', qty: 300, price: 27, grade: 'Grade A', share: '30%' },
        { name: 'Farmer C (Vikas Gaikwad)', location: 'Pune', qty: 200, price: 29, grade: 'Grade A', share: '20%' }
      ];

  const totalQty = latestAgg?.total_quantity || 1000;
  const avgPrice = latestAgg?.average_price || 27.90;
  const totalAmount = Math.round(totalQty * avgPrice);
  const cropName = latestAgg?.crop_name || 'Tomato';
  const farmerCount = farmers.length;

  const handleProceedToLogistics = () => {
    if (currentStep.stepNumber === 7 || currentStep.stepNumber === 8) {
      nextStep();
    } else {
      setActiveTab('logistics');
    }
  };

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
              <Boxes size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Combine Farmer Produce</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Bringing together produce from multiple farmers to fulfill a single large order.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleProceedToLogistics}
          className="btn btn-primary btn-lg"
          style={{ boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)' }}
        >
          <Truck size={20} />
          <span>Plan Logistics & Route</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Requirement Fulfilled Banner */}
      <div style={{
        background: '#ecfdf5',
        border: '2px solid #86efac',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#15803d',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#065f46' }}>
              Order Ready: 1,000 kg Grade-A Tomato
            </div>
            <p style={{ fontSize: '0.875rem', color: '#047857' }}>
              Collected from 3 farmers across Nashik and Pune into 1 delivery batch.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>Total Quantity</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46' }}>1,000 kg</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>Average Price</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46' }}>₹27.90/kg</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>Number of Farmers</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46' }}>3 Farmers</div>
          </div>
        </div>
      </div>

      {/* Visual Aggregation Node Architecture (Core Requirement) */}
      <div className="ks-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>
          How We Combine Orders
        </h2>

        {/* Top: 3 Farmer Nodes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          {farmers.map((f, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                border: '1.5px solid #bbf7d0',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#15803d',
                color: '#ffffff',
                fontSize: '0.6875rem',
                fontWeight: 700,
                padding: '2px 10px',
                borderRadius: '10px'
              }}>
                FARMER {i + 1}
              </div>

              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                margin: '8px auto 10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sprout size={22} />
              </div>

              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{f.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                <MapPin size={13} color="#15803d" />
                <span>{f.location}, Maharashtra</span>
              </div>

              <div style={{
                marginTop: '12px',
                padding: '8px',
                background: '#f0fdf4',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-around',
                fontSize: '0.8125rem'
              }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Allocated</div>
                  <strong style={{ color: '#15803d', fontSize: '0.9375rem' }}>{f.qty} kg</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Price</div>
                  <strong>₹{f.price}/kg</strong>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>Share</div>
                  <strong style={{ color: '#0284c7' }}>{f.share}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Down Arrows & Aggregation Formula */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', margin: '1rem 0' }}>
          <div style={{
            background: '#fef3c7',
            border: '1px solid #fde68a',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: '#b45309'
          }}>
            500 kg (Farmer A) + 300 kg (Farmer B) + 200 kg (Farmer C) = 1,000 kg Total
          </div>
          <ArrowDown size={24} color="#15803d" />
        </div>

        {/* Center: KisanSetu Cluster Consolidation Hub */}
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '2px solid #86efac',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '560px',
          margin: '0 auto 1.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#15803d',
            color: '#ffffff',
            margin: '0 auto 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(21, 128, 61, 0.25)'
          }}>
            <Boxes size={26} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#14532d' }}>
            Quality Check & Packing Center (Nashik)
          </div>
          <p style={{ fontSize: '0.8125rem', color: '#166534', marginTop: '4px' }}>
            Checking quality, weighing, and packing produce for delivery.
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 1.5rem' }}>
          <ArrowDown size={24} color="#ea580c" />
        </div>

        {/* Bottom: Single Bulk Buyer Order Node */}
        <div style={{
          background: '#ffffff',
          border: '2px solid #fed7aa',
          borderRadius: '16px',
          padding: '1.5rem',
          maxWidth: '560px',
          margin: '0 auto',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: '#ea580c',
            color: '#ffffff',
            margin: '0 auto 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(234, 88, 12, 0.25)'
          }}>
            <Building2 size={26} />
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#19271d' }}>
            Taj Luxury Hospitality & Mumbai Fresh Mart
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Delivery Order: <strong>1,000 kg Grade-A Tomato</strong>
          </div>
          <div style={{ fontSize: '0.8125rem', color: '#15803d', fontWeight: 700, marginTop: '6px' }}>
            Single Bill • Quality Checked • No Middlemen
          </div>
        </div>
      </div>
    </div>
  );
};
