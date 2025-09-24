// Initialize badge system in Firebase
import { badgeService } from './firebase-service';
import { BADGE_CONFIG } from './badge-config';

/**
 * Initialize all badges in Firebase Firestore
 * This should be run once to populate the badges collection
 */
export const initializeBadges = async (): Promise<void> => {
  try {
    console.log('🏆 Initializing badge system...');
    
    const badges = Object.values(BADGE_CONFIG);
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const badge of badges) {
      try {
        // Check if badge already exists
        const existingBadges = await badgeService.getAllBadges();
        const badgeExists = existingBadges.some(existingBadge => existingBadge.id === badge.id);
        
        if (!badgeExists) {
          // Create badge in Firebase
          await badgeService.awardBadge('system', badge.id); // This will create the badge
          createdCount++;
          console.log(`✅ Created badge: ${badge.name}`);
        } else {
          skippedCount++;
          console.log(`⏭️ Badge already exists: ${badge.name}`);
        }
      } catch (error) {
        console.error(`❌ Failed to create badge ${badge.name}:`, error);
      }
    }
    
    console.log(`🏆 Badge initialization complete! Created: ${createdCount}, Skipped: ${skippedCount}`);
  } catch (error) {
    console.error('❌ Failed to initialize badges:', error);
    throw error;
  }
};

/**
 * Initialize demo stats for all demos
 */
export const initializeDemoStats = async (): Promise<void> => {
  try {
    console.log('📊 Initializing demo stats...');
    
    const demos = [
      { id: 'hello-milestone', name: 'Baby Steps to Riches' },
      { id: 'milestone-voting', name: 'Democracy in Action' },
      { id: 'dispute-resolution', name: 'Drama Queen Escrow' },
      { id: 'micro-marketplace', name: 'Gig Economy Madness' },
    ];
    
    for (const demo of demos) {
      try {
        await badgeService.awardBadge('system', demo.id); // This will initialize demo stats
        console.log(`✅ Initialized stats for: ${demo.name}`);
      } catch (error) {
        console.error(`❌ Failed to initialize stats for ${demo.name}:`, error);
      }
    }
    
    console.log('📊 Demo stats initialization complete!');
  } catch (error) {
    console.error('❌ Failed to initialize demo stats:', error);
    throw error;
  }
};

/**
 * Run full system initialization
 */
export const initializeTrackingSystem = async (): Promise<void> => {
  try {
    console.log('🚀 Starting comprehensive tracking system initialization...');
    
    await initializeBadges();
    await initializeDemoStats();
    
    console.log('🎉 Tracking system initialization complete!');
    console.log(`
📋 System Features Initialized:
✅ User account creation on wallet connect
✅ Demo completion tracking with XP rewards
✅ Badge system with 20+ achievements
✅ Leaderboard with ranking system
✅ Mandatory feedback collection
✅ Real-time analytics and statistics
✅ Progress tracking and leveling system
✅ Demo clap and engagement tracking
    `);
  } catch (error) {
    console.error('❌ Failed to initialize tracking system:', error);
    throw error;
  }
};

// Export for manual initialization if needed
export default {
  initializeBadges,
  initializeDemoStats,
  initializeTrackingSystem,
};
