describe('Hello Milestone Demo - Baby Steps to Riches', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1280, 720);
  });

  it('should load the demo and display correct title', () => {
    // Wait for the page to load
    cy.contains('STELLAR NEXUS EXPERIENCE', { timeout: 10000 }).should('be.visible');

    // Check for the demo card
    cy.contains('Baby Steps to Riches').should('be.visible');
    cy.contains('Basic Escrow Flow Demo').should('be.visible');

    // Verify demo description
    cy.contains('Simple escrow flow with automatic milestone completion').should('be.visible');
  });

  it('should require wallet connection to launch demo', () => {
    // Click on the demo card
    cy.contains('Baby Steps to Riches')
      .parent()
      .within(() => {
        cy.contains('CONNECT WALLET').should('be.visible');
        cy.contains('Required to launch demo').should('be.visible');
      });
  });

  it('should show wallet connection modal when connect button is clicked', () => {
    // Click connect wallet button
    cy.contains('CONNECT WALLET').first().click();

    // Check if wallet connection modal appears
    cy.get('[data-testid="wallet-modal"]', { timeout: 5000 }).should('be.visible');
  });

  it('should display demo interface after wallet connection simulation', () => {
    // Simulate wallet connection by visiting demo directly
    cy.visit('/?demo=hello-milestone&wallet=connected');

    // Wait for demo interface to load
    cy.contains('Baby Steps to Riches Flow Demo', { timeout: 10000 }).should('be.visible');
    cy.contains('Experience the complete trustless escrow flow').should('be.visible');
  });

  it('should show initialization button when wallet is connected', () => {
    // Simulate connected state
    cy.visit('/?demo=hello-milestone&wallet=connected');

    // Look for initialization button
    cy.contains('Initialize Escrow', { timeout: 10000 }).should('be.visible');
    cy.contains('Initialize Escrow').should('not.be.disabled');
  });

  it('should handle escrow initialization flow', () => {
    // Simulate connected state
    cy.visit('/?demo=hello-milestone&wallet=connected');

    // Click initialize button
    cy.contains('Initialize Escrow', { timeout: 10000 }).click();

    // Check for loading state
    cy.contains('Initializing', { timeout: 5000 }).should('be.visible');

    // Wait for process explanation
    cy.contains("What's Happening Now", { timeout: 15000 }).should('be.visible');
  });

  it('should display progress indicators during operations', () => {
    // Simulate connected state and start demo
    cy.visit('/?demo=hello-milestone&wallet=connected');

    // Start the demo process
    cy.contains('Initialize Escrow', { timeout: 10000 }).click();

    // Check for progress indicators
    cy.contains('0% Complete', { timeout: 10000 }).should('be.visible');

    // Wait for progress updates
    cy.contains(/\d+% Complete/, { timeout: 20000 }).should('be.visible');
  });

  it('should show completion success message', () => {
    // Simulate completed demo state
    cy.visit('/?demo=hello-milestone&wallet=connected&completed=true');

    // Check for completion indicators
    cy.contains('Demo Completed', { timeout: 10000 }).should('be.visible');
    cy.contains('Congratulations', { timeout: 5000 }).should('be.visible');
  });

  it('should handle demo clapping functionality', () => {
    // Visit main page
    cy.visit('/');

    // Find the demo card and clap button
    cy.contains('Baby Steps to Riches')
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
    cy.visit('/?demo=hello-milestone&wallet=connected');

    // Check wallet status display
    cy.contains('Wallet Connected', { timeout: 10000 }).should('be.visible');
    cy.contains('TEST_WALLET_ADDRESS').should('be.visible');
  });

  it('should show error handling for disconnected wallet', () => {
    // Visit demo without wallet connection
    cy.visit('/?demo=hello-milestone');

    // Check for wallet connection requirement
    cy.contains('Connect your wallet', { timeout: 10000 }).should('be.visible');
    cy.contains('Wallet connection required').should('be.visible');
  });

  it('should validate responsive design on mobile', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.visit('/');

    // Check if demo card is visible and properly formatted
    cy.contains('Baby Steps to Riches').should('be.visible');
    cy.contains('Basic Escrow Flow Demo').should('be.visible');

    // Check if buttons are accessible
    cy.contains('CONNECT WALLET').should('be.visible');
  });

  it('should handle demo completion flow end-to-end', () => {
    // Simulate full demo completion
    cy.visit('/?demo=hello-milestone&wallet=connected');

    // Start demo
    cy.contains('Initialize Escrow', { timeout: 10000 }).click();

    // Wait for initialization
    cy.contains('Initializing', { timeout: 5000 }).should('be.visible');

    // Wait for funding step
    cy.contains('Fund Escrow', { timeout: 20000 }).should('be.visible');
    cy.contains('Fund Escrow').click();

    // Wait for milestone completion
    cy.contains('Complete Milestone', { timeout: 20000 }).should('be.visible');
    cy.contains('Complete Milestone').click();

    // Check for final completion
    cy.contains('Demo Completed', { timeout: 30000 }).should('be.visible');
  });
});
