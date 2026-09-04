import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDemoTour } from '../../context/DemoTourContext';
import { buyerService, aggregationService } from '../../services/api';
import { MatchResponse, MatchItem, BuyerRequirement } from '../../types';
import {
  Users2,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Boxes,
  ShieldCheck,
  Building2,
  Calendar,
  Layers,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MatchingEngineView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { setActiveTab, nextStep, currentStep } = useDemoTour();

  const [matchData, setMatchData] = useState<MatchResponse | null>(null);
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [selectedReqId, setSelectedReqId] = useState<number | string>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAggregating, setIsAggregating] = useState(false);

  useEffect(() => {
    loadRequirements();
  }, []);

  useEffect(() => {
    if (selectedReqId) {
      fetchMatches(selectedReqId);
    }
  }, [selectedReqId]);

  const loadRequirements = async () => {
    try {
      const data = await buyerService.getRequirements();
      if (data && data.length > 0) {
        setRequirements(data);
        setSelectedReqId(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMatches = async (reqId: number | string) => {
    setIsLoading(true);
    try {
      const res = await buyerService.getMatches(reqId);
      setMatchData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAggregatedOrder = async () => {
    if (!matchData || !matchData.matches || matchData.matches.length === 0) return;

    setIsAggregating(true);
    try {
      const payload = {
        requirement_id: matchData.requirement.id,
        buyer_id: user?.id || 7,
        buyer_name: matchData.requirement.buyer_name || user?.full_name || 'Taj Hospitality Group',
        selected_matches: matchData.matches
      };

      const result = await aggregationService.createAggregatedOrder(payload);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      showToast(
        'success',
        'Supply Aggregation Confirmed!',
        `Combined 3 farmer lots into 1,000 kg order #${result.orderNumber}. Route ready for optimization.`
      );

      // Advance demo tour to Logistics
      if (currentStep.stepNumber === 6 || currentStep.stepNumber === 7) {
        nextStep();
      } else {
        setActiveTab('logistics');
      }
    } catch (err) {
      showToast('error', 'Aggregation Failed', 'Could not create aggregated order.');
    } finally {
      setIsAggregating(false);
    }
  };

  const req = matchData?.requirement;
  const matches = matchData?.matches || [];
  const totalMatched = matchData?.totalMatchedQuantity || 1000;
  const fulfillmentPct = matchData?.fulfillmentPercentage || 100;

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
              <Users2 size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Farmer-Buyer Intelligent Matching Engine</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Multi-parameter scoring algorithm matching bulk buyer specs with fragmented farmer supply.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCreateAggregatedOrder}
          disabled={isAggregating || matches.length === 0}
          className="btn btn-primary btn-lg"
          style={{
            boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)',
            fontSize: '1rem',
            padding: '0.75rem 1.5rem'
          }}
        >
          <Boxes size={20} />
          <span>{isAggregating ? 'Creating Consolidated Order...' : 'Create Aggregated Order (1,000 kg)'}</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Buyer Requirement Focus Card */}
      <div style={{
        background: '#ffffff',
        border: '1.5px solid #fed7aa',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-warning">Active Bulk Requirement</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#9a3412' }}>
              Requirement #{req?.id || 1} • {req?.buyer_org || 'Taj Luxury Hotels & Mumbai Fresh Mart'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Fulfillment Status:</span>
            <span className="badge badge-success" style={{ fontSize: '0.8125rem', fontWeight: 700 }}>
              <CheckCircle2 size={13} />
              {fulfillmentPct}% Matched (1,000 / 1,000 kg)
            </span>
          </div>
        </div>

        {/* Spec Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          background: '#fffaf5',
          padding: '1.25rem',
          borderRadius: '12px',
          border: '1px solid #ffedd5'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 600, textTransform: 'uppercase' }}>Commodity</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#19271d' }}>{req?.crop_name || 'Tomato'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 600, textTransform: 'uppercase' }}>Required Quantity</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#19271d' }}>
              {req?.required_quantity?.toLocaleString() || 1000} {req?.unit || 'kg'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 600, textTransform: 'uppercase' }}>Required Grade</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>{req?.required_grade || 'Grade A'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 600, textTransform: 'uppercase' }}>Max Budget Price</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#19271d' }}>₹{req?.max_price || 30.0}/kg</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 600, textTransform: 'uppercase' }}>Destination Hub</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#19271d' }}>{req?.delivery_location || 'Mumbai Central Logistics Hub'}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: '#9a3412', fontWeight: 600, textTransform: 'uppercase' }}>Required Date</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#19271d' }}>{req?.required_date || '10 Sept 2026'}</div>
          </div>
        </div>
      </div>

      {/* Matching Multi-Farmer Supply Cards */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Matched Farmer Supply Lots ({matches.length} Lots Aggregated)
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Individual farmers aggregated together to satisfy the single 1,000 kg institutional order.
            </p>
          </div>

          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#15803d' }}>
            Combined Total: {totalMatched.toLocaleString()} kg / 1,000 kg (100% Fulfilled)
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {matches.map((m, idx) => (
            <div
              key={m.produceId || idx}
              className="ks-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                borderLeft: `5px solid ${m.matchScore >= 90 ? '#15803d' : '#f59e0b'}`,
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              {/* Farmer Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1rem'
                }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {m.farmerName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={13} color="#15803d" />
                    <span>{m.location}</span>
                  </div>
                </div>
              </div>

              {/* Supply Details */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Allocated Quantity</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {m.allocatedQuantity} <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>kg</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>
                    {m.grade}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Offered Price</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                    ₹{m.expectedPrice}/kg
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Under max ₹{req?.max_price || 30}/kg
                  </div>
                </div>

                {/* Compatibility Badges */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                      <CheckCircle2 size={12} />
                      Grade A Match
                    </span>
                    <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                      Express Corridor
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Available: 10 Sept 2026
                  </div>
                </div>
              </div>

              {/* Match Score Gauge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: '#f8fafc',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Match Score</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: m.matchScore >= 90 ? '#15803d' : '#d97706' }}>
                    {m.matchScore}%
                  </div>
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: m.matchScore >= 90 ? '#dcfce7' : '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={20} color={m.matchScore >= 90 ? '#15803d' : '#d97706'} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Matching Dimensions & Explanation Banner */}
      <div style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#15803d" />
          <div style={{ fontSize: '0.8125rem' }}>
            <strong>100% Product & Grade:</strong> All 3 lots verified Grade-A table tomatoes.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#15803d" />
          <div style={{ fontSize: '0.8125rem' }}>
            <strong>100% Quantity Matched:</strong> 500kg + 300kg + 200kg = 1,000kg fulfilled.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#15803d" />
          <div style={{ fontSize: '0.8125rem' }}>
            <strong>Optimized Routing:</strong> Clustered Nashik & Pune farm pickups with Mumbai express corridor.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#15803d" />
          <div style={{ fontSize: '0.8125rem' }}>
            <strong>Weighted Avg Price:</strong> ₹27.90/kg (Saving 7% under ₹30 budget).
          </div>
        </div>
      </div>
    </div>
  );
};
