import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDemoTour } from '../../context/DemoTourContext';
import { produceService, aggregationService } from '../../services/api';
import { Produce, Aggregation } from '../../types';
import {
  Users2,
  Boxes,
  Truck,
  TrendingUp,
  Sparkles,
  Sprout,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
  PlusCircle,
  Eye,
  PackageCheck,
  Calendar,
  Layers
} from 'lucide-react';
import { AddProduceModal } from '../farmer/AddProduceModal';

export const FpoDashboard: React.FC = () => {
  const { user } = useAuth();
  const { setActiveTab } = useDemoTour();
  const [memberProduce, setMemberProduce] = useState<Produce[]>([]);
  const [aggregations, setAggregations] = useState<Aggregation[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFpoData();
  }, [user]);

  const loadFpoData = async () => {
    setIsLoading(true);
    try {
      const [produceData, aggData] = await Promise.all([
        produceService.getMarketplace(),
        aggregationService.getAggregations()
      ]);
      if (produceData) setMemberProduce(produceData);
      if (aggData) setAggregations(aggData);
    } catch (e) {
      console.error('Error loading FPO data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProduceAdded = (newProduce: Produce) => {
    setMemberProduce((prev) => [newProduce, ...prev]);
  };

  const totalClusterQuantity = memberProduce.reduce((acc, curr) => acc + (curr.quantity_available || 0), 0);
  const memberFarmersCount = new Set(memberProduce.map((p) => p.farmer_name || p.user_id)).size || 48;

  return (
    <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {user?.full_name || 'Sahyadri Farmers Producer Co.'} 🏢
            </h1>
            <span className="badge badge-success">
              <ShieldCheck size={14} />
              Certified FPO Aggregation Hub
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', marginTop: '4px' }}>
            Helping farmers sell together in large quantities
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('aggregation')}
            className="btn btn-secondary"
          >
            <Boxes size={16} color="#15803d" />
            <span>Combine Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('ai-demand')}
            className="btn btn-secondary"
          >
            <Sparkles size={16} color="#eab308" />
            <span>Market Demand</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary"
          >
            <PlusCircle size={18} />
            <span>+ Add Member Produce</span>
          </button>
        </div>
      </div>

      {/* 4 FPO Key Metric Cards */}
      <div className="grid-cols-auto-fit">
        {/* Metric 1 */}
        <div className="ks-card" style={{ borderLeft: '4px solid #15803d' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Total Produce Available
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={20} color="#15803d" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {(totalClusterQuantity || 15400).toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 500 }}>kg</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
            From {memberFarmersCount} active farmers
          </div>
        </div>

        {/* Metric 2 */}
        <div className="ks-card" style={{ borderLeft: '4px solid #0284c7' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Combined Orders
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Boxes size={20} color="#0284c7" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {aggregations.length || 3} <span style={{ fontSize: '1rem', fontWeight: 500 }}>active orders</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, marginTop: '4px' }}>
            Ready for delivery
          </div>
        </div>

        {/* Metric 3 */}
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
            ₹4,82,500
          </div>
          <div style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600, marginTop: '4px' }}>
            +31.4% higher earnings than local APMC mandi
          </div>
        </div>

        {/* Metric 4 */}
        <div className="ks-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Deliveries
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={20} color="#8b5cf6" />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            3 Reefer Vans <span style={{ fontSize: '1rem', fontWeight: 500 }}>assigned</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8b5cf6', fontWeight: 600, marginTop: '4px' }}>
            Nashik Hub ➔ Pune ➔ Mumbai corridors
          </div>
        </div>
      </div>

      {/* Active Aggregation Batches Table */}
      <div className="ks-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Orders Ready for Delivery</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Produce from multiple farmers combined for large orders.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('aggregation')}
            className="btn btn-primary btn-sm"
          >
            <Boxes size={15} />
            <span>Open Combine Orders</span>
          </button>
        </div>

        <div className="ks-table-container">
          <table className="ks-table">
            <thead>
              <tr>
                <th>Crop & Batch</th>
                <th>Aggregated Quantity</th>
                <th>Member Farmers</th>
                <th>Avg. Price</th>
                <th>Status</th>
                <th>Logistics Assigned</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      🍅
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>Grade-A Tomato (Batch #KS-AGG-802)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Destination: Taj Hotels Mumbai</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 800, color: '#15803d' }}>1,000 kg</td>
                <td>
                  <span className="badge badge-primary">3 Farmers (Ramesh, Suresh, Vikas)</span>
                </td>
                <td style={{ fontWeight: 700 }}>₹27.90/kg</td>
                <td>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} />
                    Ready for Pickup
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem' }}>
                    <Truck size={14} color="#0284c7" />
                    <span>Tata 407 Reefer (42 km)</span>
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => setActiveTab('route-optimization')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    <span>View Route</span>
                    <ArrowUpRight size={13} />
                  </button>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                      🍇
                    </div>
                    <div>
                      <div style={{ fontWeight: 700 }}>Export Grade Grapes (Batch #KS-AGG-803)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Destination: Mumbai APMC Export Hub</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 800, color: '#15803d' }}>1,200 kg</td>
                <td>
                  <span className="badge badge-primary">2 Farmers (Sanjay, Anil)</span>
                </td>
                <td style={{ fontWeight: 700 }}>₹68.00/kg</td>
                <td>
                  <span className="badge badge-warning">QC Inspection</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem' }}>
                    <Truck size={14} color="#0284c7" />
                    <span>Eicher Reefer 14ft</span>
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => setActiveTab('aggregation')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    <span>Details</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Farmer Produce Pool */}
      <div className="ks-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Farmer Produce List</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              List of produce added by farmers.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn btn-primary btn-sm"
          >
            <PlusCircle size={15} />
            <span>Add Member Harvest</span>
          </button>
        </div>

        <div className="ks-table-container">
          <table className="ks-table">
            <thead>
              <tr>
                <th>Crop & Lot</th>
                <th>Member Farmer</th>
                <th>Quantity</th>
                <th>Grade</th>
                <th>Perishability</th>
                <th>Location</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {memberProduce.slice(0, 6).map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=100&q=80'}
                        alt={item.crop_name}
                        style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 700 }}>{item.crop_name}</span>
                    </div>
                  </td>
                  <td>{item.farmer_name || 'Member Farmer'}</td>
                  <td style={{ fontWeight: 700 }}>{item.quantity_available} {item.unit}</td>
                  <td><span className="badge badge-primary">{item.grade}</span></td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: item.perishability === 'High' ? '#fee2e2' : item.perishability === 'Medium' ? '#fef3c7' : '#dcfce7',
                      color: item.perishability === 'High' ? '#991b1b' : item.perishability === 'Medium' ? '#92400e' : '#166534',
                      border: `1px solid ${item.perishability === 'High' ? '#fecaca' : item.perishability === 'Medium' ? '#fde68a' : '#bbf7d0'}`
                    }}>
                      {item.perishability || 'Medium'}
                    </span>
                  </td>
                  <td>{item.location}</td>
                  <td style={{ fontWeight: 700, color: '#15803d' }}>₹{item.expected_price}/{item.unit}</td>
                  <td><span className="badge badge-success">{item.status || 'Available'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddProduceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProduceAdded={handleProduceAdded}
      />
    </div>
  );
};
