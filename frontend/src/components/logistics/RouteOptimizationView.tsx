import React, { useState, useEffect, useRef } from 'react';
import { useDemoTour } from '../../context/DemoTourContext';
import { useToast } from '../../context/ToastContext';
import { logisticsService } from '../../services/api';
import { OptimizedRoute } from '../../types';
import {
  MapPin,
  Truck,
  Clock,
  Gauge,
  Sparkles,
  CheckCircle2,
  Navigation,
  ArrowRight,
  ShieldCheck,
  Zap,
  Leaf
} from 'lucide-react';
import L from 'leaflet';

export const RouteOptimizationView: React.FC = () => {
  const { setActiveTab, nextStep, currentStep } = useDemoTour();
  const { showToast } = useToast();

  const [routeData, setRouteData] = useState<OptimizedRoute | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    fetchRoute();
  }, []);

  const fetchRoute = async () => {
    setIsOptimizing(true);
    try {
      const res = await logisticsService.optimizeRoute('KS-ORD-10482');
      setRouteData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleOptimizeClick = () => {
    fetchRoute();
    showToast('success', 'Route Re-Optimized', 'Sequence aligned for minimal empty-haul distance: 42 km cluster transit, 1 hr 35 min.');
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current).setView([19.5, 73.4], 8);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Custom marker icons
      const createIcon = (color: string, label: string) => {
        return L.divIcon({
          className: 'custom-leaflet-marker',
          html: `
            <div style="
              background-color: ${color};
              color: white;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 800;
              font-size: 13px;
              border: 2px solid white;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            ">
              ${label}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
      };

      const stops = routeData?.stops || [
        { lat: 20.0059, lng: 73.7898, name: 'Pickup A: Nashik (Farmer A - 500kg)', type: 'A' },
        { lat: 19.9975, lng: 73.7910, name: 'Pickup B: Nashik (Farmer B - 300kg)', type: 'B' },
        { lat: 18.5204, lng: 73.8567, name: 'Pickup C: Pune (Farmer C - 200kg)', type: 'C' },
        { lat: 19.2183, lng: 73.0867, name: 'Hub: KisanSetu QA Hub', type: 'HUB' },
        { lat: 19.0760, lng: 72.8777, name: 'Delivery: Mumbai (Taj Hotels Kitchen)', type: 'DEST' }
      ];

      const latLngs: L.LatLngExpression[] = [];

      stops.forEach((s: any, idx: number) => {
        const color = s.stopType === 'DELIVERY' || s.type === 'DEST' ? '#ea580c' : s.stopType === 'HUB' || s.type === 'HUB' ? '#0284c7' : '#15803d';
        const label = s.stopOrder ? String(s.stopOrder) : String(idx + 1);
        const marker = L.marker([s.lat, s.lng], { icon: createIcon(color, label) }).addTo(map);
        marker.bindPopup(`<strong>${s.locationName || s.name}</strong><br/>${s.action || 'Scheduled stop'}`);
        latLngs.push([s.lat, s.lng]);
      });

      // Add connecting route polyline
      const polyline = L.polyline(latLngs, {
        color: '#15803d',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.85
      }).addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    } catch (e) {
      console.warn('Leaflet render fallback');
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [routeData]);

  const handleNextTourStep = () => {
    if (currentStep.stepNumber === 9) {
      nextStep();
    } else {
      setActiveTab('price-breakdown');
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
              <Navigation size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Delivery Route</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Smart route planning to pick up produce and deliver it fresh.
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleOptimizeClick} className="btn btn-secondary">
            <Sparkles size={16} color="#eab308" />
            <span>Update Route</span>
          </button>
          <button
            onClick={handleNextTourStep}
            className="btn btn-primary"
            style={{ boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)' }}
          >
            <span>View Transparent Price Breakdown</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* 4 Logistics Key Metric Cards */}
      <div className="grid-cols-auto-fit">
        <div className="ks-card" style={{ borderLeft: '4px solid #15803d' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Distance</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
            {routeData?.metrics.estimatedDistanceKm || 42.0} <span style={{ fontSize: '1rem', fontWeight: 500 }}>km</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            Total corridor: 185 km to Mumbai
          </div>
        </div>

        <div className="ks-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Travel Time</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            {routeData?.metrics.estimatedDurationText || '1 hr 35 min'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
            ⚡ 36% faster than unaggregated transit
          </div>
        </div>

        <div className="ks-card" style={{ borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Delivery Cost</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
            ₹{routeData?.metrics.estimatedLogisticsCost?.toLocaleString() || '2,850'}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
            ₹2.85/kg unit logistics cost
          </div>
        </div>

        <div className="ks-card" style={{ borderLeft: '4px solid #16a34a' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Vehicle Fullness</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#16a34a', marginTop: '4px' }}>
            {routeData?.vehicle.utilizationPercentage || 67}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Leaf size={13} />
            <span>18.5 kg CO2 Saved</span>
          </div>
        </div>
      </div>

      {/* Third-Party Logistics (3PL) Comparison & Intelligent Recommendation */}
      <div className="ks-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color="#15803d" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Delivery Vehicle Options</h2>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Choose a vehicle to deliver the produce.
            </p>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
            Best Matches
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {(routeData?.transporterOptions || [
            {
              id: '3PL-01',
              transporterName: 'Sahyadri Agro-Express (LCV)',
              vehicleType: 'Mahindra Bolero Maxi Truck (Ambient)',
              capacityKg: 500,
              fare: 1500,
              unitFare: '₹3.00/kg',
              eta: '5 hrs 30 min',
              pickupCluster: 'Nashik Agro Belt',
              destination: 'Mumbai Logistics Terminal',
              coolingType: 'Standard Ventilated',
              isRecommended: false,
              recommendationReason: 'Suitable for small loads (<500 kg), but lacks active cold-chain required for high-perishability tomatoes.'
            },
            {
              id: '3PL-02',
              transporterName: 'Maharashtra ColdLogistics (Reefer 1.5T)',
              vehicleType: 'Tata 407 Reefer (Active 10–12°C Controlled)',
              capacityKg: 1500,
              fare: 2850,
              unitFare: '₹2.85/kg',
              eta: '4 hrs 15 min',
              pickupCluster: 'Nashik & Pune Clustered Pickups',
              destination: 'Mumbai Central Logistics Hub (Taj Hotels)',
              coolingType: 'Active Cold-Chain Reefer (12°C)',
              isRecommended: true,
              recommendationReason: 'KisanSetu Recommended: Optimal 1,500 kg capacity aligns with 1,000 kg consignment (67% utilization), fastest direct ETA (4h 15m), and temperature control protects High-Perishability Grade-A produce.'
            },
            {
              id: '3PL-03',
              transporterName: 'Deccan Freight Carriers (Heavy LCV 3.0T)',
              vehicleType: 'Eicher Pro 2049 (High Capacity Heavy Van)',
              capacityKg: 3000,
              fare: 4200,
              unitFare: '₹1.40/kg',
              eta: '6 hrs 00 min',
              pickupCluster: 'Western Maharashtra Regional Hub',
              destination: 'Mumbai APMC & Institutional Kitchens',
              coolingType: 'Ventilated Heavy Duty',
              isRecommended: false,
              recommendationReason: 'Oversized for 1,000 kg batch with higher trip base fare (₹4,200), though optimal for high-volume non-perishables.'
            }
          ]).map((t) => (
            <div
              key={t.id}
              style={{
                border: t.isRecommended ? '2px solid #15803d' : '1px solid var(--border-subtle)',
                background: t.isRecommended ? '#f0fdf4' : '#ffffff',
                borderRadius: '12px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                position: 'relative'
              }}
            >
              {t.isRecommended && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '12px',
                  background: '#15803d',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '10px'
                }}>
                  ⭐ KISANSETU RECOMMENDED
                </div>
              )}

              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: t.isRecommended ? '#14532d' : 'var(--text-primary)' }}>
                  {t.transporterName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {t.vehicleType} • {t.coolingType}
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                padding: '8px 10px',
                background: t.isRecommended ? '#ffffff' : 'var(--bg-surface-subtle)',
                borderRadius: '8px',
                fontSize: '0.8125rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Capacity</div>
                  <div style={{ fontWeight: 700 }}>{t.capacityKg.toLocaleString()} kg</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Estimated Fare</div>
                  <div style={{ fontWeight: 800, color: '#15803d' }}>₹{t.fare.toLocaleString()} ({t.unitFare})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Estimated Time (ETA)</div>
                  <div style={{ fontWeight: 700 }}>{t.eta}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Destination</div>
                  <div style={{ fontWeight: 700 }}>Mumbai Hub</div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: t.isRecommended ? '#166534' : 'var(--text-muted)', lineHeight: 1.35, marginTop: '2px' }}>
                <strong>Why we recommend this:</strong> {t.recommendationReason}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Map + Stop Sequence Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', minHeight: '480px' }}>
        {/* Interactive Map Visualizer */}
        <div className="ks-card" style={{ padding: 0, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 400,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(4px)',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.8125rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontWeight: 700, color: '#14532d' }}>🗺️ Live Map</div>
            <div style={{ fontSize: '0.75rem', color: '#4b5a50' }}>Nashik ➔ Igatpuri ➔ Center ➔ Mumbai</div>
          </div>

          <div
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%', minHeight: '460px', zIndex: 1 }}
          />
        </div>

        {/* Optimized Stop-by-Stop List */}
        <div className="ks-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Delivery Steps</h2>
            <span className="badge badge-success">Cold Storage Ready</span>
          </div>

          {/* Stops List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', flex: 1, maxHeight: '420px', paddingRight: '4px' }}>
            {routeData?.stops?.map((stop, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  background: stop.stopType === 'DELIVERY' ? '#fff7ed' : stop.stopType === 'HUB' ? '#f0f9ff' : '#f8fafc',
                  border: `1px solid ${
                    stop.stopType === 'DELIVERY' ? '#fed7aa' : stop.stopType === 'HUB' ? '#bae6fd' : '#e2e8f0'
                  }`,
                  borderRadius: '10px'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: stop.stopType === 'DELIVERY' ? '#ea580c' : stop.stopType === 'HUB' ? '#0284c7' : '#15803d',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  flexShrink: 0
                }}>
                  {stop.stopOrder}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      {stop.locationName}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {stop.arrivalWindow}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {stop.action}
                  </div>

                  {stop.quantityKg && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#15803d', marginTop: '2px' }}>
                      Load: {stop.quantityKg} kg {stop.cropName || 'Tomato'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Vehicle Info Footer */}
          <div style={{
            marginTop: '1rem',
            padding: '10px 14px',
            background: 'var(--bg-surface-subtle)',
            borderRadius: '10px',
            fontSize: '0.8125rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={16} color="#15803d" />
              <span>Assigned: <strong>{routeData?.vehicle.model}</strong></span>
            </div>
            <span>Reg: <strong>{routeData?.vehicle.registration}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
