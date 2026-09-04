import React, { useState, useEffect } from 'react';
import { produceService, orderService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Produce } from '../../types';
import {
  ShoppingCart,
  Search,
  Filter,
  MapPin,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Plus,
  Minus,
  X,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const MarketplaceView: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [produceList, setProduceList] = useState<Produce[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  // Cart state
  const [cart, setCart] = useState<{ produce: Produce; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    fetchMarketplace();
  }, [selectedCategory, selectedGrade, selectedLocation]);

  const fetchMarketplace = async () => {
    setIsLoading(true);
    try {
      const data = await produceService.getMarketplace({
        category: selectedCategory,
        grade: selectedGrade,
        location: selectedLocation,
        search: search || undefined
      });
      setProduceList(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMarketplace();
  };

  const addToCart = (item: Produce) => {
    if (item.quantity_available <= 0 || item.status === 'Sold Out') {
      showToast('error', 'Out of Stock', `${item.crop_name} is currently sold out.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((c) => c.produce.id === item.id);
      if (existing) {
        const targetQty = existing.quantity + 2;
        if (targetQty > item.quantity_available) {
          showToast('error', 'Limit Reached', `Only ${item.quantity_available} kg available.`);
          return prev;
        }
        return prev.map((c) => (c.produce.id === item.id ? { ...c, quantity: targetQty } : c));
      }
      const initialQty = Math.min(5, item.quantity_available);
      return [...prev, { produce: item, quantity: initialQty }];
    });
    showToast('success', 'Added to Cart', `Added ${item.crop_name} (${item.grade}) to your direct farm basket.`);
  };

  const updateCartQty = (produceId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.produce.id === produceId) {
            const newQty = Math.max(1, c.quantity + delta);
            if (newQty > c.produce.quantity_available) {
              showToast('error', 'Limit Reached', `Only ${c.produce.quantity_available} kg available.`);
              return c;
            }
            return { ...c, quantity: newQty };
          }
          return c;
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (produceId: number) => {
    setCart((prev) => prev.filter((c) => c.produce.id !== produceId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.produce.expected_price * item.quantity, 0);
  const deliveryFee = cart.length > 0 ? 40 : 0;
  const platformFee = cart.length > 0 ? 15 : 0;
  const grandTotal = subtotal + deliveryFee + platformFee;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    try {
      const firstItem = cart[0];
      await orderService.createConsumerOrder({
        buyer_id: user?.id || 8,
        buyer_name: user?.full_name || 'Priya Sharma',
        produce_id: firstItem.produce.id,
        crop_name: firstItem.produce.crop_name,
        grade: firstItem.produce.grade,
        quantity_kg: firstItem.quantity,
        unit_price: firstItem.produce.expected_price,
        delivery_location: user?.location || 'Bandra West, Mumbai'
      });

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast('success', 'Direct Order Confirmed!', 'Farm harvest scheduled. Guaranteed fresh dispatch directly to your doorstep.');
      setCart([]);
      setIsCartOpen(false);
      // Refresh marketplace to show updated available inventory in real-time
      await fetchMarketplace();
    } catch (e: any) {
      showToast('error', 'Checkout Failed', e.response?.data?.message || 'Could not complete order.');
    } finally {
      setIsCheckingOut(false);
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
              <ShoppingCart size={22} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Direct from Farmer Marketplace</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Buy fresh produce directly from verified farmers at fair prices.
              </p>
            </div>
          </div>
        </div>

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="btn btn-primary"
          style={{ position: 'relative', boxShadow: '0 4px 14px rgba(21, 128, 61, 0.35)' }}
        >
          <ShoppingCart size={18} />
          <span>My Basket ({cart.length})</span>
          {cart.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              background: '#ea580c',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 800,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="ks-card" style={{ padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search produce (e.g. Tomato, Nashik, Grade A)..."
            />
          </div>

          {/* Category Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
          </select>

          {/* Grade Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
          >
            <option value="All">All Grades</option>
            <option value="Grade A">Grade A</option>
            <option value="Export Quality">Export Quality</option>
          </select>

          {/* Location Filter */}
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '140px' }}
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="All">All Origins</option>
            <option value="Nashik">Nashik</option>
            <option value="Pune">Pune</option>
            <option value="Ahmednagar">Ahmednagar</option>
            <option value="Satara">Satara</option>
          </select>

          <button type="submit" className="btn btn-secondary">
            Filter
          </button>
        </form>
      </div>

      {/* Produce Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.5rem' }}>
        {produceList.map((item) => {
          const isSoldOut = item.quantity_available <= 0 || item.status === 'Sold Out';
          const perishability = item.perishability || (['Tomato', 'Grapes'].includes(item.crop_name) ? 'High' : ['Banana'].includes(item.crop_name) ? 'Medium' : 'Low');

          return (
            <div key={item.id} className="ks-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', opacity: isSoldOut ? 0.75 : 1 }}>
              <div style={{ position: 'relative', height: '180px' }}>
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'}
                  alt={item.crop_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                  <span className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.95)', color: '#15803d', fontWeight: 700 }}>
                    {item.grade}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '10px',
                      background: perishability === 'High' ? '#fee2e2' : perishability === 'Medium' ? '#fef3c7' : '#dcfce7',
                      color: perishability === 'High' ? '#991b1b' : perishability === 'Medium' ? '#92400e' : '#166534',
                      border: `1px solid ${perishability === 'High' ? '#fecaca' : perishability === 'Medium' ? '#fde68a' : '#bbf7d0'}`
                    }}
                  >
                    {perishability} Perishability
                  </span>
                </div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
                  <span style={{
                    background: isSoldOut ? 'rgba(100, 116, 139, 0.9)' : 'rgba(21, 128, 61, 0.9)',
                    color: '#ffffff',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontWeight: 800,
                    fontSize: '0.875rem'
                  }}>
                    ₹{item.expected_price}/{item.unit}
                  </span>
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{item.crop_name}</h3>
                  <span style={{
                    fontSize: '0.75rem',
                    color: isSoldOut ? '#dc2626' : '#15803d',
                    fontWeight: 700,
                    background: isSoldOut ? '#fee2e2' : '#f0fdf4',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {isSoldOut ? 'Sold Out' : `${item.quantity_available} ${item.unit} available`}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <MapPin size={14} color="#15803d" />
                  <span>{item.farmer_name || 'Verified Farmer'} • {item.location}</span>
                </div>

                {item.harvest_date && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                    📅 Harvested: {item.harvest_date}
                  </div>
                )}

                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '1rem', flex: 1 }}>
                  {item.description || `Fresh Grade-A ${item.crop_name} harvested directly from verified orchards.`}
                </p>

                <button
                  onClick={() => addToCart(item)}
                  disabled={isSoldOut}
                  className={`btn ${isSoldOut ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  style={{ width: '100%', justifyContent: 'center', cursor: isSoldOut ? 'not-allowed' : 'pointer' }}
                >
                  <Plus size={16} />
                  <span>{isSoldOut ? 'Sold Out' : 'Add to Basket'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={22} color="#15803d" />
                <h2 style={{ fontSize: '1.25rem' }}>Your Basket</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            {cart.length > 0 ? (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                  {cart.map((item) => (
                    <div
                      key={item.produce.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px',
                        background: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{item.produce.crop_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ₹{item.produce.expected_price}/kg • {item.produce.location}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff', padding: '2px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                          <button onClick={() => updateCartQty(item.produce.id, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Minus size={13} /></button>
                          <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{item.quantity} kg</span>
                          <button onClick={() => updateCartQty(item.produce.id, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><Plus size={13} /></button>
                        </div>
                        <div style={{ fontWeight: 800, minWidth: '60px', textAlign: 'right', color: '#15803d' }}>
                          ₹{item.produce.expected_price * item.quantity}
                        </div>
                        <button onClick={() => removeFromCart(item.produce.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc2626' }}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transparent Price Breakdown Summary */}
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '10px',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ fontWeight: 700, color: '#166534', marginBottom: '4px' }}>
                    🌱 Price Details:
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#19271d' }}>
                    <span>Money to Farmer:</span>
                    <strong>₹{subtotal.toFixed(2)} (86%)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5a50' }}>
                    <span>Delivery Cost:</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4b5a50' }}>
                    <span>Platform Fee:</span>
                    <span>₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1rem', color: '#15803d', borderTop: '1px solid #bbf7d0', paddingTop: '6px', marginTop: '4px' }}>
                    <span>Total Amount Payable:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <CreditCard size={18} />
                  <span>{isCheckingOut ? 'Placing Order...' : `Place Order (₹${grandTotal.toFixed(2)})`}</span>
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                Your basket is empty. Browse the fresh harvest above and add produce.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
