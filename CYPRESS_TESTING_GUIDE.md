# Cypress Testing Guide

## Overview

This guide explains how to run the updated Cypress tests that are designed to be slow and visible for better observation and debugging.

## Test Files

### 1. `demo1-complete-flow.cy.ts` (Enhanced Version)
- **Purpose**: Comprehensive test with multiple fallback selectors
- **Features**: 
  - Multiple selector strategies for each element
  - Longer wait times (2-8 seconds between steps)
  - Pause points after each escrow step
  - Detailed logging with emojis
  - Robust error handling

### 2. `demo1-simple-flow.cy.ts` (Simplified Version)
- **Purpose**: Cleaner test using custom commands
- **Features**:
  - Uses custom Cypress commands for better readability
  - Same slow execution for visibility
  - Pause points for observation
  - Simplified selector logic

## Custom Commands

The tests use several custom commands defined in `cypress/support/commands.ts`:

- `cy.slowDown(ms)` - Wait for specified milliseconds
- `cy.pauseAndLog(message)` - Pause and log a message
- `cy.slowClick()` - Click with hover animation and delays
- `cy.humanType(text)` - Type with human-like delays
- `cy.waitForAnimation(ms)` - Wait for animations to complete
- `cy.findElement(selectors[])` - Find element using multiple fallback selectors

## Running Tests

### Prerequisites

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Install Cypress** (if not already installed):
   ```bash
   npm install cypress --save-dev
   ```

### Running Tests

#### Option 1: Run in Cypress Test Runner (Recommended for Observation)
```bash
npx cypress open
```

Then select:
- **E2E Testing**
- Choose your browser (Chrome recommended)
- Select `demo1-complete-flow.cy.ts` or `demo1-simple-flow.cy.ts`

#### Option 2: Run in Headless Mode
```bash
npx cypress run --spec "cypress/e2e/demo1-complete-flow.cy.ts"
```

#### Option 3: Run with Video Recording
```bash
npx cypress run --spec "cypress/e2e/demo1-complete-flow.cy.ts" --record
```

## Test Flow

The tests follow this sequence:

1. **Navigate to /demos page**
2. **Open wallet sidebar** (multiple selector strategies)
3. **Connect wallet** with manual address input
4. **Launch Demo 1** from demo cards
5. **Start demo** in immersive modal
6. **Execute escrow steps**:
   - Initialize Escrow
   - Fund Escrow
   - Complete Milestone
   - Approve Milestone
   - Release Funds
7. **Wait for completion** and confetti animation
8. **Complete demo** and verify final state

## Key Features for Visibility

### Slow Execution
- **2-8 second waits** between major steps
- **4 second waits** after each escrow step
- **8 second wait** for confetti animation

### Pause Points
- **Pause after each escrow step** - Press SPACE to continue
- **Visual feedback** with emoji logging
- **Step-by-step observation** possible

### Robust Selectors
- **Multiple fallback selectors** for each element
- **Text-based selectors** (e.g., `button:contains("Connect")`)
- **Class-based selectors** (e.g., `.demo-card`)
- **Attribute-based selectors** (e.g., `[data-testid="wallet-button"]`)

## Configuration

The tests use enhanced configuration in `cypress.config.ts`:

```typescript
{
  defaultCommandTimeout: 15000,  // Increased from 10000
  requestTimeout: 15000,         // Increased from 10000
  responseTimeout: 15000,        // Increased from 10000
  execTimeout: 60000,            // Added for slow execution
  taskTimeout: 60000,            // Added for slow execution
}
```

## Troubleshooting

### Common Issues

1. **Wallet button not found**:
   - Test tries multiple selectors automatically
   - Check browser console for selector logs

2. **Demo not launching**:
   - Ensure development server is running
   - Check that demo cards are visible on /demos page

3. **Escrow steps not working**:
   - Verify wallet is connected first
   - Check that demo modal is open

### Debug Mode

To run tests with maximum visibility:

1. Use `npx cypress open` (not headless)
2. Enable "Slow down commands" in Cypress settings
3. Use browser dev tools to inspect elements

## Test Data

The tests use a mock Stellar wallet address:
```
GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890
```

This address is used for manual wallet connection testing.

## Video Recording

Tests automatically record videos in `cypress/videos/` for later review.

## Screenshots

Failed tests automatically capture screenshots in `cypress/screenshots/`.

## Next Steps

To add more tests:

1. Copy the structure from existing test files
2. Use custom commands for consistency
3. Add multiple selector strategies
4. Include pause points for observation
5. Add comprehensive logging

## Performance Notes

- **Total test duration**: ~2-3 minutes (with pauses)
- **Without pauses**: ~30-45 seconds
- **Video file size**: ~10-20MB per test
- **Screenshot count**: 1 per failure
