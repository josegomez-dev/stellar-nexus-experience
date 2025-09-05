import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    // Slower timeouts for better visibility
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    responseTimeout: 20000,
    pageLoadTimeout: 60000,
    // Slow down test execution for visibility
    execTimeout: 120000,
    taskTimeout: 120000,
    // Additional timeout settings
    videoCompression: 32,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
});
