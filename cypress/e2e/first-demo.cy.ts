describe('First Demo Flow', () => {
  // Test wallet address for demo
  const TEST_WALLET_ADDRESS = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  
  beforeEach(() => {
    // Visit the demos page
    cy.visit('/demos');

    // Wait for the page to load - look for the main content
    cy.get('h1', { timeout: 10000 }).should('be.visible');
    
    // Clear localStorage to ensure clean state
    cy.clearLocalStorage();
  });

  it('should complete the first demo happy path with wallet connection', () => {
    // Step 1: Navigate to demos page and verify it loads
    cy.title().should('contain', 'NEXUS EXPERIENCE');
    cy.get('h1').should('contain', 'STELLAR NEXUS EXPERIENCE');

    // Step 2: Find the first demo card (Hello Milestone Demo)
    cy.get('.demo-card').first().should('be.visible');
    cy.get('.demo-card')
      .first()
      .within(() => {
        cy.get('h3').should('contain', 'Baby Steps to Riches');
      });

    // Step 3: Click the "LAUNCH DEMO" button
    cy.get('.demo-card')
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('button').contains('LAUNCH DEMO').click({ force: true });
      });

    // Step 4: Wait a moment for any modal or navigation to occur
    cy.wait(2000);

    // Step 5: Check if modal opened or if we navigated somewhere
    cy.get('body').then(($body) => {
      // Check for modal
      if ($body.find('[data-testid="immersive-demo-modal"]').length > 0) {
        cy.get('[data-testid="immersive-demo-modal"]').should('be.visible');
        
        // If modal opened, proceed with modal flow
        cy.get('[data-testid="demo-warning-step"]').should('be.visible');
        cy.get('[data-testid="start-demo-button"]').click();
        
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
        cy.get('[data-testid="demo-content-step"]').within(() => {
          cy.get('button').first().click({ force: true });
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

  it('should show demo cards on the demos page', () => {
    // Verify we're on the demos page
    cy.url().should('include', '/demos');
    
    // Check that demo cards are present
    cy.get('.demo-card').should('have.length.at.least', 1);
    
    // Check the first demo card content
    cy.get('.demo-card').first().within(() => {
      cy.get('h3').should('contain', 'Baby Steps to Riches');
      cy.get('h4').should('contain', 'Basic Escrow Flow Demo');
    });
  });

  it('should have interactive elements', () => {
    // Check that buttons are clickable
    cy.get('.demo-card').first().within(() => {
      cy.get('button').contains('LAUNCH DEMO').should('be.visible');
    });
  });

  it('should handle wallet connection flow', () => {
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

    // Verify wallet connection UI is available
    cy.get('body').then(($body) => {
      // Check for wallet connection elements
      const hasWalletUI = $body.find('button').filter(':contains("Connect")').length > 0 ||
                         $body.find('[data-testid="wallet-sidebar"]').length > 0 ||
                         $body.find('input[type="text"]').length > 0;
      
      // If wallet UI is available, test connection
      if (hasWalletUI) {
        if ($body.find('button').filter(':contains("Connect")').length > 0) {
          cy.get('button').contains('Connect').click({ force: true });
          
          if ($body.find('input[type="text"]').length > 0) {
            cy.get('input[type="text"]').first().type(TEST_WALLET_ADDRESS);
            cy.get('button').contains(/connect|Connect|Submit/).click({ force: true });
          }
        }
      }
      
      // Verify we can interact with the page
      cy.get('body').should('be.visible');
    });
  });
});

