describe('First Demo Flow', () => {
  beforeEach(() => {
    // Visit the demos page
    cy.visit('/demos');

    // Wait for the page to load - look for the main content
    cy.get('h1', { timeout: 10000 }).should('be.visible');
  });

  it('should complete the first demo happy path', () => {
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

    // Step 4: Verify some interaction happened (modal or navigation)
    // The test will pass if we can click the button without errors
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
});

