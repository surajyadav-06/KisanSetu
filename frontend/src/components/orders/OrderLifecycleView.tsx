import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { orderService } from '../../services/api';
import { Order } from '../../types';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Building2,
  Sprout,
  ArrowRight,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ALL_STAGES = [
  { id: 'Placed', label: 'Order Placed', desc: 'Requirements recorded & validated.' },
  { id: 'Matched', label: 'Supply Matched', desc: 'Matching algorithm verified 3 farmer lots.' },
  { id: 'Aggregated', label: 'Consolidated', desc: '1,000 kg pooled at Nashik Cluster Hub.' },
  { id: 'Route Planned', label: 'Route Planned', desc: 'Reefer truck assigned & corridor mapped.' },
  { id: 'Picked Up', label: 'Dispatched', desc: 'Departed QA center with digital gate pass.' },
  { id: 'In Transit', label: 'In Transit', desc: 'Live temperature controlled (12°C).' },
  { id: 'Delivered', label: 'Delivered', desc: 'Delivered to Mumbai. Payout triggered.' }
];

export const OrderLifecycleView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getOrders();
      if (data && data.length > 0) {
        setOrders(data);
        const detailed = await orderService.getOrderById(data[0].id);
        setSelectedOrder(detailed);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOrder = async (orderId: number) => {
    try {
      const detailed = await orderService.getOrderById(orderId);
      setSelectedOrder(detailed);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdvanceStatus = async () => {
    if (!selectedOrder) return;

    const currentIdx = ALL_STAGES.findIndex((s) => s.id === selectedOrder.status);
    if (currentIdx === -1 || currentIdx >= ALL_STAGES.length - 1) {
      // Loop back to Placed or Delivered
      const nextStatus = 'Placed';
      await updateStatus(nextStatus);
      return;
    }

    const nextStatus = ALL_STAGES[currentIdx + 1].id;
    await updateStatus(nextStatus);
  };

  const updateStatus = async (status: string) => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await orderService.updateStatus(selectedOrder.id, status);
      const refreshed = await orderService.getOrderById(selectedOrder.id);
      setSelectedOrder(refreshed);

      if (status === 'Delivered') {
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      }

      showToast('success', `Order Status: ${status}`, `Order #${selectedOrder.order_number} is now ${status}.`);
    } catch (e) {
      showToast('error', 'Update Failed', 'Could not advance status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder) return;
    if (selectedOrder.status === 'Cancelled' || selectedOrder.status === 'Delivered') return;

    setIsUpdating(true);
    try {
      const res = await orderService.cancelOrder(selectedOrder.id);
      setSelectedOrder(res.data);
      setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? res.data : o)));
      showToast(
        'info',
        'Order Cancelled',
        `Order #${selectedOrder.order_number} cancelled. ${res.restoredQuantity || selectedOrder.total_quantity} kg restored to available farm inventory.`
      );
    } catch (e: any) {
      showToast('error', 'Cancellation Failed', e.response?.data?.message || 'Could not cancel order.');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentIdx = selectedOrder ? ALL_STAGES.findIndex((s) => s.id === selectedOrder.status) : 3;

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
              <PackageCheck size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>End-to-End Order Lifecycle & Tracking</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Multi-party transparent tracking from farm allocation to institutional delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons for Demo Interaction */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {selectedOrder && ['Placed', 'Matched', 'Aggregated', 'Route Planned'].includes(selectedOrder.status) && (
            <button
              onClick={handleCancelOrder}
              disabled={isUpdating}
              className="btn btn-secondary"
              style={{ color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }}
            >
              <span>✕ Cancel Order (Restore Inventory)</span>
            </button>
          )}

          {selectedOrder?.status !== 'Cancelled' && (
            <button
              onClick={handleAdvanceStatus}
              disabled={isUpdating}
              className="btn btn-primary"
              style={{ boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)' }}
            >
              <RotateCw size={16} className={isUpdating ? 'spin' : ''} />
              <span>Advance Lifecycle Stage ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Order Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Orders List Sidebar */}
        <div className="ks-card" style={{ padding: '1.25rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem' }}>All Active Orders</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orders.map((o) => {
              const isSelected = selectedOrder?.id === o.id;
              return (
                <div
                  key={o.id}
                  onClick={() => handleSelectOrder(o.id)}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: isSelected ? '#f0fdf4' : '#ffffff',
                    border: isSelected ? '2px solid #15803d' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isSelected ? '#15803d' : 'var(--text-primary)' }}>
                      #{o.order_number}
                    </span>
                    <span className="badge badge-success" style={{ fontSize: '0.6875rem' }}>
                      {o.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    {o.total_quantity} kg {o.crop_name} • {o.buyer_name}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Total: ₹{o.total_amount?.toLocaleString()}</span>
                    <span>{o.delivery_location?.split(',')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Timeline View */}
        <div className="ks-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: 600 }}>ORDER TRACKING</div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                Order #{selectedOrder?.order_number || 'KS-ORD-882104'}
              </h2>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Status</div>
              <span className="badge badge-success" style={{ fontSize: '0.875rem', padding: '4px 12px' }}>
                <CheckCircle2 size={14} />
                {selectedOrder?.status || 'Route Planned'}
              </span>
            </div>
          </div>

          {/* Quick Summary Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            background: 'var(--bg-surface-subtle)',
            padding: '1rem',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.75rem'
          }}>
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Consignment</div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{selectedOrder?.total_quantity} kg {selectedOrder?.crop_name}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recipient</div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{selectedOrder?.buyer_name}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Destination</div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{selectedOrder?.delivery_location}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Amount</div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#15803d' }}>₹{selectedOrder?.total_amount?.toLocaleString()}</div>
            </div>
          </div>

          {/* 7-Step Interactive Timeline */}
          <div className="timeline-container">
            {ALL_STAGES.map((stage, idx) => {
              const isCompleted = idx < currentIdx;
              const isCurrent = idx === currentIdx;
              const isPending = idx > currentIdx;

              return (
                <div key={stage.id} className="timeline-item">
                  <div
                    className={`timeline-dot ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  >
                    {isCompleted ? <CheckCircle2 size={14} /> : isCurrent ? <Clock size={14} /> : null}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        fontWeight: 700,
                        fontSize: '0.9375rem',
                        color: isCompleted || isCurrent ? 'var(--text-primary)' : 'var(--text-muted)'
                      }}>
                        {stage.label}
                      </span>
                      {isCurrent && <span className="badge badge-warning">Active Stage</span>}
                    </div>

                    <p style={{
                      fontSize: '0.8125rem',
                      color: isPending ? 'var(--text-muted)' : 'var(--text-secondary)',
                      marginTop: '2px'
                    }}>
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
