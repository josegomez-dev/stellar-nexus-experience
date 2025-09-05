export interface BadgeConfig {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pointsValue: number;
  requirement: string;
  category: 'account' | 'demo' | 'achievement' | 'special';
  imageUrl: string;
  isEarned?: boolean;
}

export const AVAILABLE_BADGES: BadgeConfig[] = [
  {
    id: 'trust-guardian',
    name: 'Trust Guardian',
    description: 'Welcome to the world of trustless work! Your journey begins here.',
    rarity: 'common',
    pointsValue: 50,
    requirement: 'Create your first account',
    category: 'account',
    imageUrl: '/images/badges/placeholder-trust-guardian.svg',
  },
  {
    id: 'escrow-expert',
    name: 'Escrow Expert',
    description: 'You\'ve mastered the art of secure fund management!',
    rarity: 'rare',
    pointsValue: 100,
    requirement: 'Complete Demo 1: Baby Steps to Riches',
    category: 'demo',
    imageUrl: '/images/badges/placeholder-escrow-expert.svg',
  },
  {
    id: 'blockchain-pioneer',
    name: 'Blockchain Pioneer',
    description: 'A true explorer of the decentralized frontier!',
    rarity: 'epic',
    pointsValue: 150,
    requirement: 'Complete Demo 2: Democracy in Action',
    category: 'demo',
    imageUrl: '/images/badges/placeholder-blockchain-pioneer.svg',
  },
  {
    id: 'dispute-detective',
    name: 'Dispute Detective',
    description: 'Justice served with smart contracts and wisdom!',
    rarity: 'epic',
    pointsValue: 200,
    requirement: 'Complete Demo 3: Drama Queen Escrow',
    category: 'demo',
    imageUrl: '/images/badges/placeholder-dispute-detective.svg',
  },
  {
    id: 'gig-economy-guru',
    name: 'Gig Economy Guru',
    description: 'Master of micro-tasks and marketplace magic!',
    rarity: 'legendary',
    pointsValue: 250,
    requirement: 'Complete Demo 4: Gig Economy Madness',
    category: 'demo',
    imageUrl: '/images/badges/placeholder-gig-guru.svg',
  },
  {
    id: 'stellar-champion',
    name: 'Stellar Champion',
    description: 'The ultimate Trustless Work champion! You\'ve conquered it all!',
    rarity: 'legendary',
    pointsValue: 500,
    requirement: 'Complete all 4 demos with perfect scores',
    category: 'achievement',
    imageUrl: '/images/badges/placeholder-stellar-champion.svg',
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
