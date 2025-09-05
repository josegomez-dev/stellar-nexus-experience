import { accountService } from './account-service';

export class DemoIntegration {
  private static instance: DemoIntegration;
  
  public static getInstance(): DemoIntegration {
    if (!DemoIntegration.instance) {
      DemoIntegration.instance = new DemoIntegration();
    }
    return DemoIntegration.instance;
  }

  // Start a demo for a user
  async startDemo(userId: string, demoId: string): Promise<void> {
    try {
      await accountService.startDemo(userId, demoId);
      console.log(`✅ Demo ${demoId} started for user ${userId}`);
    } catch (error) {
      console.error(`❌ Error starting demo ${demoId}:`, error);
      throw error;
    }
  }

  // Complete a demo with score
  async completeDemo(userId: string, demoId: string, score: number): Promise<void> {
    try {
      await accountService.completeDemo(userId, demoId, score);
      console.log(`✅ Demo ${demoId} completed with score ${score} for user ${userId}`);
    } catch (error) {
      console.error(`❌ Error completing demo ${demoId}:`, error);
      throw error;
    }
  }

  // Calculate demo score based on completion time and accuracy
  calculateScore(completionTime: number, maxTime: number, accuracy: number = 1): number {
    const timeScore = Math.max(0, (maxTime - completionTime) / maxTime);
    const finalScore = Math.round((timeScore * 0.7 + accuracy * 0.3) * 100);
    return Math.min(100, Math.max(0, finalScore));
  }

  // Get demo configuration
  getDemoConfig(demoId: string) {
    const configs = {
      demo1: {
        name: 'Baby Steps to Riches',
        maxTime: 60, // 1 minute
        basePoints: 100,
        badges: ['demo1-completion', 'demo1-expert', 'demo1-perfect'],
      },
      demo2: {
        name: 'Milestone Voting',
        maxTime: 400, // 6.7 minutes
        basePoints: 150,
        badges: ['demo2-completion', 'demo2-expert', 'demo2-perfect'],
      },
      demo3: {
        name: 'Dispute Resolution',
        maxTime: 500, // 8.3 minutes
        basePoints: 200,
        badges: ['demo3-completion', 'demo3-expert', 'demo3-perfect'],
      },
      demo4: {
        name: 'Micro Task Marketplace',
        maxTime: 600, // 10 minutes
        basePoints: 250,
        badges: ['demo4-completion', 'demo4-expert', 'demo4-perfect'],
      },
    };
    
    return configs[demoId as keyof typeof configs] || configs.demo1;
  }
}

// Export singleton instance
export const demoIntegration = DemoIntegration.getInstance();


