describe('Demo 1 - Simple Flow (Slow & Visible)', () => {
  const TEST_WALLET_ADDRESS = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  beforeEach(() => {
    cy.visit('/demos');
    cy.get('h1', { timeout: 10000 }).should('be.visible');
    cy.clearLocalStorage();
    cy.log('🚀 Starting Demo 1 Simple Flow Test');
  });

  it('should complete Demo 1 with slow, visible steps using custom commands', () => {
    // Step 1: Navigate to demos page
    cy.url().should('include', '/demos');
    cy.log('✅ Navigated to /demos page');
    cy.slowDown(2000);

    // Step 2: Open wallet sidebar
    cy.log('🔍 Looking for wallet button...');
    cy.findElement([
      'button[title*="Wallet"]',
      'button[title*="Connect"]',
      'button:contains("🔐")',
      'button:contains("Wallet")',
      'button:contains("Connect")'
    ]).then($el => {
      if ($el.is(':visible')) {
        cy.wrap($el).click({ force: true });
        cy.waitForAnimation(3000);
        cy.log('✅ Opened wallet sidebar');
      } else {
        cy.log('⚠️ Wallet button not visible, trying alternative approach');
        cy.get('button').first().click({ force: true });
        cy.waitForAnimation(2000);
      }
    });

    // Step 3: Connect wallet with manual address
    cy.log('🔍 Looking for wallet connection options...');
    cy.findElement([
      'input[placeholder*="Stellar"]',
      'input[placeholder*="address"]',
      'input[placeholder*="G..."]',
      'input[type="text"]'
    ]).humanType(TEST_WALLET_ADDRESS);
    cy.slowDown(1000);

    // Find and click connect button
    cy.findElement([
      'button:contains("Connect")',
      'button:contains("Manual")',
      'button:contains("Address")'
    ]).click({ force: true });
    cy.waitForAnimation(3000);
    cy.log('✅ Connected wallet with manual address');

    // Step 4: Launch Demo 1
    cy.log('🔍 Looking for Demo 1 card...');
    cy.findElement([
      '.demo-card',
      '[data-testid="demo-card"]',
      '.card',
      'div:contains("Baby Steps")',
      'div:contains("Hello Milestone")'
    ]).within(() => {
      cy.findElement([
        'button:contains("LAUNCH")',
        'button:contains("Launch")',
        'button:contains("Start")',
        'button:contains("Demo")'
      ]).click({ force: true });
    });
    cy.waitForAnimation(3000);
    cy.log('✅ Launched Demo 1');

    // Step 5: Start demo in immersive modal
    cy.log('🔍 Looking for demo start button...');
    cy.findElement([
      'button:contains("Start Demo")',
      'button:contains("Begin")',
      'button:contains("Start")',
      'button:contains("Launch")'
    ]).click({ force: true });
    cy.waitForAnimation(3000);
    cy.log('✅ Started demo in immersive modal');

    // Step 6: Wait for demo content to load
    cy.waitForAnimation(3000);
    cy.log('⏳ Waiting for demo content to load...');

    // Step 7: Execute escrow steps with pauses
    cy.log('🔍 Starting escrow flow...');

    // Step 7a: Initialize Escrow
    cy.findElement([
      'button:contains("Initialize")',
      'button:contains("Create")',
      'button:contains("Setup")',
      '.initialize-escrow-button'
    ]).click({ force: true });
    cy.waitForAnimation(4000);
    cy.pauseAndLog('Initialize Escrow step completed. Press SPACE to continue...');

    // Step 7b: Fund Escrow
    cy.findElement([
      'button:contains("Fund")',
      'button:contains("Deposit")',
      'button:contains("Add Funds")',
      '.fund-escrow-button'
    ]).click({ force: true });
    cy.waitForAnimation(4000);
    cy.pauseAndLog('Fund Escrow step completed. Press SPACE to continue...');

    // Step 7c: Complete Milestone
    cy.findElement([
      'button:contains("Complete")',
      'button:contains("Finish")',
      'button:contains("Done")',
      '.complete-milestone-button'
    ]).click({ force: true });
    cy.waitForAnimation(4000);
    cy.pauseAndLog('Complete Milestone step completed. Press SPACE to continue...');

    // Step 7d: Approve Milestone
    cy.findElement([
      'button:contains("Approve")',
      'button:contains("Accept")',
      'button:contains("Confirm")',
      '.approve-milestone-button'
    ]).click({ force: true });
    cy.waitForAnimation(4000);
    cy.pauseAndLog('Approve Milestone step completed. Press SPACE to continue...');

    // Step 7e: Release Funds
    cy.findElement([
      'button:contains("Release")',
      'button:contains("Withdraw")',
      'button:contains("Transfer")',
      '.release-funds-button'
    ]).click({ force: true });
    cy.waitForAnimation(4000);
    cy.pauseAndLog('Release Funds step completed. Press SPACE to continue...');

    // Step 8: Wait for completion and confetti
    cy.waitForAnimation(5000);
    cy.log('🎉 Waiting for completion animation and confetti...');

    // Step 9: Look for completion indicators
    cy.findElement([
      'h1:contains("Completed")',
      'h2:contains("Completed")',
      'h3:contains("Completed")',
      'div:contains("Successfully")',
      'div:contains("Funds Released")'
    ]).then(() => {
      cy.log('✅ Demo completion detected');
    });

    // Step 10: Wait longer for confetti animation
    cy.waitForAnimation(8000);
    cy.log('🎊 Enjoying confetti animation...');

    // Step 11: Look for final completion button
    cy.findElement([
      'button:contains("Complete Demo")',
      'button:contains("Finish Demo")',
      'button:contains("Done")',
      'button:contains("Close")',
      'button:contains("Submit")'
    ]).click({ force: true });
    cy.waitForAnimation(2000);
    cy.log('✅ Clicked final completion button');

    // Step 12: Final verification
    cy.waitForAnimation(3000);
    cy.log('🎉 Demo 1 complete flow finished successfully!');
    cy.log('✨ Test completed with slow, visible steps for better observation');
  });
});
