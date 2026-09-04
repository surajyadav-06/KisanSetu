import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDemoTour } from '../../context/DemoTourContext';
import {
  Sprout,
  TrendingUp,
  Boxes,
  Truck,
  Users2,
  Sparkles,
  ArrowRight,
  Building2,
  ShoppingCart,
  ChevronRight,
  Play,
  MapPin,
  Star,
  IndianRupee,
  Package,
  X
} from 'lucide-react';
import { UserRole } from '../../types';

interface LandingPageProps {
  onEnterApp: (tab?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { switchDemoRole } = useAuth();
  const { goToStep } = useDemoTour();
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleLaunchRole = (role: UserRole, stepNumber: number) => {
    switchDemoRole(role);
    goToStep(stepNumber);
    onEnterApp();
    setShowRoleModal(false);
  };


  const steps = [
    { num: 1, icon: Sprout,      color: '#15803d', bg: '#dcfce7', title: 'List Your Produce',  desc: 'Farmers or FPOs list their produce without depending on middlemen.' },
    { num: 2, icon: Sparkles,    color: '#b45309', bg: '#fef3c7', title: 'Get Matched',         desc: 'Our AI matches your produce with the right buyers based on demand & location.' },
    { num: 3, icon: Truck,       color: '#0369a1', bg: '#e0f2fe', title: 'Confirm & Deliver',   desc: 'Confirm the order and we handle pickup and delivery through our logistics network.' },
    { num: 4, icon: IndianRupee, color: '#6d28d9', bg: '#ede9fe', title: 'Get Paid',            desc: 'Secure payments directly to your account with complete transparency.' },
  ];

  const testimonials = [
    { quote: 'KisanSetu helped us sell our tomatoes at better prices without depending on middlemen. Payments are on time and transparent.', name: 'Ramesh Patil', title: 'Farmer, Nashik', color: '#15803d' },
    { quote: 'We get fresh produce in bulk with consistent quality. The platform saves us time and logistics cost significantly.', name: 'Anjali Mehta', title: 'Wholesale Buyer, Mumbai', color: '#0369a1' },
    { quote: 'The market insights and demand forecasts help us plan better and reduce waste across our cooperative.', name: 'Suresh Yadav', title: 'FPO Head, Pune', color: '#b45309' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#1a2e1a', fontFamily: 'Inter, Outfit, sans-serif' }}>

      {/* ── Sticky Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 2.5rem',
        height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(21,128,61,0.3)'
          }}>
            <Sprout size={22} color="#fef08a" />
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803d', letterSpacing: '-0.01em' }}>KisanSetu</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
          <a href="#home" style={{ color: '#15803d', borderBottom: '2px solid #15803d', paddingBottom: '2px', textDecoration: 'none' }}>Home</a>
          <a href="#how-it-works" style={{ color: '#374151', textDecoration: 'none' }}>How It Works</a>
          <button onClick={() => onEnterApp('marketplace')} style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: '#374151', cursor: 'pointer', fontWeight: 600 }}>Marketplace</button>
          <a href="#how-it-works" style={{ color: '#374151', textDecoration: 'none' }}>Solutions</a>
          <a href="#about" style={{ color: '#374151', textDecoration: 'none' }}>About Us</a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowRoleModal(true)}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '8px',
              border: '1.5px solid #d1d5db', background: 'transparent',
              fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', color: '#374151'
            }}
          >Login</button>
          <button
            onClick={() => setShowRoleModal(true)}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: '8px',
              background: '#15803d', color: '#ffffff', border: 'none',
              fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(21,128,61,0.35)'
            }}
          >Get Started Free</button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="home" style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '4rem 2.5rem',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '3rem', alignItems: 'center'
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#f0fdf4', border: '1.5px solid #86efac',
            padding: '5px 14px', borderRadius: '20px',
            fontSize: '0.8125rem', fontWeight: 700, color: '#15803d', marginBottom: '1.5rem'
          }}>
            <Sparkles size={14} color="#eab308" />
            <span>AI-Powered Agriculture Marketplace</span>
          </div>

          <h1 style={{
            fontSize: '3.2rem', fontWeight: 900, lineHeight: 1.12,
            color: '#111827', letterSpacing: '-0.03em', marginBottom: '1.25rem'
          }}>
            Bridging Farms<br />to Markets{' '}
            <span style={{ color: '#15803d', fontStyle: 'italic' }}>Intelligently</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#6b7280', lineHeight: 1.65, marginBottom: '2rem', maxWidth: '520px' }}>
            Empowering farmers and FPOs with real-time market insights, direct buyer connections,
            and smart logistics — all in one platform.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            <button
              onClick={() => handleLaunchRole('Farmer', 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0.8rem 1.6rem', borderRadius: '10px',
                background: '#15803d', color: '#ffffff', border: 'none',
                fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(21,128,61,0.35)'
              }}
            >
              <Sprout size={18} /> Start Selling Now <ArrowRight size={16} />
            </button>
            <button
              onClick={() => onEnterApp('marketplace')}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '0.8rem 1.5rem', borderRadius: '10px',
                background: 'transparent', color: '#15803d',
                border: '2px solid #15803d',
                fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              <ShoppingCart size={18} /> Explore Marketplace
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { icon: TrendingUp, label: 'Better Prices',      sub: 'Direct access to verified buyers' },
              { icon: Sparkles,   label: 'Smart Insights',     sub: 'AI-powered demand forecasting' },
              { icon: Truck,      label: 'Reliable Logistics', sub: 'Optimised deliveries, farm to market' },
            ].map(f => (
              <div key={f.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
                }}>
                  <f.icon size={16} color="#15803d" />
                </div>
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#111827' }}>{f.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4 }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: '40% 60% 60% 40% / 40% 40% 60% 60%',
            overflow: 'hidden', width: '100%', aspectRatio: '4/5',
            background: '#dcfce7', boxShadow: '0 20px 60px -10px rgba(21,128,61,0.25)'
          }}>
            <img src="/hero_farmers.jpg" alt="Farmers using KisanSetu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{
            position: 'absolute', bottom: '8%', left: '-6%',
            background: '#ffffff', borderRadius: '14px', padding: '0.75rem 1.1rem',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} color="#15803d" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>New Order</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>500 kg Tomatoes — Nashik</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '2.5rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
          {[
            { icon: Users2,      value: '12,500+',  label: 'Farmers & FPOs',        color: '#15803d' },
            { icon: Building2,   value: '850+',     label: 'Verified Buyers',        color: '#0369a1' },
            { icon: Package,     value: '1,200+',   label: 'Deliveries Completed',   color: '#b45309' },
            { icon: IndianRupee, value: '₹ 28 Cr+', label: 'Trade Value Generated',  color: '#6d28d9' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={22} color={s.color} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111827', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: '5rem 2.5rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '0.75rem' }}>Simple Steps. Powerful Impact.</h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '3.5rem' }}>An intelligent pipeline connecting supply generation with institutional fulfillment.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '36px', left: '12.5%', right: '12.5%',
              height: '2px', background: 'linear-gradient(90deg, #15803d, #0369a1)', zIndex: 0
            }} />
            {steps.map((step, i) => (
              <div key={i} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '0 0.5rem' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: step.bg, border: `3px solid ${step.color}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 16px ${step.color}30`, flexShrink: 0
                }}>
                  <step.icon size={28} color={step.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#111827', marginBottom: '6px' }}>{step.num}. {step.title}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '5rem 2.5rem', background: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Trusted by Farmers & Buyers</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '3rem' }}>Real stories from real people using KisanSetu every day.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', textAlign: 'left' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: '#f9fafb', borderRadius: '16px', padding: '1.75rem', border: '1px solid #e5e7eb', position: 'relative' }}>
                <div style={{ fontSize: '2.5rem', color: '#e5e7eb', lineHeight: 1, marginBottom: '0.5rem', fontFamily: 'Georgia, serif' }}>"</div>
                <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.6, marginBottom: '1.5rem' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: t.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: t.color }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#111827' }}>{t.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{t.title}</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '2px' }}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#f59e0b" color="#f59e0b" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── CTA Banner ── */}
      <section style={{ padding: '5rem 2.5rem', background: '#14532d' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>Ready to Grow Your Business?</h2>
            <p style={{ color: '#86efac', fontSize: '1rem' }}>Join thousands of farmers and buyers who are already growing with KisanSetu.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleLaunchRole('Farmer', 1)}
              style={{ padding: '0.8rem 1.6rem', borderRadius: '10px', background: '#ffffff', color: '#15803d', border: 'none', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer' }}
            >Create Free Account</button>
            <button
              onClick={() => setShowRoleModal(true)}
              style={{ padding: '0.8rem 1.6rem', borderRadius: '10px', background: 'transparent', color: '#ffffff', border: '2px solid rgba(255,255,255,0.5)', fontSize: '0.9375rem', fontWeight: 700, cursor: 'pointer' }}
            >Book a Demo</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="about" style={{ background: '#111827', color: '#d1d5db', padding: '3.5rem 2.5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                <Sprout size={22} color="#86efac" />
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>KisanSetu</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.6, maxWidth: '260px' }}>
                India's AI-powered farm-to-market platform connecting farmers, FPOs, buyers, and an intelligent network.
              </p>
            </div>
            {[
              { title: 'Platform',  links: ['Marketplace', 'How It Works', 'Pricing', 'For Farmers', 'For Buyers'] },
              { title: 'Solutions', links: ['FPO Solutions', 'Enterprise Solutions', 'Logistics Partners', 'Market Insights'] },
              { title: 'Resources', links: ['Blog', 'Help Center', 'Guides', 'FAQs', 'API Documentation'] },
              { title: 'Company',   links: ['About Us', 'Careers', 'Contact Us', 'Privacy Policy', 'Terms & Conditions'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>{col.title}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {col.links.map(link => <li key={link} style={{ fontSize: '0.875rem', color: '#9ca3af', cursor: 'pointer' }}>{link}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #1f2937', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>© 2025 KisanSetu. All rights reserved.</div>
            <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Made with ❤️ for Indian Farmers</div>
          </div>
        </div>
      </footer>

      {/* ── Role Selection Modal ── */}
      {showRoleModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setShowRoleModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#ffffff', borderRadius: '20px', padding: '2rem', maxWidth: '480px', width: '100%', boxShadow: '0 25px 60px rgba(0,0,0,0.25)' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>Enter KisanSetu</h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '2px' }}>Select your role to launch the demo</p>
              </div>
              <button onClick={() => setShowRoleModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={22} color="#6b7280" />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { role: 'Farmer' as UserRole,    step: 1, icon: Sprout,       color: '#15803d', bg: '#f0fdf4', label: 'Farmer',     sub: 'Ramesh Patil, Nashik' },
                { role: 'Bulk Buyer' as UserRole, step: 5, icon: Building2,  color: '#ea580c', bg: '#fff7ed', label: 'Bulk Buyer',  sub: 'Taj Hotels Group, Mumbai' },
                { role: 'FPO' as UserRole,        step: 7, icon: Users2,      color: '#0284c7', bg: '#e0f2fe', label: 'FPO Hub',    sub: 'Sahyadri Producer Co.' },
                { role: 'Consumer' as UserRole,   step: 0, icon: ShoppingCart, color: '#9333ea', bg: '#faf5ff', label: 'Consumer', sub: 'Priya Sharma, Mumbai' },
              ].map(r => (
                <button
                  key={r.label}
                  onClick={() => r.role === 'Consumer' ? (() => { switchDemoRole('Consumer'); onEnterApp('marketplace'); setShowRoleModal(false); })() : handleLaunchRole(r.role, r.step)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0.875rem 1rem', borderRadius: '12px', background: r.bg, border: `1.5px solid ${r.color}30`, cursor: 'pointer', textAlign: 'left', width: '100%' }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                    <r.icon size={22} color={r.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827' }}>{r.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{r.sub}</div>
                  </div>
                  <ArrowRight size={16} color={r.color} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
