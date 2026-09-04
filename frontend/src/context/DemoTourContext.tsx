import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

export interface DemoStep {
  stepNumber: number;
  title: string;
  role: 'Farmer' | 'Bulk Buyer' | 'Consumer' | 'FPO';
  targetTab: string;
  badge: string;
  guidance: string;
  actionText: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    stepNumber: 1,
    title: 'Farmer Identity & Profile',
    role: 'Farmer',
    targetTab: 'dashboard',
    badge: 'Step 1 of 11',
    guidance: 'Logged in as Ramesh Patil (Verified Nashik Farmer). Observe the clean agro-SaaS command center.',
    actionText: 'Proceed to Add Produce'
  },
  {
    stepNumber: 2,
    title: 'List Fresh Harvest (Add Produce)',
    role: 'Farmer',
    targetTab: 'my-produce',
    badge: 'Step 2 of 11',
    guidance: 'Farmer lists 500 kg Grade-A Tomato from Nashik at ₹28/kg. Real-time form validation & indexing.',
    actionText: 'Open Add Produce Form'
  },
  {
    stepNumber: 3,
    title: 'Verify Live Supply Database',
    role: 'Farmer',
    targetTab: 'my-produce',
    badge: 'Step 3 of 11',
    guidance: 'The new 500 kg Grade-A lot enters the live supply database with QR/lot tracking readiness.',
    actionText: 'Check AI Demand Forecast'
  },
  {
    stepNumber: 4,
    title: 'AI Demand Forecasting & Insights',
    role: 'Farmer',
    targetTab: 'ai-demand',
    badge: 'Step 4 of 11',
    guidance: 'AI predicts +21% surge in Tomato demand next week with 87% confidence and gives actionable advice.',
    actionText: 'Switch to Bulk Buyer'
  },
  {
    stepNumber: 5,
    title: 'Bulk Buyer Requirements',
    role: 'Bulk Buyer',
    targetTab: 'requirements',
    badge: 'Step 5 of 11',
    guidance: 'Taj Hospitality Group posts institutional bulk requirement: 1,000 kg Grade-A Tomato for Mumbai.',
    actionText: 'Execute Matching Engine'
  },
  {
    stepNumber: 6,
    title: 'AI Supply Matching Engine',
    role: 'Bulk Buyer',
    targetTab: 'matching',
    badge: 'Step 6 of 11',
    guidance: 'System matches Farmer A (500kg), Farmer B (300kg), and Farmer C (200kg) to fulfill 1,000 kg.',
    actionText: 'Create Aggregated Order'
  },
  {
    stepNumber: 7,
    title: 'Multi-Farmer Supply Aggregation',
    role: 'Bulk Buyer',
    targetTab: 'aggregation',
    badge: 'Step 7 of 11',
    guidance: 'Requirement fulfilled! 3 smallholder farmers aggregated into one consolidated institutional consignment.',
    actionText: 'Open Logistics Planning'
  },
  {
    stepNumber: 8,
    title: 'Multi-Pickup Logistics Hub',
    role: 'Bulk Buyer',
    targetTab: 'logistics',
    badge: 'Step 8 of 11',
    guidance: 'Review cold-chain vehicle allocation, weight capacity (Tata 407 Reefer), and pickup coordinates.',
    actionText: 'Optimize Delivery Route'
  },
  {
    stepNumber: 9,
    title: 'Interactive Route Optimization Map',
    role: 'Bulk Buyer',
    targetTab: 'route-optimization',
    badge: 'Step 9 of 11',
    guidance: 'Visualized multi-point route (Nashik Hub -> Pune -> Mumbai), 42 km cluster transit, 1h 35m time.',
    actionText: 'View Transparent Price Breakdown'
  },
  {
    stepNumber: 10,
    title: 'Transparent Price Breakdown',
    role: 'Farmer',
    targetTab: 'price-breakdown',
    badge: 'Step 10 of 11',
    guidance: 'Where money goes: Farmer ₹27/kg, Aggregation ₹1, Logistics ₹2, Platform ₹1, Packaging ₹1 = Buyer ₹32/kg.',
    actionText: 'Track Order Lifecycle'
  },
  {
    stepNumber: 11,
    title: 'End-to-End Order Lifecycle',
    role: 'Bulk Buyer',
    targetTab: 'orders',
    badge: 'Step 11 of 11 (Completed)',
    guidance: 'Real-time lifecycle tracking: Placed → Matched → Aggregated → Route Planned → Picked Up → Delivered.',
    actionText: 'Restart Demo Tour'
  }
];

interface DemoTourContextType {
  currentStepIndex: number;
  currentStep: DemoStep;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isTourActive: boolean;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isRequirementModalOpen: boolean;
  setIsRequirementModalOpen: (open: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (stepNumber: number) => void;
  toggleTour: () => void;
}

const DemoTourContext = createContext<DemoTourContextType | undefined>(undefined);

export const DemoTourProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTourActive, setIsTourActive] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRequirementModalOpen, setIsRequirementModalOpen] = useState(false);

  const { switchDemoRole } = useAuth();
  const { showToast } = useToast();

  const currentStep = DEMO_STEPS[currentStepIndex];

  const applyStepState = (stepIdx: number) => {
    const step = DEMO_STEPS[stepIdx];
    setCurrentStepIndex(stepIdx);
    setActiveTab(step.targetTab);
    switchDemoRole(step.role);

    if (step.stepNumber === 2) {
      setIsAddModalOpen(true);
    } else {
      setIsAddModalOpen(false);
    }

    if (step.stepNumber === 5) {
      setIsRequirementModalOpen(true);
    } else {
      setIsRequirementModalOpen(false);
    }

    if (step.stepNumber === 7 || step.stepNumber === 11) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }

    showToast(
      'info',
      `Demo Tour: ${step.badge}`,
      `${step.title} — Active Role: ${step.role}`
    );
  };

  const nextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      applyStepState(currentStepIndex + 1);
    } else {
      // Loop back to step 1
      applyStepState(0);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      applyStepState(currentStepIndex - 1);
    }
  };

  const goToStep = (stepNumber: number) => {
    const targetIdx = Math.max(0, Math.min(DEMO_STEPS.length - 1, stepNumber - 1));
    applyStepState(targetIdx);
  };

  const toggleTour = () => {
    setIsTourActive(!isTourActive);
  };

  return (
    <DemoTourContext.Provider
      value={{
        currentStepIndex,
        currentStep,
        activeTab,
        setActiveTab,
        isTourActive,
        isAddModalOpen,
        setIsAddModalOpen,
        isRequirementModalOpen,
        setIsRequirementModalOpen,
        nextStep,
        prevStep,
        goToStep,
        toggleTour
      }}
    >
      {children}
    </DemoTourContext.Provider>
  );
};

export const useDemoTour = () => {
  const context = useContext(DemoTourContext);
  if (!context) throw new Error('useDemoTour must be used within DemoTourProvider');
  return context;
};
