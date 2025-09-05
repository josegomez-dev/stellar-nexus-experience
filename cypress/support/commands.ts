/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })

// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })

// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Add custom commands here

// Custom command to slow down test execution for better visibility
Cypress.Commands.add('slowDown', (ms: number = 2000) => {
  cy.wait(ms);
});

// Custom command to pause and log with emoji
Cypress.Commands.add('pauseAndLog', (message: string) => {
  cy.log(`⏸️ ${message}`);
  cy.pause();
});

// Custom command to click with slow animation
Cypress.Commands.add('slowClick', { prevSubject: 'element' }, (subject, options = {}) => {
  // Check if element is visible before triggering hover
  cy.wrap(subject).should('be.visible');
  cy.wrap(subject).trigger('mouseover', { force: true });
  cy.wait(500);
  cy.wrap(subject).click({ force: true, ...options });
  cy.wait(1000);
});

// Custom command to type with human-like delays
Cypress.Commands.add('humanType', { prevSubject: 'element' }, (subject, text, options = {}) => {
  const defaultOptions = { delay: 100, ...options };
  cy.wrap(subject).type(text, defaultOptions);
});

// Custom command to wait for animations
Cypress.Commands.add('waitForAnimation', (ms: number = 2000) => {
  cy.wait(ms);
});

// Custom command to find element with multiple fallback selectors
Cypress.Commands.add('findElement', (selectors: string[]) => {
  return cy.get('body').then($body => {
    for (const selector of selectors) {
      if ($body.find(selector).length > 0) {
        cy.log(`✅ Found element with selector: ${selector}`);
        return cy.get(selector).first();
      }
    }
    cy.log('⚠️ No element found with any of the provided selectors');
    return cy.get('body'); // Fallback
  });
});
