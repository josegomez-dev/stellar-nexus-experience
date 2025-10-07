export interface DemoCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  isReady: boolean;
  multiStakeholderRequired: boolean;
}

export const DEMO_CARDS: DemoCard[] = [
  {
    id: 'hello-milestone',
    title: '1. Baby Steps to Riches',
    subtitle: 'Basic Escrow Flow Demo',
    description:
      'Simple escrow flow with automatic milestone completion. Learn the fundamentals of trustless work: initialize escrow, fund it, complete milestones, approve work, and automatically release funds.',
    icon: '🎮',
    color: 'from-brand-500 to-brand-400',
    isReady: true,
    multiStakeholderRequired: false,
  },
  {
    id: 'dispute-resolution',
    title: '2. Drama Queen Escrow',
    subtitle: 'Dispute Resolution & Arbitration',
    description:
      'Arbitration drama - who will win the trust battle? Experience the full dispute resolution workflow: raise disputes, present evidence, and let arbitrators decide the outcome.',
    icon: '🎮',
    color: 'from-warning-500 to-warning-400',
    isReady: true,
    multiStakeholderRequired: false,
  },
  {
    id: 'micro-marketplace',
    title: '3. Gig Economy Madness',
    subtitle: 'Micro-Task Marketplace',
    description:
      'Lightweight gig-board with escrow! Post tasks, browse opportunities, and manage micro-work with built-in escrow protection for both clients and workers.',
    icon: '🎮',
    color: 'from-accent-500 to-accent-400',
    isReady: true,
    multiStakeholderRequired: false,
  },
  {
    id: 'nexus-master',
    title: 'Nexus Master Achievement',
    subtitle: 'Complete All Main Badges',
    description:
      'The ultimate achievement! Complete all three main demos to unlock the legendary Nexus Master badge and claim your place among the elite.',
    icon: '/images/demos/economy.png',
    color: 'from-gray-500 to-gray-400',
    isReady: false,
    multiStakeholderRequired: false,
  },
];

// Demo to badge mapping
export const DEMO_BADGE_MAP: Record<string, string> = {
  'hello-milestone': 'escrow_expert',
  'dispute-resolution': 'trust_guardian',
  'micro-marketplace': 'stellar_champion',
};

// Top badges for mini-games unlock
export const TOP_BADGES = [
  'welcome_explorer',
  'escrow_expert',
  'trust_guardian',
  'stellar_champion',
  'nexus_master',
];

// Demo color mappings
export const DEMO_COLOR_MAPPINGS = {
  button: {
    'from-brand-500 to-brand-400': {
      gradient: 'from-brand-500 via-brand-400 to-brand-600',
      hoverGradient: 'hover:from-brand-600 hover:via-brand-500 hover:to-brand-700',
      shadow: 'hover:shadow-brand-500/50',
    },
    'from-success-500 to-success-400': {
      gradient: 'from-success-500 via-success-400 to-success-600',
      hoverGradient: 'hover:from-success-600 hover:via-success-500 hover:to-success-700',
      shadow: 'hover:shadow-success-500/50',
    },
    'from-warning-500 to-warning-400': {
      gradient: 'from-warning-500 via-warning-400 to-warning-600',
      hoverGradient: 'hover:from-warning-600 hover:via-warning-500 hover:to-warning-700',
      shadow: 'hover:shadow-warning-500/50',
    },
    'from-accent-500 to-accent-400': {
      gradient: 'from-accent-500 via-accent-400 to-accent-600',
      hoverGradient: 'hover:from-accent-600 hover:via-accent-500 hover:to-accent-700',
      shadow: 'hover:shadow-accent-500/50',
    },
  },
  badge: {
    'from-brand-500 to-brand-400': {
      gradient: 'from-brand-500 to-brand-400',
      background: 'from-brand-500/20 to-brand-400/20',
      border: 'border-brand-400/30',
      titleColor: 'text-brand-200',
      descriptionColor: 'text-brand-300/80',
    },
    'from-success-500 to-success-400': {
      gradient: 'from-success-500 to-success-400',
      background: 'from-success-500/20 to-success-400/20',
      border: 'border-success-400/30',
      titleColor: 'text-success-200',
      descriptionColor: 'text-success-300/80',
    },
    'from-warning-500 to-warning-400': {
      gradient: 'from-warning-500 to-warning-400',
      background: 'from-warning-500/20 to-warning-400/20',
      border: 'border-warning-400/30',
      titleColor: 'text-warning-200',
      descriptionColor: 'text-warning-300/80',
    },
    'from-accent-500 to-accent-400': {
      gradient: 'from-accent-500 to-accent-400',
      background: 'from-accent-500/20 to-accent-400/20',
      border: 'border-accent-400/30',
      titleColor: 'text-accent-200',
      descriptionColor: 'text-accent-300/80',
    },
  },
  card: {
    'from-brand-500 to-brand-400': {
      baseOpacity: 15,
      completedOpacity: 25,
      hoverOpacity: 20,
      completedHoverOpacity: 35,
      borderOpacity: 30,
      completedBorderOpacity: 60,
      hoverBorderOpacity: 50,
      completedHoverBorderOpacity: 80,
      shadowOpacity: 20,
      completedShadowOpacity: 40,
      hoverShadowOpacity: 30,
      completedHoverShadowOpacity: 60,
    },
    'from-success-500 to-success-400': {
      baseOpacity: 15,
      completedOpacity: 25,
      hoverOpacity: 20,
      completedHoverOpacity: 35,
      borderOpacity: 30,
      completedBorderOpacity: 60,
      hoverBorderOpacity: 50,
      completedHoverBorderOpacity: 80,
      shadowOpacity: 20,
      completedShadowOpacity: 40,
      hoverShadowOpacity: 30,
      completedHoverShadowOpacity: 60,
    },
    'from-warning-500 to-warning-400': {
      baseOpacity: 15,
      completedOpacity: 25,
      hoverOpacity: 20,
      completedHoverOpacity: 35,
      borderOpacity: 30,
      completedBorderOpacity: 60,
      hoverBorderOpacity: 50,
      completedHoverBorderOpacity: 80,
      shadowOpacity: 20,
      completedShadowOpacity: 40,
      hoverShadowOpacity: 30,
      completedHoverShadowOpacity: 60,
    },
    'from-accent-500 to-accent-400': {
      baseOpacity: 15,
      completedOpacity: 25,
      hoverOpacity: 20,
      completedHoverOpacity: 35,
      borderOpacity: 30,
      completedBorderOpacity: 60,
      hoverBorderOpacity: 50,
      completedHoverBorderOpacity: 80,
      shadowOpacity: 20,
      completedShadowOpacity: 40,
      hoverShadowOpacity: 30,
      completedHoverShadowOpacity: 60,
    },
  },
};

// Color values for CSS variables
export const DEMO_COLOR_VALUES: Record<string, Record<number, string>> = {
  'from-brand-500 to-brand-400': {
    1: '#0ea5e9',
    2: '#38bdf8',
    3: '#7dd3fc',
  },
  'from-success-500 to-success-400': {
    1: '#22c55e',
    2: '#4ade80',
    3: '#86efac',
  },
  'from-warning-500 to-warning-400': {
    1: '#f59e0b',
    2: '#fbbf24',
    3: '#fcd34d',
  },
  'from-accent-500 to-accent-400': {
    1: '#d946ef',
    2: '#e879f9',
    3: '#f0abfc',
  },
};
