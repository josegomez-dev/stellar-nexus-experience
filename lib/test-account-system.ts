// Test script for the account system
import { accountService } from './account-service';
import { demoIntegration } from './demo-integration';

export async function testAccountSystem() {
  console.log('🧪 Testing Account System...');
  
  try {
    // Test 1: Create account
    console.log('📝 Test 1: Creating account...');
    const testWalletAddress = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const account = await accountService.createAccount(testWalletAddress, testWalletAddress, 'testnet');
    console.log('✅ Account created:', account.id);
    
    // Test 2: Start demo
    console.log('🎮 Test 2: Starting demo...');
    await accountService.startDemo(account.id, 'demo1');
    console.log('✅ Demo started');
    
    // Test 3: Complete demo
    console.log('🏁 Test 3: Completing demo...');
    await accountService.completeDemo(account.id, 'demo1', 85);
    console.log('✅ Demo completed with score 85');
    
    // Test 4: Get updated account
    console.log('📊 Test 4: Getting updated account...');
    const updatedAccount = await accountService.getAccountById(account.id);
    console.log('✅ Account updated:', {
      totalPoints: updatedAccount?.profile.totalPoints,
      badges: updatedAccount?.badges.length,
      demosCompleted: updatedAccount?.stats.totalDemosCompleted,
    });
    
    // Test 5: Get points transactions
    console.log('💰 Test 5: Getting points transactions...');
    const transactions = await accountService.getPointsTransactions(account.id);
    console.log('✅ Points transactions:', transactions.length);
    
    console.log('🎉 All tests passed!');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Export for use in development
export default testAccountSystem;



