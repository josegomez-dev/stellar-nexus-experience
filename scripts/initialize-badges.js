#!/usr/bin/env node

/**
 * Initialize badges in Firebase Firestore
 * This script ensures all badges from the configuration are available in Firebase
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc } = require('firebase/firestore');

// Firebase configuration (you'll need to add your config here)
const firebaseConfig = {
  // Add your Firebase config here
  // This should match your .env.local or environment variables
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Badge definitions from the configuration
const badges = [
  {
    id: 'welcome_explorer',
    name: 'Welcome Explorer',
    description: 'Joined the Nexus Experience community',
    icon: '🌟',
    category: 'special',
    rarity: 'common',
    xpReward: 10,
    requirements: [
      {
        type: 'custom',
        value: 1,
        description: 'Create account and connect wallet',
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 'first_demo',
    name: 'First Steps',
    description: 'Completed your first demo',
    icon: '👶',
    category: 'demo',
    rarity: 'common',
    xpReward: 25,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete any demo',
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 'demo_master',
    name: 'Demo Master',
    description: 'Completed all available demos',
    icon: '🎓',
    category: 'achievement',
    rarity: 'epic',
    xpReward: 100,
    requirements: [
      {
        type: 'demo_completion',
        value: 4,
        description: 'Complete all 4 demos',
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 'escrow-expert',
    name: 'Escrow Expert',
    description: 'Mastered the basic escrow flow',
    icon: '🔒',
    category: 'demo',
    rarity: 'common',
    xpReward: 30,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Micro Task Marketplace demo',
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 'trust-guardian',
    name: 'Trust Guardian',
    description: 'Resolved conflicts like a true arbitrator',
    icon: '⚖️',
    category: 'demo',
    rarity: 'rare',
    xpReward: 50,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Dispute Resolution demo',
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 'stellar-champion',
    name: 'Stellar Champion',
    description: 'Mastered the micro-task marketplace',
    icon: '💼',
    category: 'demo',
    rarity: 'epic',
    xpReward: 100,
    requirements: [
      {
        type: 'demo_completion',
        value: 1,
        description: 'Complete Micro Task Marketplace demo',
      },
    ],
    createdAt: new Date(),
  },
  {
    id: 'nexus-master',
    name: 'Nexus Master',
    description: 'Completed all key demos and achieved mastery',
    icon: '👑',
    category: 'achievement',
    rarity: 'legendary',
    xpReward: 200,
    requirements: [
      {
        type: 'custom',
        value: 3,
        description: 'Complete demos 1, 3, and 4',
      },
    ],
    createdAt: new Date(),
  },
];

async function initializeBadges() {
  console.log('🚀 Initializing badges in Firebase...');
  
  try {
    for (const badge of badges) {
      const badgeRef = doc(db, 'badges', badge.id);
      const badgeSnap = await getDoc(badgeRef);
      
      if (!badgeSnap.exists()) {
        await setDoc(badgeRef, badge);
        console.log(`✅ Created badge: ${badge.name}`);
      } else {
        console.log(`⚠️ Badge already exists: ${badge.name}`);
      }
    }
    
    console.log('🎉 Badge initialization completed successfully!');
  } catch (error) {
    console.error('❌ Error initializing badges:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeBadges();
