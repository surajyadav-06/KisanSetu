import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDemoTour } from '../../context/DemoTourContext';
import { buyerService } from '../../services/api';
import { BuyerRequirement } from '../../types';
import {
  Building2,
  FilePlus2,
  Users2,
  Boxes,
  Truck,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PostRequirementModal } from './PostRequirementModal';

export const BuyerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { setActiveTab, isRequirementModalOpen, setIsRequirementModalOpen, nextStep, currentStep } = useDemoTour();
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchRequirements();
  }, [user]);

  const fetchRequirements = async () => {
    setIsLoading(true);
    try {
      const data = await buyerService.getRequirements();
      setRequirements(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequirementCreated = (newReq: BuyerRequirement) => {
    setRequirements((prev) => [newReq, ...prev]);
  };

  return (
    <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Buyer Dashboard 🏢
            </h1>
            <span className="badge badge-warning">
              Institutional Buyer
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
            {user?.full_name || 'Taj Hospitality Group & Mumbai Fresh Mart'} • Manage your orders and requirements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('matching')}
            className="btn btn-secondary"
          >
            <Users2 size={16} color="#15803d" />
            <span>View Matched Farmers</span>
          </button>
          <button
            onClick={() => setIsRequirementModalOpen(true)}
            className="btn btn-accent"
          >
            <FilePlus2 size={18} />
            <span>+ Add New Request</span>
          </button>
        </div>
      </div>

      {/* 4 Buyer Metric Cards */}
      <div className="grid-cols-auto-fit">
        <div className="ks-card" style={{ borderLeft: '4px solid #ea580c' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Open Requests</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
            {requirements.length || 1} <span style={{ fontSize: '1rem', fontWeight: 500 }}>open</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ea580c', fontWeight: 600, marginTop: '4px' }}>
            1,000 kg Grade-A Tomato active
          </div>
        </div>

        <div className="ks-card" style={{ borderLeft: '4px solid #15803d' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Matched Farmers</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
            100% <span style={{ fontSize: '1rem', fontWeight: 500 }}>matched</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
            3 verified farmers ready in Nashik/Pune
          </div>
        </div>

        <div className="ks-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Average Price</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            ₹32.00/kg
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
            -21.9% lower than traditional wholesale
          </div>
        </div>

        <div className="ks-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Delivery Route</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>
            42 km <span style={{ fontSize: '1rem', fontWeight: 500 }}>route</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Tata 407 Reefer Van Assigned
          </div>
        </div>
      </div>

      {/* Active Requirements List */}
      <div className="ks-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Open Requests</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Requests sent to farmers.
            </p>
          </div>

          <button
            onClick={() => setIsRequirementModalOpen(true)}
            className="btn btn-accent btn-sm"
          >
            <FilePlus2 size={15} />
            <span>Add Request</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {requirements.map((req) => (
            <div
              key={req.id}
              style={{
                padding: '1.25rem',
                borderRadius: '12px',
                background: '#ffffff',
                border: '1.5px solid #fed7aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    {req.required_quantity} {req.unit} of {req.required_grade} {req.crop_name}
                  </span>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} />
                    Supply Matched (100%)
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#15803d" />
                    <span>Destination: {req.delivery_location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    <span>Required by: {req.required_date}</span>
                  </div>
                  <div>
                    Budget: <strong>Max ₹{req.max_price}/kg</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setActiveTab('matching')}
                  className="btn btn-primary btn-sm"
                >
                  <Users2 size={15} />
                  <span>View Matched Farmers (3 Lots)</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PostRequirementModal
        isOpen={isRequirementModalOpen}
        onClose={() => setIsRequirementModalOpen(false)}
        onRequirementCreated={handleRequirementCreated}
      />
    </div>
  );
};
