// Utility to initialize demo stats for existing demos
// This can be called once to set up the demo_stats collection

import { demoStatsService } from '../firebase/firebase-service';

export const initializeAllDemoStats = async () => {
  const demos = [
    { id: 'hello-milestone', name: 'Baby Steps to Riches' },
    { id: 'dispute-resolution', name: 'Drama Queen Escrow' },
    { id: 'micro-marketplace', name: 'Gig Economy Madness' },
    { id: 'nexus-master', name: 'Nexus Master Achievement' },
  ];

  console.log('Initializing demo stats for all demos...');
  
  for (const demo of demos) {
    try {
      await demoStatsService.initializeDemoStats(demo.id, demo.name);
      console.log(`✅ Initialized stats for ${demo.name} (${demo.id})`);
    } catch (error) {
      console.error(`❌ Failed to initialize stats for ${demo.name} (${demo.id}):`, error);
    }
  }
  
  console.log('Demo stats initialization complete!');
};

// Call this function to initialize demo stats
// initializeAllDemoStats().catch(console.error);
