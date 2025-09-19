'use client';

import { demoStatsService } from './firebase-service';

// Demo configuration
export const DEMO_CONFIG = [
  {
    id: 'hello-milestone',
    name: 'Baby Steps to Riches',
    description: 'Basic Escrow Flow Demo',
  },
  {
    id: 'milestone-voting',
    name: 'Democracy in Action',
    description: 'Multi-Stakeholder Approval System',
  },
  {
    id: 'dispute-resolution',
    name: 'Drama Queen Escrow',
    description: 'Dispute Resolution & Arbitration',
  },
  {
    id: 'micro-marketplace',
    name: 'Gig Economy Madness',
    description: 'Micro-Task Marketplace',
  },
];

/**
 * Initialize demo stats in Firebase for all demos
 * This should be called when the app loads to ensure all demos have stats records
 */
export const initializeDemoStats = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing demo stats...');
    
    const initPromises = DEMO_CONFIG.map(async (demo) => {
      try {
        await demoStatsService.initializeDemoStats(demo.id, demo.name);
        console.log(`✅ Initialized stats for ${demo.name}`);
      } catch (error) {
        console.error(`❌ Failed to initialize stats for ${demo.name}:`, error);
      }
    });

    await Promise.all(initPromises);
    console.log('🎉 Demo stats initialization completed');
  } catch (error) {
    console.error('❌ Failed to initialize demo stats:', error);
  }
};

/**
 * Get demo configuration by ID
 */
export const getDemoConfig = (demoId: string) => {
  return DEMO_CONFIG.find(demo => demo.id === demoId);
};

/**
 * Get all demo configurations
 */
export const getAllDemoConfigs = () => {
  return DEMO_CONFIG;
};
