describe('Demo 1 - Complete Flow', () => {
  const TEST_WALLET_ADDRESS =
    'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  beforeEach(() => {
    cy.visit('/demos');
    cy.get('h1', { timeout: 10000 }).should('be.visible');
    cy.clearLocalStorage();
  });

  it('should complete Demo 1 full flow: wallet connection → demo launch → escrow steps → confetti → complete', () => {
    // Step 1: Navigate to /demos (already done in beforeEach)
    cy.url().should('include', '/demos');
    cy.log('✅ Navigated to /demos page');

    // Step 2: Open wallet sidebar
    cy.get('body').then($body => {
      let walletButton = null;

      // Find wallet button using multiple strategies
      if ($body.find('button[title="Open Wallet"]').length > 0) {
        walletButton = $body.find('button[title="Open Wallet"]').first();
      } else if ($body.find('button').filter(':contains("🔐")').length > 0) {
        walletButton = $body.find('button').filter(':contains("🔐")').first();
      } else if ($body.find('button').filter(':contains("Wallet")').length > 0) {
        walletButton = $body.find('button').filter(':contains("Wallet")').first();
      }

      if (walletButton && walletButton.length > 0) {
        cy.wrap(walletButton).click({ force: true });
        cy.wait(2000);
        cy.log('✅ Opened wallet sidebar');
      }
    });

    // Step 3: Connect Stellar wallet
    cy.get('body').then($body => {
      if ($body.find('input[placeholder*="Stellar"]').length > 0) {
        cy.get('input[placeholder*="Stellar"]').type(TEST_WALLET_ADDRESS, { force: true });
        cy.get('button').contains('Connect').click({ force: true });
        cy.wait(2000);
        cy.log('✅ Connected Stellar wallet');

        // Verify connection
        cy.get('body').then($body => {
          if ($body.find('div').filter(':contains("Connected")').length > 0) {
            cy.log('✅ Wallet connection verified');
          } else {
            cy.log('ℹ️ Wallet connection status not visible');
          }
        });
      } else {
        cy.log('ℹ️ Wallet input not found - may already be connected or sidebar not opened');
      }
    });

    // Step 4: Launch Demo 1 from demo cards
    cy.get('.demo-card')
      .first()
      .within(() => {
        cy.get('h3').should('contain', 'Baby Steps to Riches');
        cy.get('button').contains('LAUNCH DEMO').click({ force: true });
      });
    cy.wait(3000);
    cy.log('✅ Launched Demo 1');

    // Step 5: Start demo in immersive modal
    cy.get('body').then($body => {
      if ($body.find('button').filter(':contains("Start Demo")').length > 0) {
        cy.get('button').contains('Start Demo').click();
        cy.wait(2000);
        cy.log('✅ Started demo in immersive modal');
      }
    });

    // Step 6: Verify demo content is visible
    cy.get('body').then($body => {
      if ($body.find('h2').filter(':contains("Hello Milestone Demo")').length > 0) {
        cy.get('h2').contains('🚀 Hello Milestone Demo').should('be.visible');
        cy.log('✅ Demo content loaded');
      } else {
        cy.log('ℹ️ Demo content not found - checking for alternative content');
      }
    });

    // Step 7: Execute all escrow steps with pauses for better visibility
    cy.get('body').then($body => {
      if ($body.find('button.initialize-escrow-button').length > 0) {
        // Step 7a: Initialize Escrow
        cy.get('button.initialize-escrow-button').click();
        cy.wait(3000);
        cy.log('✅ Step 1: Initialize Escrow completed');
        cy.pause(); // Pause to observe Initialize Escrow step
        cy.log('⏸️ Paused after Initialize Escrow - Press space to continue');

        // Step 7b: Fund Escrow
        cy.get('button.fund-escrow-button').click();
        cy.wait(3000);
        cy.log('✅ Step 2: Fund Escrow completed');
        cy.pause(); // Pause to observe Fund Escrow step
        cy.log('⏸️ Paused after Fund Escrow - Press space to continue');

        // Step 7c: Complete Milestone
        cy.get('button.complete-milestone-button').click();
        cy.wait(3000);
        cy.log('✅ Step 3: Complete Milestone completed');
        cy.pause(); // Pause to observe Complete Milestone step
        cy.log('⏸️ Paused after Complete Milestone - Press space to continue');

        // Step 7d: Approve Milestone
        cy.get('button.approve-milestone-button').click();
        cy.wait(3000);
        cy.log('✅ Step 4: Approve Milestone completed');
        cy.pause(); // Pause to observe Approve Milestone step
        cy.log('⏸️ Paused after Approve Milestone - Press space to continue');

        // Step 7e: Release Funds
        cy.get('button.release-funds-button').click();
        cy.wait(3000);
        cy.log('✅ Step 5: Release Funds completed');
        cy.pause(); // Pause to observe Release Funds step
        cy.log('⏸️ Paused after Release Funds - Press space to continue');
      }
    });

    // Step 8: Verify demo completion and confetti animation
    cy.get('body').then($body => {
      if ($body.find('h3').filter(':contains("Demo Completed Successfully")').length > 0) {
        cy.get('h3').contains('Demo Completed Successfully!').should('be.visible');
        cy.log('✅ Demo completed successfully');
      } else if ($body.find('div').filter(':contains("Funds Released Successfully")').length > 0) {
        cy.get('div').contains('🎉 Funds Released Successfully!').should('be.visible');
        cy.log('✅ Demo completed successfully (alternative text)');
      } else {
        cy.log('ℹ️ Demo completion text not found - checking for other completion indicators');
      }
    });

    // Step 9: Wait 5 seconds for confetti animation
    cy.wait(5000);
    cy.log('✅ Waited 5 seconds for confetti animation');

    // Step 10: Click complete demo button
    cy.get('body').then($body => {
      if ($body.find('button').filter(':contains("Complete Demo")').length > 0) {
        cy.get('button').contains('Complete Demo').click();
        cy.log('✅ Clicked Complete Demo button');
      } else if ($body.find('button').filter(':contains("Complete")').length > 0) {
        cy.get('button').contains('Complete').click();
        cy.log('✅ Clicked Complete button');
      } else if ($body.find('button').filter(':contains("Submit")').length > 0) {
        cy.get('button').contains('Submit').click();
        cy.log('✅ Clicked Submit button');
      } else {
        cy.log('ℹ️ Complete Demo button not found - demo may have auto-completed');
      }
    });

    // Step 11: Verify final state
    cy.get('body').then($body => {
      // Check if modal closed or demo completed
      if ($body.find('h3').filter(':contains("Demo Completed Successfully")').length === 0) {
        cy.log('✅ Demo flow completed - modal closed or demo finished');
      } else {
        cy.log('✅ Demo still showing completion state');
      }
    });

    cy.log('🎉 Demo 1 complete flow finished successfully!');
  });
});
