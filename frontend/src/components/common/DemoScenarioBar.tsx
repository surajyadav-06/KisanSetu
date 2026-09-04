import React from 'react';
import { useDemoTour, DEMO_STEPS } from '../../context/DemoTourContext';
import { useAuth } from '../../context/AuthContext';
import { Play, ChevronRight, ChevronLeft, Sparkles, RefreshCw, UserCheck } from 'lucide-react';

export const DemoScenarioBar: React.FC = () => {
  const {
    currentStepIndex,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isTourActive,
    toggleTour
  } = useDemoTour();
  const { role, switchDemoRole } = useAuth();

  if (!isTourActive) {
    return (
      <button
        onClick={toggleTour}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#15803d',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: '9999px',
          border: 'none',
          boxShadow: '0 8px 20px rgba(21, 128, 61, 0.35)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.875rem'
        }}
      >
        <Sparkles size={18} />
        Open Demo Tour
      </button>
    );
  }

  return (
    <div className="demo-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,255,255,0.18)',
          padding: '4px 10px',
          borderRadius: '20px',
          fontWeight: 700,
          fontSize: '0.8125rem'
        }}>
          <Sparkles size={14} color="#fde047" />
          <span>Platform Scenario Mode</span>
          <span style={{
            background: '#f59e0b',
            color: '#ffffff',
            padding: '1px 6px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            marginLeft: '4px'
          }}>
            {currentStep.badge}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 700, color: '#fef08a' }}>{currentStep.title}:</span>
          <span style={{ color: '#f0fdf4', opacity: 0.95, fontSize: '0.8125rem' }}>{currentStep.guidance}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Quick Role Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(0,0,0,0.2)',
          padding: '3px 8px',
          borderRadius: '6px',
          fontSize: '0.75rem'
        }}>
          <UserCheck size={13} color="#86efac" />
          <span>Role: <strong>{role}</strong></span>
        </div>

        {/* Step Selector Dropdown */}
        <select
          value={currentStep.stepNumber}
          onChange={(e) => goToStep(Number(e.target.value))}
          style={{
            background: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.8125rem',
            cursor: 'pointer'
          }}
        >
          {DEMO_STEPS.map((s) => (
            <option key={s.stepNumber} value={s.stepNumber} style={{ color: '#19271d', background: '#ffffff' }}>
              Step {s.stepNumber}: {s.title} ({s.role})
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '6px',
              cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentStepIndex === 0 ? 0.4 : 1,
              display: 'flex',
              alignItems: 'center'
            }}
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={nextStep}
            style={{
              background: '#f59e0b',
              border: 'none',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '6px 12px',
              fontWeight: 700,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}
          >
            <span>{currentStep.actionText}</span>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
