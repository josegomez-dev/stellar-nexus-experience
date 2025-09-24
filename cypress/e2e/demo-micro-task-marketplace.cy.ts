describe('Micro Task Marketplace Demo - Gig Economy Madness', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1280, 720);
  });

  it('should load the demo and display correct title', () => {
    // Wait for the page to load
    cy.contains('STELLAR NEXUS EXPERIENCE', { timeout: 10000 }).should('be.visible');

    // Check for the demo card
    cy.contains('Gig Economy Madness').should('be.visible');
    cy.contains('Micro-Task Marketplace').should('be.visible');

    // Verify demo description
    cy.contains('Lightweight gig-board with escrow!').should('be.visible');
  });

  it('should require wallet connection to launch demo', () => {
    // Click on the demo card
    cy.contains('Gig Economy Madness')
      .parent()
      .within(() => {
        cy.contains('CONNECT WALLET').should('be.visible');
        cy.contains('Required to launch demo').should('be.visible');
      });
  });

  it('should show wallet connection modal when connect button is clicked', () => {
    // Click connect wallet button on micro task demo
    cy.contains('Gig Economy Madness')
      .parent()
      .within(() => {
        cy.contains('CONNECT WALLET').click();
      });

    // Check if wallet connection modal appears
    cy.get('[data-testid="wallet-modal"]', { timeout: 5000 }).should('be.visible');
  });

  it('should display demo interface after wallet connection simulation', () => {
    // Simulate wallet connection by visiting demo directly
    cy.visit('/?demo=micro-task-marketplace&wallet=connected');

    // Wait for demo interface to load
    cy.contains('Gig Economy Madness', { timeout: 10000 }).should('be.visible');
    cy.contains('Micro-Task Marketplace', { timeout: 10000 }).should('be.visible');
  });

  it('should show task marketplace interface', () => {
    // Simulate connected state
    cy.visit('/?demo=micro-task-marketplace&wallet=connected');

    // Look for marketplace elements
    cy.contains('Task Marketplace', { timeout: 10000 }).should('be.visible');
    cy.contains('Browse Tasks', { timeout: 5000 }).should('be.visible');
  });

  it('should handle task creation workflow', () => {
    // Simulate connected state
    cy.visit('/?demo=micro-task-marketplace&wallet=connected');

    // Click create task button
    cy.contains('Create Task', { timeout: 10000 }).click();

    // Check for task creation form
    cy.contains('Task Created', { timeout: 10000 }).should('be.visible');
  });

  it('should display task submission interface', () => {
    // Simulate connected state with active task
    cy.visit('/?demo=micro-task-marketplace&wallet=connected&task=active');

    // Check for submission elements
    cy.contains('Submit Deliverable', { timeout: 10000 }).should('be.visible');
    cy.contains('Upload Work', { timeout: 5000 }).should('be.visible');
  });

  it('should handle deliverable submission', () => {
    // Simulate connected state with task ready for submission
    cy.visit('/?demo=micro-task-marketplace&wallet=connected&task=ready');

    // Click submit deliverable button
    cy.contains('Submit Deliverable', { timeout: 10000 }).click();

    // Check for submission confirmation
    cy.contains('Deliverable Submitted', { timeout: 10000 }).should('be.visible');
  });

  it('should show escrow protection features', () => {
    // Simulate connected state
    cy.visit('/?demo=micro-task-marketplace&wallet=connected');

    // Check for escrow-related elements
    cy.contains('Escrow Protection', { timeout: 10000 }).should('be.visible');
    cy.contains('Secure Payment', { timeout: 5000 }).should('be.visible');
  });

  it('should handle micro-payment workflow', () => {
    // Simulate connected state with payment flow
    cy.visit('/?demo=micro-task-marketplace&wallet=connected&payment=true');

    // Look for payment elements
    cy.contains('Payment Processing', { timeout: 10000 }).should('be.visible');
    cy.contains('Funds Released', { timeout: 10000 }).should('be.visible');
  });

  it('should show completion status correctly', () => {
    // Simulate completed demo state
    cy.visit('/?demo=micro-task-marketplace&wallet=connected&completed=true');

    // Check for completion indicators
    cy.contains('Demo Completed', { timeout: 10000 }).should('be.visible');
    cy.contains('Escrow Expert', { timeout: 5000 }).should('be.visible');
  });

  it('should handle demo clapping functionality', () => {
    // Visit main page
    cy.visit('/');

    // Find the micro task demo card and clap button
    cy.contains('Gig Economy Madness')
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
    cy.visit('/?demo=micro-task-marketplace&wallet=connected');

    // Check wallet status display
    cy.contains('Wallet Connected', { timeout: 10000 }).should('be.visible');
    cy.contains('TEST_WALLET_ADDRESS').should('be.visible');
  });

  it('should show error handling for disconnected wallet', () => {
    // Visit demo without wallet connection
    cy.visit('/?demo=micro-task-marketplace');

    // Check for wallet connection requirement
    cy.contains('Connect your wallet', { timeout: 10000 }).should('be.visible');
    cy.contains('Wallet connection required').should('be.visible');
  });

  it('should validate responsive design on mobile', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.visit('/');

    // Check if demo card is visible and properly formatted
    cy.contains('Gig Economy Madness').should('be.visible');
    cy.contains('Micro-Task Marketplace').should('be.visible');

    // Check if buttons are accessible
    cy.contains('CONNECT WALLET').should('be.visible');
  });

  it('should handle complete marketplace flow end-to-end', () => {
    // Simulate full marketplace flow
    cy.visit('/?demo=micro-task-marketplace&wallet=connected');

    // Create a task
    cy.contains('Create Task', { timeout: 10000 }).click();
    cy.contains('Task Created', { timeout: 5000 }).should('be.visible');

    // Browse and accept task
    cy.contains('Accept Task', { timeout: 10000 }).click();
    cy.contains('Task Accepted', { timeout: 5000 }).should('be.visible');

    // Submit deliverable
    cy.contains('Submit Deliverable', { timeout: 10000 }).click();
    cy.contains('Deliverable Submitted', { timeout: 5000 }).should('be.visible');

    // Approve and release payment
    cy.contains('Approve Work', { timeout: 10000 }).click();
    cy.contains('Payment Released', { timeout: 10000 }).should('be.visible');

    // Check for demo completion
    cy.contains('Demo Completed', { timeout: 15000 }).should('be.visible');
  });

  it('should show progress indicators during operations', () => {
    // Simulate connected state
    cy.visit('/?demo=micro-task-marketplace&wallet=connected');

    // Start task creation process
    cy.contains('Create Task', { timeout: 10000 }).click();

    // Check for progress indicators
    cy.contains(/Step \d+ of \d+/, { timeout: 10000 }).should('be.visible');
  });

  it('should handle task browsing and filtering', () => {
    // Simulate marketplace with multiple tasks
    cy.visit('/?demo=micro-task-marketplace&wallet=connected&tasks=multiple');

    // Look for browsing interface
    cy.contains('Browse Tasks', { timeout: 10000 }).should('be.visible');
    cy.contains('Filter Tasks', { timeout: 5000 }).should('be.visible');

    // Test filtering
    cy.contains('Filter Tasks').click();
    cy.contains('Filtered Results', { timeout: 5000 }).should('be.visible');
  });

  it('should display gig worker and client perspectives', () => {
    // Test worker perspective
    cy.visit('/?demo=micro-task-marketplace&wallet=connected&role=worker');
    cy.contains('Worker Dashboard', { timeout: 10000 }).should('be.visible');

    // Test client perspective
    cy.visit('/?demo=micro-task-marketplace&wallet=connected&role=client');
    cy.contains('Client Dashboard', { timeout: 10000 }).should('be.visible');
  });
});
