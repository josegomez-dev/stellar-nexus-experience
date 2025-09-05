/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to slow down test execution for better visibility
     * @param ms - Milliseconds to wait (default: 2000)
     * @example cy.slowDown(3000)
     */
    slowDown(ms?: number): Chainable<void>;

    /**
     * Custom command to pause and log with emoji
     * @param message - Message to log before pausing
     * @example cy.pauseAndLog('Step completed')
     */
    pauseAndLog(message: string): Chainable<void>;

    /**
     * Custom command to click with slow animation
     * @param options - Click options
     * @example cy.get('button').slowClick()
     */
    slowClick(options?: Partial<Cypress.ClickOptions>): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to type with human-like delays
     * @param text - Text to type
     * @param options - Type options
     * @example cy.get('input').humanType('Hello World')
     */
    humanType(text: string, options?: Partial<Cypress.TypeOptions>): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to wait for animations
     * @param ms - Milliseconds to wait (default: 2000)
     * @example cy.waitForAnimation(3000)
     */
    waitForAnimation(ms?: number): Chainable<void>;

    /**
     * Custom command to find element with multiple fallback selectors
     * @param selectors - Array of CSS selectors to try
     * @example cy.findElement(['button:contains("Click")', '.btn-primary'])
     */
    findElement(selectors: string[]): Chainable<JQuery<HTMLElement>>;
  }
}
