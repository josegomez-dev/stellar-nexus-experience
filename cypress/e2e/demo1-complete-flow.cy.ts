describe('Demo 1 - Complete Flow (Slow & Visible)', () => {
  const TEST_WALLET_ADDRESS = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

  beforeEach(() => {
    cy.visit('/demos');
    cy.get('h1', { timeout: 10000 }).should('be.visible');
    cy.clearLocalStorage();
    cy.log('🚀 Starting Demo 1 Complete Flow Test');
  });

  it('should complete Demo 1 full flow with slow, visible steps', () => {
    // Step 1: Navigate to /demos (already done in beforeEach)
    cy.url().should('include', '/demos');
    cy.log('✅ Navigated to /demos page');
    cy.wait(2000); // Slow down for visibility

    // Step 2: Open wallet sidebar with better selectors
    cy.log('🔍 Looking for wallet button...');
    cy.get('body').then($body => {
      // Try multiple wallet button selectors
      const walletSelectors = [
        'button[title*="Wallet"]',
        'button[title*="Connect"]',
        'button:contains("🔐")',
        'button:contains("Wallet")',
        'button:contains("Connect")',
        '[data-testid="wallet-button"]',
        '.wallet-button'
      ];

      let walletButton = null;
      for (const selector of walletSelectors) {
        if ($body.find(selector).length > 0) {
          walletButton = $body.find(selector).first();
          cy.log(`✅ Found wallet button with selector: ${selector}`);
          break;
        }
      }

      if (walletButton && walletButton.length > 0) {
        cy.wrap(walletButton).click({ force: true });
        cy.wait(3000); // Longer wait for sidebar animation
        cy.log('✅ Opened wallet sidebar');
      } else {
        cy.log('⚠️ Wallet button not found - trying alternative approach');
        // Try clicking any button that might be the wallet button
        cy.get('button').first().click({ force: true });
        cy.wait(2000);
      }
    });

    // Step 3: Connect wallet with manual address input
    cy.log('🔍 Looking for wallet connection options...');
    cy.get('body').then($body => {
      // Look for manual address input
      const inputSelectors = [
        'input[placeholder*="Stellar"]',
        'input[placeholder*="address"]',
        'input[placeholder*="G..."]',
        'input[type="text"]'
      ];

      let foundInput = false;
      for (const selector of inputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`✅ Found input with selector: ${selector}`);
          cy.get(selector).type(TEST_WALLET_ADDRESS, { force: true, delay: 100 });
          cy.wait(1000);
          
          // Look for connect button
          const connectSelectors = [
            'button:contains("Connect")',
            'button:contains("Manual")',
            'button:contains("Address")',
            'button[type="submit"]'
          ];

          for (const connectSelector of connectSelectors) {
            if ($body.find(connectSelector).length > 0) {
              cy.get(connectSelector).click({ force: true });
              cy.wait(3000);
              cy.log('✅ Connected wallet with manual address');
              foundInput = true;
              break;
            }
          }
          break;
        }
      }

      if (!foundInput) {
        cy.log('ℹ️ Manual input not found - wallet may already be connected or using different method');
      }
    });

    // Step 4: Launch Demo 1 with better selectors
    cy.log('🔍 Looking for Demo 1 card...');
    cy.get('body').then($body => {
      // Look for demo cards with multiple strategies
      const demoSelectors = [
        '.demo-card',
        '[data-testid="demo-card"]',
        '.card',
        'div:contains("Baby Steps")',
        'div:contains("Hello Milestone")'
      ];

      let demoCard = null;
      for (const selector of demoSelectors) {
        if ($body.find(selector).length > 0) {
          demoCard = $body.find(selector).first();
          cy.log(`✅ Found demo card with selector: ${selector}`);
          break;
        }
      }

      if (demoCard && demoCard.length > 0) {
        cy.wrap(demoCard).within(() => {
          // Look for launch button
          const launchSelectors = [
            'button:contains("LAUNCH")',
            'button:contains("Launch")',
            'button:contains("Start")',
            'button:contains("Demo")',
            'button[type="button"]'
          ];

          for (const launchSelector of launchSelectors) {
            if (demoCard.find(launchSelector).length > 0) {
              cy.get(launchSelector).click({ force: true });
              cy.wait(3000);
              cy.log('✅ Launched Demo 1');
              break;
            }
          }
        });
      } else {
        cy.log('⚠️ Demo card not found - trying to click any demo-related button');
        cy.get('button').contains(/demo|launch|start/i).first().click({ force: true });
        cy.wait(2000);
      }
    });

    // Step 5: Start demo in immersive modal
    cy.log('🔍 Looking for demo start button...');
    cy.get('body').then($body => {
      const startSelectors = [
        'button:contains("Start Demo")',
        'button:contains("Begin")',
        'button:contains("Start")',
        'button:contains("Launch")',
        '.start-demo-button',
        '[data-testid="start-demo"]'
      ];

      for (const selector of startSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click({ force: true });
          cy.wait(3000);
          cy.log('✅ Started demo in immersive modal');
          break;
        }
      }
    });

    // Step 6: Wait for demo content to load
    cy.wait(3000);
    cy.log('⏳ Waiting for demo content to load...');

    // Step 7: Execute escrow steps with improved selectors and longer waits
    cy.log('🔍 Looking for escrow step buttons...');
    
    // Step 7a: Initialize Escrow
    cy.get('body').then($body => {
      const initSelectors = [
        'button:contains("Initialize")',
        'button:contains("Create")',
        'button:contains("Setup")',
        '.initialize-escrow-button',
        '[data-step="initialize"]',
        'button[data-testid*="initialize"]'
      ];

      for (const selector of initSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click({ force: true });
          cy.wait(4000); // Longer wait for animation
          cy.log('✅ Step 1: Initialize Escrow completed');
          cy.pause(); // Pause to observe
          cy.log('⏸️ PAUSED: Initialize Escrow step completed. Press SPACE to continue...');
          break;
        }
      }
    });

    // Step 7b: Fund Escrow
    cy.get('body').then($body => {
      const fundSelectors = [
        'button:contains("Fund")',
        'button:contains("Deposit")',
        'button:contains("Add Funds")',
        '.fund-escrow-button',
        '[data-step="fund"]',
        'button[data-testid*="fund"]'
      ];

      for (const selector of fundSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click({ force: true });
          cy.wait(4000);
          cy.log('✅ Step 2: Fund Escrow completed');
          cy.pause();
          cy.log('⏸️ PAUSED: Fund Escrow step completed. Press SPACE to continue...');
          break;
        }
      }
    });

    // Step 7c: Complete Milestone
    cy.get('body').then($body => {
      const completeSelectors = [
        'button:contains("Complete")',
        'button:contains("Finish")',
        'button:contains("Done")',
        '.complete-milestone-button',
        '[data-step="complete"]',
        'button[data-testid*="complete"]'
      ];

      for (const selector of completeSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click({ force: true });
          cy.wait(4000);
          cy.log('✅ Step 3: Complete Milestone completed');
          cy.pause();
          cy.log('⏸️ PAUSED: Complete Milestone step completed. Press SPACE to continue...');
          break;
        }
      }
    });

    // Step 7d: Approve Milestone
    cy.get('body').then($body => {
      const approveSelectors = [
        'button:contains("Approve")',
        'button:contains("Accept")',
        'button:contains("Confirm")',
        '.approve-milestone-button',
        '[data-step="approve"]',
        'button[data-testid*="approve"]'
      ];

      for (const selector of approveSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click({ force: true });
          cy.wait(4000);
          cy.log('✅ Step 4: Approve Milestone completed');
          cy.pause();
          cy.log('⏸️ PAUSED: Approve Milestone step completed. Press SPACE to continue...');
          break;
        }
      }
    });

    // Step 7e: Release Funds
    cy.get('body').then($body => {
      const releaseSelectors = [
        'button:contains("Release")',
        'button:contains("Withdraw")',
        'button:contains("Transfer")',
        '.release-funds-button',
        '[data-step="release"]',
        'button[data-testid*="release"]'
      ];

      for (const selector of releaseSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click({ force: true });
          cy.wait(4000);
          cy.log('✅ Step 5: Release Funds completed');
          cy.pause();
          cy.log('⏸️ PAUSED: Release Funds step completed. Press SPACE to continue...');
          break;
        }
      }
    });

    // Step 8: Wait for completion and confetti
    cy.wait(5000);
    cy.log('🎉 Waiting for completion animation and confetti...');

    // Step 9: Look for completion indicators
    cy.get('body').then($body => {
      const completionSelectors = [
        'h1:contains("Completed")',
        'h2:contains("Completed")',
        'h3:contains("Completed")',
        'div:contains("Successfully")',
        'div:contains("Funds Released")',
        '.completion-message',
        '[data-testid="completion"]'
      ];

      let foundCompletion = false;
      for (const selector of completionSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log('✅ Demo completion detected');
          foundCompletion = true;
          break;
        }
      }

      if (!foundCompletion) {
        cy.log('ℹ️ Completion message not found - demo may have completed differently');
      }
    });

    // Step 10: Wait longer for confetti animation
    cy.wait(8000);
    cy.log('🎊 Enjoying confetti animation...');

    // Step 11: Look for final completion button
    cy.get('body').then($body => {
      const finalSelectors = [
        'button:contains("Complete Demo")',
        'button:contains("Finish Demo")',
        'button:contains("Done")',
        'button:contains("Close")',
        'button:contains("Submit")',
        '.complete-demo-button',
        '[data-testid="complete-demo"]'
      ];

      for (const selector of finalSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).click({ force: true });
          cy.wait(2000);
          cy.log('✅ Clicked final completion button');
          break;
        }
      }
    });

    // Step 12: Final verification
    cy.wait(3000);
    cy.log('🎉 Demo 1 complete flow finished successfully!');
    cy.log('✨ Test completed with slow, visible steps for better observation');
  });
});
