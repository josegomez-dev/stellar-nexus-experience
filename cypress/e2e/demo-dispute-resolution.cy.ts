describe('Dispute Resolution Demo - Drama Queen Escrow', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1280, 720);
  });

  it('should load the demo and display correct title', () => {
    // Wait for the page to load
    cy.contains('STELLAR NEXUS EXPERIENCE', { timeout: 10000 }).should('be.visible');

    // Check for the demo card
    cy.contains('Drama Queen Escrow').should('be.visible');
    cy.contains('Dispute Resolution & Arbitration').should('be.visible');

    // Verify demo description
    cy.contains('Arbitration drama - who will win the trust battle?').should('be.visible');
  });

  it('should require wallet connection to launch demo', () => {
    // Click on the demo card
    cy.contains('Drama Queen Escrow')
      .parent()
      .within(() => {
        cy.contains('CONNECT WALLET').should('be.visible');
        cy.contains('Required to launch demo').should('be.visible');
      });
  });

  it('should show wallet connection modal when connect button is clicked', () => {
    // Click connect wallet button on dispute resolution demo
    cy.contains('Drama Queen Escrow')
      .parent()
      .within(() => {
        cy.contains('CONNECT WALLET').click();
      });

    // Check if wallet connection modal appears
    cy.get('[data-testid="wallet-modal"]', { timeout: 5000 }).should('be.visible');
  });

  it('should display demo interface after wallet connection simulation', () => {
    // Simulate wallet connection by visiting demo directly
    cy.visit('/?demo=dispute-resolution&wallet=connected');

    // Wait for demo interface to load
    cy.contains('Drama Queen Escrow', { timeout: 10000 }).should('be.visible');
    cy.contains('Dispute Resolution', { timeout: 10000 }).should('be.visible');
  });

  it('should show milestone management interface', () => {
    // Simulate connected state
    cy.visit('/?demo=dispute-resolution&wallet=connected');

    // Look for milestone management elements
    cy.contains('Milestone Management', { timeout: 10000 }).should('be.visible');
    cy.contains('Release Milestone', { timeout: 5000 }).should('be.visible');
  });

  it('should handle milestone release workflow', () => {
    // Simulate connected state
    cy.visit('/?demo=dispute-resolution&wallet=connected');

    // Click release milestone button
    cy.contains('Release Milestone', { timeout: 10000 }).first().click();

    // Check for milestone release confirmation
    cy.contains('Milestone Released', { timeout: 10000 }).should('be.visible');
  });

  it('should display dispute resolution workflow', () => {
    // Simulate connected state with dispute
    cy.visit('/?demo=dispute-resolution&wallet=connected&dispute=active');

    // Check for dispute-related elements
    cy.contains('Dispute Active', { timeout: 10000 }).should('be.visible');
    cy.contains('Arbitration', { timeout: 5000 }).should('be.visible');
  });

  it('should handle arbitration process', () => {
    // Simulate connected state with arbitration
    cy.visit('/?demo=dispute-resolution&wallet=connected&arbitration=true');

    // Look for arbitration controls
    cy.contains('Arbitrator Decision', { timeout: 10000 }).should('be.visible');
    cy.contains('Resolve Dispute', { timeout: 5000 }).should('be.visible');
  });

  it('should show completion status correctly', () => {
    // Simulate completed demo state
    cy.visit('/?demo=dispute-resolution&wallet=connected&completed=true');

    // Check for completion indicators
    cy.contains('Demo Completed', { timeout: 10000 }).should('be.visible');
    cy.contains('Trust Guardian', { timeout: 5000 }).should('be.visible');
  });

  it('should handle demo clapping functionality', () => {
    // Visit main page
    cy.visit('/');

    // Find the dispute resolution demo card and clap button
    cy.contains('Drama Queen Escrow')
      .parent()
      .within(() => {
        cy.get('[data-testid="clap-button"]').should('be.visible');
        cy.get('[data-testid="clap-button"]').click();

        // Check if clap count increases
        cy.contains('1', { timeout: 5000 }).should('be.visible');
      });
  });

  it('should display wallet status correctly', () => {
    // Simulate connected state
    cy.visit('/?demo=dispute-resolution&wallet=connected');

    // Check wallet status display
    cy.contains('Wallet Connected', { timeout: 10000 }).should('be.visible');
    cy.contains('TEST_WALLET_ADDRESS').should('be.visible');
  });

  it('should show error handling for disconnected wallet', () => {
    // Visit demo without wallet connection
    cy.visit('/?demo=dispute-resolution');

    // Check for wallet connection requirement
    cy.contains('Connect your wallet', { timeout: 10000 }).should('be.visible');
    cy.contains('Wallet connection required').should('be.visible');
  });

  it('should validate responsive design on mobile', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.visit('/');

    // Check if demo card is visible and properly formatted
    cy.contains('Drama Queen Escrow').should('be.visible');
    cy.contains('Dispute Resolution & Arbitration').should('be.visible');

    // Check if buttons are accessible
    cy.contains('CONNECT WALLET').should('be.visible');
  });

  it('should handle complete dispute resolution flow', () => {
    // Simulate full dispute resolution flow
    cy.visit('/?demo=dispute-resolution&wallet=connected');

    // Start with milestone releases
    cy.contains('Release Milestone', { timeout: 10000 }).first().click();
    cy.contains('Milestone Released', { timeout: 5000 }).should('be.visible');

    // Release second milestone
    cy.contains('Release Milestone', { timeout: 5000 }).click();
    cy.contains('Milestone Released', { timeout: 5000 }).should('be.visible');

    // Release final milestone
    cy.contains('Release Milestone', { timeout: 5000 }).click();
    cy.contains('All Milestones Released', { timeout: 10000 }).should('be.visible');

    // Check for demo completion
    cy.contains('Demo Completed', { timeout: 15000 }).should('be.visible');
  });

  it('should show progress indicators during operations', () => {
    // Simulate connected state
    cy.visit('/?demo=dispute-resolution&wallet=connected');

    // Start milestone release process
    cy.contains('Release Milestone', { timeout: 10000 }).first().click();

    // Check for progress indicators
    cy.contains(/\d+ of \d+ milestones/, { timeout: 10000 }).should('be.visible');
  });

  it('should handle evidence submission in disputes', () => {
    // Simulate dispute with evidence submission
    cy.visit('/?demo=dispute-resolution&wallet=connected&dispute=evidence');

    // Look for evidence submission interface
    cy.contains('Submit Evidence', { timeout: 10000 }).should('be.visible');
    cy.contains('Evidence Submitted', { timeout: 5000 }).should('be.visible');
  });
});
