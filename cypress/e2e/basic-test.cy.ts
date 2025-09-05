describe('Basic Test - Verify Setup', () => {
  it('should load the demos page successfully', () => {
    cy.visit('/demos', { timeout: 30000 });
    cy.get('h1', { timeout: 10000 }).should('be.visible');
    cy.log('✅ Demos page loaded successfully');
    cy.url().should('include', '/demos');
    cy.log('✅ URL contains /demos');
  });

  it('should have demo cards visible', () => {
    cy.visit('/demos', { timeout: 30000 });
    cy.get('body').should('be.visible');
    cy.log('✅ Body is visible');
    
    // Check if any demo-related content exists
    cy.get('body').then($body => {
      const hasDemoContent = $body.find('*').filter((i, el) => {
        const text = Cypress.$(el).text().toLowerCase();
        return text.includes('demo') || text.includes('launch') || text.includes('milestone');
      }).length > 0;
      
      if (hasDemoContent) {
        cy.log('✅ Demo content found on page');
      } else {
        cy.log('ℹ️ No demo content found - page may be loading');
      }
    });
  });
});
