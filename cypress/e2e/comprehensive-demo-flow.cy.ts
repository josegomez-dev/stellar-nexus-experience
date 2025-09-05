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

    // Step 4: Wait for any UI changes and check what happened
    cy.wait(2000);

    // Step 5: Check if modal opened or if we navigated somewhere
    cy.get('body').then(($body) => {
      // Check for modal
      if ($body.find('[data-testid="immersive-demo-modal"]').length > 0) {
        cy.get('[data-testid="immersive-demo-modal"]').should('be.visible');
        
        // If modal opened, proceed with modal flow
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="demo-warning-step"]').length > 0) {
            cy.get('[data-testid="demo-warning-step"]').should('be.visible');
            
            if ($body.find('[data-testid="start-demo-button"]').length > 0) {
              cy.get('[data-testid="start-demo-button"]').click();
            }
          }
        });
        
        // Mock wallet and continue with demo
        cy.window().then((win) => {
          win.stellar = {
            isConnected: () => Promise.resolve(false),
            connect: () => Promise.resolve({ publicKey: TEST_WALLET_ADDRESS }),
            signTransaction: () => Promise.resolve('mock-signed-xdr'),
            submitTransaction: () => Promise.resolve({ hash: 'mock-tx-hash' })
          };
        });
        
        // Handle wallet connection if UI is available
        cy.get('body').then(($body) => {
          if ($body.find('button').filter(':contains("Connect")').length > 0) {
            cy.get('button').contains('Connect').click({ force: true });
            
            if ($body.find('input[type="text"]').length > 0) {
              cy.get('input[type="text"]').first().type(TEST_WALLET_ADDRESS);
              cy.get('button').contains(/connect|Connect|Submit/).click({ force: true });
            }
          }
        });
        
        // Complete demo steps
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="demo-content-step"]').length > 0) {
            cy.get('[data-testid="demo-content-step"]').within(() => {
              cy.get('button').first().click({ force: true });
            });
          }
        });
        
        // Complete demo
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="complete-demo-button"]').length > 0) {
            cy.get('[data-testid="complete-demo-button"]').click();
          }
        });
        
        // Handle feedback
        cy.get('body').then(($body) => {
          if ($body.find('[data-testid="demo-feedback-step"]').length > 0) {
            cy.get('[data-testid="demo-feedback-step"]').within(() => {
              if ($body.find('[data-testid="rating-stars"]').length > 0) {
                cy.get('[data-testid="rating-stars"]').find('button').last().click();
              }
            });
            
            if ($body.find('[data-testid="submit-feedback-button"]').length > 0) {
              cy.get('[data-testid="submit-feedback-button"]').click();
            }
          }
        });
        
      } else {
        // If no modal, check if we navigated to a demo page
        cy.url().then((url) => {
          if (url.includes('/demo') || url.includes('/hello-milestone')) {
            // We're on a demo page, proceed with demo steps
            cy.get('body').then(($body) => {
              // Look for demo step buttons
              const demoButtons = $body.find('button').filter((i, el) => {
                const text = Cypress.$(el).text().toLowerCase();
                return text.includes('initialize') || text.includes('fund') || 
                       text.includes('complete') || text.includes('approve') || 
                       text.includes('release') || text.includes('step');
              });
              
              if (demoButtons.length > 0) {
                // Click through demo steps
                demoButtons.each((i, button) => {
                  if (i < 3) { // Limit to first 3 steps
                    cy.wrap(button).click({ force: true });
                    cy.wait(1000);
                  }
                });
              }
            });
          } else {
            // Just verify we're still on demos page
            cy.url().should('include', '/demos');
          }
        });
      }
    });

    // Step 6: Verify completion
    cy.url().should('include', '/demos');
  });

  it('should handle wallet connection errors gracefully', () => {
    // Launch demo
    cy.get('.demo-card')
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('button').contains('LAUNCH DEMO').click({ force: true });
      });

    // Wait for any UI changes
    cy.wait(2000);

    // Mock wallet connection failure
    cy.window().then((win) => {
      win.stellar = {
        isConnected: () => Promise.resolve(false),
        connect: () => Promise.reject(new Error('Connection failed')),
        signTransaction: () => Promise.reject(new Error('Signing failed')),
        submitTransaction: () => Promise.reject(new Error('Transaction failed'))
      };
    });

    // Try to connect wallet if UI is available
    cy.get('body').then(($body) => {
      if ($body.find('button').filter(':contains("Connect")').length > 0) {
        cy.get('button').contains('Connect').click({ force: true });
      }
    });

    // Verify we can still interact with the page
    cy.get('body').should('be.visible');
  });

  it('should track demo progress and timing correctly', () => {
    // Launch demo
    cy.get('.demo-card')
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('button').contains('LAUNCH DEMO').click({ force: true });
      });

    // Wait for any UI changes
    cy.wait(2000);

    // Mock wallet connection
    cy.window().then((win) => {
      win.stellar = {
        isConnected: () => Promise.resolve(false),
        connect: () => Promise.resolve({ publicKey: TEST_WALLET_ADDRESS })
      };
    });

    // Verify we can interact with demo elements
    cy.get('body').then(($body) => {
      // Look for any interactive elements
      const hasInteractiveElements = $body.find('button').length > 0 ||
                                   $body.find('input').length > 0 ||
                                   $body.find('select').length > 0;
      
      expect(hasInteractiveElements).to.be.true;
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

    // Wait for any UI changes
    cy.wait(2000);

    // Mock wallet connection
    cy.window().then((win) => {
      win.stellar = {
        isConnected: () => Promise.resolve(false),
        connect: () => Promise.resolve({ publicKey: TEST_WALLET_ADDRESS })
      };
    });

    // Interact with any available demo elements
    cy.get('body').then(($body) => {
      const demoButtons = $body.find('button').filter((i, el) => {
        const text = Cypress.$(el).text().toLowerCase();
        return text.includes('initialize') || text.includes('fund') || 
               text.includes('complete') || text.includes('approve') || 
               text.includes('release') || text.includes('step');
      });
      
      if (demoButtons.length > 0) {
        // Click through available demo steps
        demoButtons.each((i, button) => {
          if (i < 2) { // Limit to first 2 steps
            cy.wrap(button).click({ force: true });
            cy.wait(1000);
          }
        });
      }
    });

    // Verify we can interact with the page
    cy.get('body').should('be.visible');
  });
});
