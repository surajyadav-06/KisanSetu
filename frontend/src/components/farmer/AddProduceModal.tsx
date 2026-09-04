import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDemoTour } from '../../context/DemoTourContext';
import { produceService } from '../../services/api';
import { X, Sprout, Upload, Sparkles, CheckCircle } from 'lucide-react';
import { Produce } from '../../types';

interface AddProduceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProduceAdded: (produce: Produce) => void;
}

const SAMPLE_IMAGES: Record<string, string> = {
  'Tomato': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  'Onion': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  'Potato': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  'Grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
  'Banana': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  'Cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80',
  'Capsicum': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80'
};

export const AddProduceModal: React.FC<AddProduceModalProps> = ({ isOpen, onClose, onProduceAdded }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { nextStep, currentStep } = useDemoTour();

  const [cropName, setCropName] = useState('Tomato');
  const [quantity, setQuantity] = useState('500');
  const [unit, setUnit] = useState('kg');
  const [grade, setGrade] = useState<'Grade A' | 'Grade B' | 'Standard' | 'Export Quality'>('Grade A');
  const [perishability, setPerishability] = useState<'Low' | 'Medium' | 'High'>('High');
  const [harvestDate, setHarvestDate] = useState('2026-09-08');
  const [availableFrom, setAvailableFrom] = useState('2026-09-10');
  const [expectedPrice, setExpectedPrice] = useState('28');
  const [location, setLocation] = useState('Nashik, Maharashtra');
  const [description, setDescription] = useState('Sun-ripened Grade-A table tomatoes with high shelf life and firm texture.');
  const [imageUrl, setImageUrl] = useState(SAMPLE_IMAGES['Tomato']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleCropChange = (selectedCrop: string) => {
    setCropName(selectedCrop);
    if (SAMPLE_IMAGES[selectedCrop]) {
      setImageUrl(SAMPLE_IMAGES[selectedCrop]);
    }
    // Set realistic perishability defaults
    if (['Tomato', 'Grapes', 'Capsicum', 'Cauliflower'].includes(selectedCrop)) {
      setPerishability('High');
    } else if (['Banana'].includes(selectedCrop)) {
      setPerishability('Medium');
    } else {
      setPerishability('Low');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity || !expectedPrice || !location) {
      showToast('error', 'Missing Information', 'Please fill in all mandatory fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_id: user?.id || 1,
        farmer_name: user?.full_name || 'Ramesh Patil (Demo Farmer)',
        crop_name: cropName,
        category: 'Vegetables',
        quantity_available: parseFloat(quantity),
        unit,
        grade,
        perishability,
        harvest_date: harvestDate,
        available_from: availableFrom,
        expected_price: parseFloat(expectedPrice),
        location,
        description,
        image_url: imageUrl
      };

      const result = await produceService.addProduce(payload);
      showToast(
        'success',
        'Produce Listed in Live Supply DB',
        `Successfully listed ${quantity} ${unit} of ${grade} ${cropName} (${perishability} perishability) at ₹${expectedPrice}/kg.`
      );
      onProduceAdded(result.data);
      onClose();

      // If user was on Step 2 of the demo tour, advance to Step 3
      if (currentStep.stepNumber === 2) {
        nextStep();
      }
    } catch (err: any) {
      showToast('error', 'Failed to List Produce', 'Could not save produce listing.');
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
              background: '#dcfce7',
              color: '#15803d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sprout size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem' }}>List Fresh Harvest Produce</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Add your upcoming supply to the live KisanSetu matching network.
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Row 1: Crop, Grade & Perishability */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Crop / Product *</label>
              <select
                className="form-select"
                value={cropName}
                onChange={(e) => handleCropChange(e.target.value)}
              >
                <option value="Tomato">Tomato (Grade A)</option>
                <option value="Onion">Onion (Lasalgaon Red)</option>
                <option value="Potato">Potato (Jyoti Fresh)</option>
                <option value="Grapes">Grapes (Thomson Seedless)</option>
                <option value="Banana">Banana (Grand Naine)</option>
                <option value="Cauliflower">Cauliflower</option>
                <option value="Capsicum">Capsicum (Green Bell)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Produce Grade *</label>
              <select
                className="form-select"
                value={grade}
                onChange={(e) => setGrade(e.target.value as any)}
              >
                <option value="Grade A">Grade A (Premium)</option>
                <option value="Grade B">Grade B (Processing)</option>
                <option value="Export Quality">Export Quality</option>
                <option value="Standard">Standard Commercial</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Perishability *</label>
              <select
                className="form-select"
                value={perishability}
                onChange={(e) => setPerishability(e.target.value as any)}
              >
                <option value="High">High (3-5 days)</option>
                <option value="Medium">Medium (7-14 days)</option>
                <option value="Low">Low (30+ days)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Quantity & Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Available Quantity *</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="number"
                  className="form-input"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 500"
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
                  <option value="Quintal">Quintal</option>
                  <option value="Ton">Ton</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expected Net Price (₹/kg) *</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={expectedPrice}
                onChange={(e) => setExpectedPrice(e.target.value)}
                placeholder="e.g. 28"
                required
              />
            </div>
          </div>

          {/* Row 3: Harvest & Availability Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Harvest Date</label>
              <input
                type="date"
                className="form-input"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Available for Dispatch From</label>
              <input
                type="date"
                className="form-input"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
              />
            </div>
          </div>

          {/* Row 4: Location */}
          <div className="form-group">
            <label className="form-label">Farm Pickup Location *</label>
            <input
              type="text"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Nashik, Maharashtra"
              required
            />
          </div>

          {/* Row 5: Description */}
          <div className="form-group">
            <label className="form-label">Description & Quality Notes</label>
            <textarea
              className="form-textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe variety, moisture level, organic certification, packaging..."
            />
          </div>

          {/* AI Pre-Matching Preview Badge */}
          <div style={{
            background: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-200)',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={20} color="#15803d" />
            <div style={{ fontSize: '0.8125rem', color: '#166534' }}>
              <strong>AI Supply Matching Ready:</strong> Listing this produce will immediately make it discoverable for institutional buyers like Taj Hotels in Mumbai looking for 1,000 kg Grade-A Tomato.
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              <CheckCircle size={18} />
              <span>{isSubmitting ? 'Listing Produce...' : 'List Produce Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
