describe('Milestone Voting Demo - Democracy in Action', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.viewport(1280, 720);
  });

  it('should load the demo and display correct title', () => {
    // Wait for the page to load
    cy.contains('STELLAR NEXUS EXPERIENCE', { timeout: 10000 }).should('be.visible');

    // Check for the demo card
    cy.contains('Democracy in Action').should('be.visible');
    cy.contains('Multi-Stakeholder Approval System').should('be.visible');

    // Verify demo description
    cy.contains('Multi-stakeholder approval system').should('be.visible');
  });

  it('should show coming soon status', () => {
    // Check for coming soon indicator
    cy.contains('Democracy in Action')
      .parent()
      .within(() => {
        cy.contains('Coming Soon').should('be.visible');
        cy.contains('🚧').should('be.visible');
      });
  });

  it('should display multi-stakeholder requirement', () => {
    // Check for multi-stakeholder requirement
    cy.contains('Democracy in Action')
      .parent()
      .within(() => {
        cy.contains('🔒 Requires Multi-Stakeholders').should('be.visible');
      });
  });

  it('should handle demo clapping functionality even when coming soon', () => {
    // Visit main page
    cy.visit('/');

    // Find the milestone voting demo card and clap button
    cy.contains('Democracy in Action')
      .parent()
      .within(() => {
        cy.get('[data-testid="clap-button"]').should('be.visible');
        cy.get('[data-testid="clap-button"]').click();

        // Check if clap count increases
        cy.contains('1', { timeout: 5000 }).should('be.visible');
      });
  });

  it('should validate responsive design on mobile', () => {
    // Test mobile viewport
    cy.viewport(375, 667);
    cy.visit('/');

    // Check if demo card is visible and properly formatted
    cy.contains('Democracy in Action').should('be.visible');
    cy.contains('Multi-Stakeholder Approval System').should('be.visible');

    // Check if coming soon status is visible
    cy.contains('Coming Soon').should('be.visible');
  });

  // Future tests for when the demo is implemented
  context('When Demo is Implemented (Future)', () => {
    beforeEach(() => {
      // These tests will run when the demo is actually implemented
      cy.visit('/?demo=milestone-voting&wallet=connected&implemented=true');
    });

    it('should display voting interface', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });

    it('should handle multi-stakeholder voting workflow', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });

    it('should show consensus mechanism', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });

    it('should handle complex approval workflows', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });

    it('should display voting progress and results', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });

    it('should show democratic decision-making process', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });

    it('should handle stakeholder role management', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });

    it('should validate voting permissions and access control', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });

    it('should show completion status correctly', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });

    it('should handle complete voting flow end-to-end', () => {
      // Skip this test until demo is implemented
      cy.log('Skipping until demo is implemented');
    });
  });

  // Test the demo card interaction and UI elements
  it('should display demo information correctly', () => {
    cy.visit('/');

    // Check demo card content
    cy.contains('Democracy in Action')
      .parent()
      .within(() => {
        // Check title and subtitle
        cy.contains('2. Democracy in Action').should('be.visible');
        cy.contains('Multi-Stakeholder Approval System').should('be.visible');

        // Check description
        cy.contains(
          'Multi-stakeholder approval system where multiple reviewers must approve milestones'
        ).should('be.visible');

        // Check status indicators
        cy.contains('Coming Soon').should('be.visible');
        cy.contains('🔒 Requires Multi-Stakeholders').should('be.visible');

        // Check stats
        cy.contains('0 Claps').should('be.visible');
        cy.contains('0 Completed').should('be.visible');
      });
  });

  it('should show appropriate styling for coming soon demo', () => {
    cy.visit('/');

    // Check that the demo card has appropriate styling for coming soon status
    cy.contains('Democracy in Action').parent().should('have.class', 'opacity-60');
    cy.contains('Coming Soon').should('be.visible');
  });

  it('should not allow demo launch when coming soon', () => {
    cy.visit('/');

    // The demo should not have a launch button, only coming soon indicator
    cy.contains('Democracy in Action')
      .parent()
      .within(() => {
        cy.contains('CONNECT WALLET').should('not.exist');
        cy.contains('Coming Soon').should('be.visible');
      });
  });

  it('should display correct demo order and numbering', () => {
    cy.visit('/');

    // Check that this is demo #2 in the sequence
    cy.contains('2. Democracy in Action').should('be.visible');

    // Verify it appears in correct order relative to other demos
    cy.get('[data-testid="demo-card"]')
      .eq(1)
      .within(() => {
        cy.contains('Democracy in Action').should('be.visible');
      });
  });

  it('should show multi-stakeholder requirement explanation', () => {
    cy.visit('/');

    // Check for multi-stakeholder explanation
    cy.contains('Democracy in Action')
      .parent()
      .within(() => {
        cy.contains('🔒 Requires Multi-Stakeholders').should('be.visible');
        cy.contains('Perfect for complex projects requiring multiple sign-offs').should(
          'be.visible'
        );
      });
  });
});
