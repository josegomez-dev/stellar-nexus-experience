describe('First Demo Flow', () => {
  beforeEach(() => {
    // Visit the demos page
    cy.visit('/demos');

    // Wait for the page to load
    cy.get('[data-testid="demos-page"]', { timeout: 10000 }).should('be.visible');
  });

  it('should complete the first demo happy path', () => {
    // Step 1: Navigate to demos page and verify it loads
    cy.title().should('contain', 'Demos');
    cy.get('h1').should('contain', 'Trustless Work');

    // Step 2: Find the first demo card (Hello Milestone Demo)
    cy.get('[data-testid="demo-card"]').first().should('be.visible');
    cy.get('[data-testid="demo-card"]')
      .first()
      .within(() => {
        cy.get('h3').should('contain', 'Hello Milestone');
        cy.get('[data-testid="demo-status"]').should('not.contain', 'Coming Soon');
      });

    // Step 3: Click the "Start Immersive Demo" button
    cy.get('[data-testid="demo-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="start-demo-button"]').click();
      });

    // Step 4: Verify the immersive demo modal opens
    cy.get('[data-testid="immersive-demo-modal"]').should('be.visible');
    cy.get('[data-testid="demo-warning-step"]').should('be.visible');

    // Step 5: Read and acknowledge the warning
    cy.get('[data-testid="demo-warning-step"]').within(() => {
      cy.get('h2').should('contain', 'Demo Warning');
      cy.get('[data-testid="estimated-time"]').should('be.visible');
      cy.get('[data-testid="attention-required"]').should('be.visible');
      cy.get('[data-testid="wallet-connection-check"]').should('be.visible');
    });

    // Step 6: Click "Start Demo" to proceed
    cy.get('[data-testid="start-demo-button"]').click();

    // Step 7: Verify the demo content is displayed
    cy.get('[data-testid="demo-content-step"]').should('be.visible');
    cy.get('[data-testid="demo-content-step"]').within(() => {
      cy.get('[data-testid="wallet-sidebar-info"]').should('be.visible');
      cy.get('[data-testid="demo-timer"]').should('be.visible');
      cy.get('[data-testid="demo-progress"]').should('be.visible');
    });

    // Step 8: Interact with the demo (simulate some actions)
    cy.get('[data-testid="demo-content-step"]').within(() => {
      // Look for interactive elements in the demo
      cy.get('button').first().click();
      cy.wait(1000); // Wait for any animations
    });

    // Step 9: Complete the demo and proceed to feedback
    cy.get('[data-testid="complete-demo-button"]').click();

    // Step 10: Verify feedback step is shown
    cy.get('[data-testid="demo-feedback-step"]').should('be.visible');
    cy.get('[data-testid="demo-feedback-step"]').within(() => {
      cy.get('h2').should('contain', 'Demo Feedback');
      cy.get('[data-testid="rating-stars"]').should('be.visible');
      cy.get('[data-testid="difficulty-select"]').should('be.visible');
      cy.get('[data-testid="recommendation-select"]').should('be.visible');
      cy.get('[data-testid="feedback-textarea"]').should('be.visible');
    });

    // Step 11: Fill out the feedback form
    cy.get('[data-testid="demo-feedback-step"]').within(() => {
      // Rate the demo (5 stars)
      cy.get('[data-testid="rating-stars"]').find('button').last().click();

      // Select difficulty
      cy.get('[data-testid="difficulty-select"]').select('Easy');

      // Select recommendation
      cy.get('[data-testid="recommendation-select"]').select('Yes');

      // Add feedback comment
      cy.get('[data-testid="feedback-textarea"]').type(
        'This demo was excellent and very informative!'
      );
    });

    // Step 12: Submit feedback
    cy.get('[data-testid="submit-feedback-button"]').click();

    // Step 13: Verify success message and modal closes
    cy.get('[data-testid="feedback-success"]').should('be.visible');
    cy.get('[data-testid="immersive-demo-modal"]').should('not.exist');

    // Step 14: Verify demo completion is recorded
    cy.get('[data-testid="demo-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="demo-completion-status"]').should('contain', 'Completed');
      });
  });

  it('should handle demo interruption gracefully', () => {
    // Start the demo
    cy.get('[data-testid="demo-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="start-demo-button"]').click();
      });

    // Verify modal opens
    cy.get('[data-testid="immersive-demo-modal"]').should('be.visible');

    // Try to close the modal
    cy.get('[data-testid="close-modal-button"]').click();

    // Verify modal closes
    cy.get('[data-testid="immersive-demo-modal"]').should('not.exist');

    // Verify we're back on the demos page
    cy.get('[data-testid="demos-page"]').should('be.visible');
  });

  it('should show wallet connection warning when not connected', () => {
    // Start the demo
    cy.get('[data-testid="demo-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="start-demo-button"]').click();
      });

    // Proceed to demo content
    cy.get('[data-testid="start-demo-button"]').click();

    // Verify wallet connection warning is shown
    cy.get('[data-testid="wallet-connection-warning"]').should('be.visible');
    cy.get('[data-testid="wallet-connection-warning"]').within(() => {
      cy.get('p').should('contain', 'wallet');
      cy.get('p').should('contain', 'connect');
    });
  });

  it('should track demo progress correctly', () => {
    // Start the demo
    cy.get('[data-testid="demo-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="start-demo-button"]').click();
      });

    // Proceed to demo content
    cy.get('[data-testid="start-demo-button"]').click();

    // Verify progress bar is visible and updates
    cy.get('[data-testid="demo-progress"]').should('be.visible');
    cy.get('[data-testid="demo-progress"]').within(() => {
      cy.get('.progress-bar').should('have.attr', 'style').and('contain', 'width');
    });

    // Verify timer is running
    cy.get('[data-testid="demo-timer"]').should('be.visible');
    cy.get('[data-testid="demo-timer"]').should('not.contain', '00:00');
  });
});

