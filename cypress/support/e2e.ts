// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for better test readability
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for page load
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>;

      /**
       * Custom command to check if element is visible and clickable
       * @example cy.checkElementReady('[data-testid="button"]')
       */
      checkElementReady(selector: string): Chainable<void>;

      /**
       * Custom command to fill form fields
       * @example cy.fillForm({ name: 'John', email: 'john@example.com' })
       */
      fillForm(fields: Record<string, string>): Chainable<void>;
    }
  }
}

// Custom command implementations
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document').its('readyState').should('eq', 'complete');
});

Cypress.Commands.add('checkElementReady', (selector: string) => {
  cy.get(selector).should('be.visible').should('not.be.disabled');
});

Cypress.Commands.add('fillForm', (fields: Record<string, string>) => {
  Object.entries(fields).forEach(([selector, value]) => {
    cy.get(selector).clear().type(value);
  });
});
