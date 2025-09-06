export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BadgeCategory = 'account' | 'demo' | 'achievement' | 'special';

export interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  rarity: BadgeRarity;
  pointsValue: number;
  requirement: string;
  category: BadgeCategory;
  imageUrl?: string; // Optional - kept for compatibility, but we use SVG emblems
  isEarned?: boolean;
}

// Rarity styles for 3D badge rendering
export const rarityStyles: Record<BadgeRarity, { ring: string; glow: string; text: string }> = {
  common: {
    ring: "from-slate-200/70 via-slate-400/70 to-slate-300/70",
    glow: "shadow-[0_0_40px_-8px_rgba(148,163,184,0.45)]",
    text: "text-slate-200",
  },
  rare: {
    ring: "from-sky-200 via-cyan-300 to-sky-400",
    glow: "shadow-[0_0_50px_-6px_rgba(56,189,248,0.55)]",
    text: "text-sky-100",
  },
  epic: {
    ring: "from-fuchsia-200 via-violet-300 to-indigo-300",
    glow: "shadow-[0_0_60px_-6px_rgba(168,85,247,0.6)]",
    text: "text-fuchsia-100",
  },
  legendary: {
    ring: "from-amber-200 via-yellow-300 to-orange-300",
    glow: "shadow-[0_0_70px_-4px_rgba(251,191,36,0.65)]",
    text: "text-amber-100",
  },
};

export const AVAILABLE_BADGES: BadgeConfig[] = [
  {
    id: 'trust-guardian',
    name: 'Trust Guardian',
    description: 'Welcome to the world of trustless work! Your journey begins here.',
    rarity: 'common',
    pointsValue: 50,
    requirement: 'Create your first account and earn 100+ bonus points',
    category: 'account',
  },
  {
    id: 'escrow-expert',
    name: 'Escrow Expert',
    description: 'You\'ve mastered the art of secure fund management!',
    rarity: 'rare',
    pointsValue: 100,
    requirement: 'Complete Demo 1: Baby Steps to Riches',
    category: 'demo',
  },
  {
    id: 'blockchain-pioneer',
    name: 'Blockchain Pioneer',
    description: 'A true explorer of the decentralized frontier!',
    rarity: 'epic',
    pointsValue: 150,
    requirement: 'Complete Demo 2: Democracy in Action',
    category: 'demo',
  },
  {
    id: 'dispute-detective',
    name: 'Dispute Detective',
    description: 'Justice served with smart contracts and wisdom!',
    rarity: 'epic',
    pointsValue: 200,
    requirement: 'Complete Demo 3: Drama Queen Escrow',
    category: 'demo',
  },
  {
    id: 'gig-economy-guru',
    name: 'Gig Economy Guru',
    description: 'Master of micro-tasks and marketplace magic!',
    rarity: 'legendary',
    pointsValue: 250,
    requirement: 'Complete Demo 4: Gig Economy Madness',
    category: 'demo',
  },
  {
    id: 'stellar-champion',
    name: 'Stellar Champion',
    description: 'The ultimate Trustless Work champion! You\'ve conquered it all!',
    rarity: 'legendary',
    pointsValue: 500,
    requirement: 'Complete all 4 demos and invite a friend',
    category: 'achievement',
  },
];

export const getBadgesByCategory = (category: BadgeConfig['category']) => {
  return AVAILABLE_BADGES.filter(badge => badge.category === category);
};

export const getBadgeById = (id: string) => {
  return AVAILABLE_BADGES.find(badge => badge.id === id);
};

export const getRarityColor = (rarity: BadgeConfig['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'from-gray-400 to-gray-500';
    case 'rare':
      return 'from-blue-400 to-blue-500';
    case 'epic':
      return 'from-purple-400 to-purple-500';
    case 'legendary':
      return 'from-yellow-400 to-orange-500';
    default:
      return 'from-gray-400 to-gray-500';
  }
};

export const getRarityTextColor = (rarity: BadgeConfig['rarity']) => {
  switch (rarity) {
    case 'common':
      return 'text-gray-300';
    case 'rare':
      return 'text-blue-300';
    case 'epic':
      return 'text-purple-300';
    case 'legendary':
      return 'text-yellow-300';
    default:
      return 'text-gray-300';
  }
};
