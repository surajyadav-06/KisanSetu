import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDemoTour } from '../../context/DemoTourContext';
import { buyerService } from '../../services/api';
import { X, FilePlus2, CheckCircle, Sparkles } from 'lucide-react';
import { BuyerRequirement } from '../../types';

interface PostRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequirementCreated: (req: BuyerRequirement) => void;
}

export const PostRequirementModal: React.FC<PostRequirementModalProps> = ({ isOpen, onClose, onRequirementCreated }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { nextStep, currentStep } = useDemoTour();

  const [cropName, setCropName] = useState('Tomato');
  const [requiredQuantity, setRequiredQuantity] = useState('1000');
  const [unit, setUnit] = useState('kg');
  const [requiredGrade, setRequiredGrade] = useState('Grade A');
  const [maxPrice, setMaxPrice] = useState('30');
  const [deliveryLocation, setDeliveryLocation] = useState('Mumbai Central Logistics Hub');
  const [requiredDate, setRequiredDate] = useState('2026-09-10');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !requiredQuantity || !maxPrice || !deliveryLocation) {
      showToast('error', 'Missing Information', 'Please fill in all mandatory requirement fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        buyer_id: user?.id || 7,
        buyer_name: user?.full_name || 'Taj Hospitality Group',
        buyer_org: 'Taj Luxury Hotels & Mumbai Fresh Mart',
        crop_name: cropName,
        required_quantity: parseFloat(requiredQuantity),
        unit,
        required_grade: requiredGrade,
        max_price: parseFloat(maxPrice),
        delivery_location: deliveryLocation,
        required_date: requiredDate,
        urgency: 'High'
      };

      const result = await buyerService.createRequirement(payload);
      showToast(
        'success',
        'Bulk Requirement Broadcasted',
        `Searching verified farmer supply for ${requiredQuantity} ${unit} of ${requiredGrade} ${cropName}...`
      );
      onRequirementCreated(result.data);
      onClose();

      // Advance demo tour step if applicable
      if (currentStep.stepNumber === 5) {
        nextStep();
      }
    } catch (err) {
      showToast('error', 'Failed to Post Requirement', 'Could not create requirement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#ffedd5',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FilePlus2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>Post Bulk Procurement Requirement</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Let KisanSetu find and aggregate smallholder farm supply for your bulk order.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Crop & Grade */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Product / Crop *</label>
              <select
                className="form-select"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
              >
                <option value="Tomato">Tomato (Grade A)</option>
                <option value="Onion">Onion (Lasalgaon Red)</option>
                <option value="Potato">Potato (Jyoti Fresh)</option>
                <option value="Grapes">Grapes (Thomson Seedless)</option>
                <option value="Banana">Banana (Grand Naine)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Required Quality Grade *</label>
              <select
                className="form-select"
                value={requiredGrade}
                onChange={(e) => setRequiredGrade(e.target.value)}
              >
                <option value="Grade A">Grade A (Premium Institutional Standard)</option>
                <option value="Export Quality">Export Quality</option>
                <option value="Standard">Standard Commercial</option>
              </select>
            </div>
          </div>

          {/* Row 2: Quantity & Max Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Required Bulk Quantity *</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  className="form-input"
                  value={requiredQuantity}
                  onChange={(e) => setRequiredQuantity(e.target.value)}
                  placeholder="e.g. 1000"
                  required
                />
                <select
                  className="form-select"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{ width: '90px' }}
                >
                  <option value="kg">kg</option>
                  <option value="Crates">Crates</option>
                  <option value="Ton">Ton</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Budget Price (₹/kg) *</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 30"
                required
              />
            </div>
          </div>

          {/* Row 3: Delivery Location & Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Delivery Destination *</label>
              <input
                type="text"
                className="form-input"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g. Mumbai Central Logistics Hub"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Required Delivery Date *</label>
              <input
                type="date"
                className="form-input"
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{
            background: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={20} color="#ea580c" />
            <div style={{ fontSize: '0.8125rem', color: '#9a3412' }}>
              <strong>Multi-Farmer Matching:</strong> KisanSetu will instantly search available farmer lots across Nashik & Pune to fulfill your 1,000 kg order with single-invoice delivery.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-accent">
              <CheckCircle size={18} />
              <span>{isSubmitting ? 'Posting...' : 'Post Requirement & Match'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
