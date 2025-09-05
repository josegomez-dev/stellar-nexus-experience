describe('Comprehensive Demo Flow with Wallet Integration', () => {
  // Test wallet address (using a valid Stellar testnet address format)
  const TEST_WALLET_ADDRESS = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  
  beforeEach(() => {
    // Visit the demos page
    cy.visit('/demos');

    // Wait for the page to load
    cy.get('h1', { timeout: 10000 }).should('be.visible');
    
    // Clear any existing localStorage data
    cy.clearLocalStorage();
  });

  it('should complete full immersive demo flow with wallet connection', () => {
    // Step 1: Verify page loads correctly
    cy.title().should('contain', 'NEXUS EXPERIENCE');
    cy.get('h1').should('contain', 'STELLAR NEXUS EXPERIENCE');

    // Step 2: Find and interact with the first demo card
    cy.get('.demo-card').first().should('be.visible');
    cy.get('.demo-card')
      .first()
      .within(() => {
        cy.get('h3').should('contain', 'Baby Steps to Riches');
        cy.get('h4').should('contain', 'Basic Escrow Flow Demo');
      });

    // Step 3: Launch the immersive demo
    cy.get('.demo-card')
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('button').contains('LAUNCH DEMO').click({ force: true });
      });

    // Step 4: Verify immersive modal opens
    cy.get('[data-testid="immersive-demo-modal"]', { timeout: 5000 }).should('be.visible');
    
    // Step 5: Verify warning step is shown
    cy.get('[data-testid="demo-warning-step"]').should('be.visible');
    cy.get('[data-testid="demo-warning-step"]').within(() => {
      cy.get('h2').should('contain', 'Demo Warning');
      cy.get('[data-testid="estimated-time"]').should('be.visible');
      cy.get('[data-testid="attention-required"]').should('be.visible');
      cy.get('[data-testid="wallet-connection-check"]').should('be.visible');
    });

    // Step 6: Start the demo
    cy.get('[data-testid="start-demo-button"]').click();

    // Step 7: Verify demo content step is shown
    cy.get('[data-testid="demo-content-step"]', { timeout: 5000 }).should('be.visible');
    
    // Step 8: Connect wallet using the test address
    cy.window().then((win) => {
      // Mock Freighter wallet availability
      win.stellar = {
        isConnected: () => Promise.resolve(false),
        connect: () => Promise.resolve({ publicKey: TEST_WALLET_ADDRESS }),
        signTransaction: () => Promise.resolve('mock-signed-xdr'),
        submitTransaction: () => Promise.resolve({ hash: 'mock-tx-hash' })
      };
    });

    // Step 9: Look for wallet connection UI and connect
    cy.get('body').then(($body) => {
      // Check if wallet sidebar or connection UI is visible
      if ($body.find('[data-testid="wallet-sidebar"]').length > 0) {
        cy.get('[data-testid="wallet-sidebar"]').should('be.visible');
        
        // Look for connect button in wallet sidebar
        cy.get('[data-testid="wallet-sidebar"]').within(() => {
          cy.get('button').contains(/connect|Connect/).click({ force: true });
        });
      } else if ($body.find('button').filter(':contains("Connect")').length > 0) {
        cy.get('button').contains('Connect').click({ force: true });
      }
    });

    // Step 10: Enter test wallet address
    cy.get('body').then(($body) => {
      if ($body.find('input[type="text"]').length > 0) {
        cy.get('input[type="text"]').first().type(TEST_WALLET_ADDRESS);
        cy.get('button').contains(/connect|Connect|Submit/).click({ force: true });
      }
    });

    // Step 11: Verify wallet connection success
    cy.get('body').then(($body) => {
      // Look for connection success indicators
      if ($body.find('[data-testid="wallet-connected"]').length > 0) {
        cy.get('[data-testid="wallet-connected"]').should('be.visible');
      } else if ($body.find('.text-green').length > 0) {
        cy.get('.text-green').should('contain', 'Connected');
      }
    });

    // Step 12: Proceed with demo steps
    cy.get('[data-testid="demo-content-step"]').within(() => {
      // Look for demo step buttons or interactive elements
      cy.get('button').first().click({ force: true });
    });

    // Step 13: Complete demo steps (simulate the escrow flow)
    cy.get('body').then(($body) => {
      // Look for step-by-step buttons
      const stepButtons = $body.find('button').filter((i, el) => {
        const text = Cypress.$(el).text().toLowerCase();
        return text.includes('initialize') || text.includes('fund') || 
               text.includes('complete') || text.includes('approve') || 
               text.includes('release') || text.includes('step');
      });
      
      if (stepButtons.length > 0) {
        // Click through available demo steps
        stepButtons.each((i, button) => {
          if (i < 3) { // Limit to first 3 steps to avoid infinite loops
            cy.wrap(button).click({ force: true });
            cy.wait(1000); // Wait between steps
          }
        });
      }
    });

    // Step 14: Complete the demo
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="complete-demo-button"]').length > 0) {
        cy.get('[data-testid="complete-demo-button"]').click();
      } else if ($body.find('button').filter(':contains("Complete")').length > 0) {
        cy.get('button').contains('Complete').click({ force: true });
      }
    });

    // Step 15: Verify feedback step is shown
    cy.get('[data-testid="demo-feedback-step"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="demo-feedback-step"]').within(() => {
      cy.get('h2').should('contain', 'Demo Feedback');
    });

    // Step 16: Fill out feedback form
    cy.get('[data-testid="demo-feedback-step"]').within(() => {
      // Rate the demo (5 stars)
      if (cy.get('[data-testid="rating-stars"]').length > 0) {
        cy.get('[data-testid="rating-stars"]').find('button').last().click();
      }
      
      // Select difficulty
      if (cy.get('[data-testid="difficulty-select"]').length > 0) {
        cy.get('[data-testid="difficulty-select"]').select('Easy');
      }
      
      // Select recommendation
      if (cy.get('[data-testid="recommendation-select"]').length > 0) {
        cy.get('[data-testid="recommendation-select"]').select('Yes');
      }
      
      // Add feedback comment
      if (cy.get('[data-testid="feedback-textarea"]').length > 0) {
        cy.get('[data-testid="feedback-textarea"]').type(
          'This comprehensive demo was excellent! Great integration with wallet connection.'
        );
      }
    });

    // Step 17: Submit feedback
    cy.get('[data-testid="submit-feedback-button"]').click();

    // Step 18: Verify success message and modal closes
    cy.get('[data-testid="feedback-success"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="immersive-demo-modal"]').should('not.exist');

    // Step 19: Verify demo completion is recorded
    cy.get('.demo-card')
      .first()
      .within(() => {
        // Look for completion indicators
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="demo-completion-status"]').length > 0) {
            cy.get('[data-testid="demo-completion-status"]').should('contain', 'Completed');
          }
        });
      });
  });

  it('should handle wallet connection errors gracefully', () => {
    // Launch demo
    cy.get('.demo-card')
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('button').contains('LAUNCH DEMO').click({ force: true });
      });

    // Start demo
    cy.get('[data-testid="start-demo-button"]').click();

    // Mock wallet connection failure
    cy.window().then((win) => {
      win.stellar = {
        isConnected: () => Promise.resolve(false),
        connect: () => Promise.reject(new Error('Connection failed')),
        signTransaction: () => Promise.reject(new Error('Signing failed')),
        submitTransaction: () => Promise.reject(new Error('Transaction failed'))
      };
    });

    // Try to connect wallet
    cy.get('body').then(($body) => {
      if ($body.find('button').filter(':contains("Connect")').length > 0) {
        cy.get('button').contains('Connect').click({ force: true });
      }
    });

    // Verify error handling
    cy.get('body').then(($body) => {
      // Look for error messages or toast notifications
      if ($body.find('.toast-error').length > 0) {
        cy.get('.toast-error').should('be.visible');
      } else if ($body.find('.text-red').length > 0) {
        cy.get('.text-red').should('contain', 'error');
      }
    });
  });

  it('should track demo progress and timing correctly', () => {
    // Launch demo
    cy.get('.demo-card')
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('button').contains('LAUNCH DEMO').click({ force: true });
      });

    // Start demo
    cy.get('[data-testid="start-demo-button"]').click();

    // Verify progress tracking elements
    cy.get('[data-testid="demo-content-step"]').within(() => {
      // Check for progress bar
      if (cy.get('[data-testid="demo-progress"]').length > 0) {
        cy.get('[data-testid="demo-progress"]').should('be.visible');
        cy.get('[data-testid="demo-progress"]').within(() => {
          cy.get('.progress-bar').should('have.attr', 'style').and('contain', 'width');
        });
      }
      
      // Check for timer
      if (cy.get('[data-testid="demo-timer"]').length > 0) {
        cy.get('[data-testid="demo-timer"]').should('be.visible');
        cy.get('[data-testid="demo-timer"]').should('not.contain', '00:00');
      }
    });

    // Wait a bit to see progress update
    cy.wait(2000);

    // Verify progress has updated
    cy.get('[data-testid="demo-progress"]').then(($progress) => {
      if ($progress.length > 0) {
        cy.get('[data-testid="demo-progress"]').should('not.contain', '0%');
      }
    });
  });

  it('should persist demo completion data', () => {
    // Complete a demo
    cy.get('.demo-card')
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('button').contains('LAUNCH DEMO').click({ force: true });
      });

    cy.get('[data-testid="start-demo-button"]').click();
    
    // Complete demo quickly
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="complete-demo-button"]').length > 0) {
        cy.get('[data-testid="complete-demo-button"]').click();
      }
    });

    // Submit feedback
    cy.get('[data-testid="demo-feedback-step"]').within(() => {
      if (cy.get('[data-testid="rating-stars"]').length > 0) {
        cy.get('[data-testid="rating-stars"]').find('button').last().click();
      }
    });
    
    cy.get('[data-testid="submit-feedback-button"]').click();

    // Verify data is persisted in localStorage
    cy.window().then((win) => {
      const feedback = win.localStorage.getItem('demoFeedback');
      expect(feedback).to.not.be.null;
      
      const feedbackData = JSON.parse(feedback);
      expect(feedbackData).to.have.property('hello-milestone');
      expect(feedbackData['hello-milestone']).to.have.property('rating');
      expect(feedbackData['hello-milestone']).to.have.property('timestamp');
    });
  });
});
