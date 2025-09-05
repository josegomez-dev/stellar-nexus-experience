# 🧪 Testing Guide - Trustless Work

## 📋 Overview

This project uses a comprehensive testing strategy with:

- **Unit Tests** (Jest) - For pure logic and utilities
- **Component Tests** (React Testing Library) - For UI components
- **E2E Tests** (Cypress) - For complete user flows
- **Git Hooks** (Husky + lint-staged) - For pre-commit quality checks
- **CI/CD** (GitHub Actions) - For automated testing pipeline

## 🚀 Quick Start

### Run All Tests

```bash
npm run test:all
```

### Run Unit Tests Only

```bash
npm run test              # Run once
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

### Run E2E Tests Only

```bash
npm run test:e2e          # Headless mode
npm run test:e2e:open     # Interactive mode
```

### Code Quality Checks

```bash
npm run code-quality      # Check only
npm run code-quality:fix  # Fix issues
```

## 🧩 Unit Tests (Jest + React Testing Library)

### Test Structure

```
__tests__/
├── utils/           # Utility function tests
├── hooks/           # Custom hook tests
└── components/      # Component tests
```

### Writing Unit Tests

#### Utility Functions

```typescript
// __tests__/utils/example.test.ts
import { formatWalletAddress } from '@/components/utils/formatting';

describe('formatWalletAddress', () => {
  it('should format a valid wallet address', () => {
    const address =
      'GABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const formatted = formatWalletAddress(address);
    expect(formatted).toBe('GABCDE...WXYZ');
  });

  it('should handle edge cases', () => {
    expect(formatWalletAddress('')).toBe('');
    expect(formatWalletAddress('short')).toBe('short');
  });
});
```

#### Custom Hooks

```typescript
// __tests__/hooks/example.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/components/hooks/useLocalStorage';

describe('useLocalStorage', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should update value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
  });
});
```

#### Components

```typescript
// __tests__/components/example.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { GradientButton } from '@/components/ui/common/GradientButton'

describe('GradientButton', () => {
  it('should render with default props', () => {
    render(<GradientButton>Click me</GradientButton>)

    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = jest.fn()
    render(<GradientButton onClick={handleClick}>Click me</GradientButton>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Test Coverage

- **Target**: 70% coverage minimum
- **Report**: Generated in `coverage/` directory
- **Threshold**: Configured in `jest.config.js`

## 🌐 E2E Tests (Cypress)

### Test Structure

```
cypress/
├── e2e/              # End-to-end tests
│   └── first-demo.cy.ts
├── support/          # Support files
│   ├── e2e.ts       # E2E support
│   └── commands.ts  # Custom commands
└── fixtures/        # Test data
```

### Writing E2E Tests

#### Basic Structure

```typescript
// cypress/e2e/example.cy.ts
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visit('/page-url');
  });

  it('should complete happy path', () => {
    // Step 1: Navigate and verify
    cy.title().should('contain', 'Expected Title');

    // Step 2: Interact with elements
    cy.get('[data-testid="button"]').click();

    // Step 3: Verify results
    cy.get('[data-testid="result"]').should('be.visible');
  });

  it('should handle error cases', () => {
    // Test error scenarios
    cy.get('[data-testid="error-trigger"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible');
  });
});
```

#### Custom Commands

```typescript
// cypress/support/e2e.ts
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document').its('readyState').should('eq', 'complete');
});

Cypress.Commands.add('fillForm', (fields: Record<string, string>) => {
  Object.entries(fields).forEach(([selector, value]) => {
    cy.get(selector).clear().type(value);
  });
});
```

### Demo Flow Test Example

The `first-demo.cy.ts` file demonstrates a complete E2E test for the first demo:

1. **Navigation** - Visit demos page
2. **Selection** - Find and click first demo
3. **Modal Interaction** - Handle immersive demo modal
4. **Content Interaction** - Interact with demo content
5. **Feedback** - Complete feedback form
6. **Verification** - Confirm completion

## 🔧 Git Hooks (Husky + lint-staged)

### Pre-commit Hook

Automatically runs on every commit:

- **ESLint** - Code linting and fixing
- **Prettier** - Code formatting
- **Type Check** - TypeScript validation

### Commit Message Hook

Enforces conventional commit format:

```
type(scope): description

Examples:
- feat: add new component
- fix(ui): resolve button styling issue
- docs: update README
- test: add unit tests for utils
```

## 🚀 CI/CD Pipeline (GitHub Actions)

### Workflow Steps

1. **Code Quality Check**
   - Format check
   - ESLint check
   - TypeScript check

2. **Unit Tests**
   - Run Jest tests
   - Generate coverage report
   - Upload to Codecov (optional)

3. **Build**
   - Build application
   - Upload artifacts

4. **E2E Tests**
   - Start application
   - Run Cypress tests
   - Upload screenshots/videos on failure

### Trigger Conditions

- **Push** to `main` or `develop` branches
- **Pull Request** to `main` or `develop` branches

## 📊 Test Data Attributes

Use `data-testid` attributes for reliable element selection:

```tsx
// In components
<button data-testid="start-demo-button">Start Demo</button>
<div data-testid="demo-card">Demo Content</div>

// In tests
cy.get('[data-testid="start-demo-button"]').click()
cy.get('[data-testid="demo-card"]').should('be.visible')
```

## 🎯 Best Practices

### Unit Tests

- Test pure functions thoroughly
- Mock external dependencies
- Test edge cases and error conditions
- Use descriptive test names
- Group related tests with `describe`

### Component Tests

- Test user interactions, not implementation
- Use semantic queries (getByRole, getByLabelText)
- Test accessibility features
- Avoid testing implementation details

### E2E Tests

- Test complete user journeys
- Use data-testid for reliable selectors
- Handle async operations properly
- Test both happy and error paths
- Keep tests independent

### General

- Write tests before or alongside code (TDD)
- Keep tests simple and focused
- Use meaningful assertions
- Maintain test data separately
- Document complex test scenarios

## 🛠️ Troubleshooting

### Common Issues

#### Jest Tests Failing

```bash
# Clear Jest cache
npm run test -- --clearCache

# Run with verbose output
npm run test -- --verbose
```

#### Cypress Tests Failing

```bash
# Open Cypress to debug
npm run test:e2e:open

# Run specific test
npx cypress run --spec "cypress/e2e/first-demo.cy.ts"
```

#### Pre-commit Hook Issues

```bash
# Skip hooks temporarily
git commit -m "message" --no-verify

# Run lint-staged manually
npx lint-staged
```

### Debugging Tips

- Use `console.log` in tests (will show in test output)
- Use `cy.log()` in Cypress tests
- Use `screen.debug()` in component tests
- Check test coverage reports for gaps

## 📈 Monitoring

### Coverage Reports

- Generated in `coverage/` directory
- View `coverage/lcov-report/index.html` in browser
- Track coverage trends over time

### CI/CD Metrics

- Monitor GitHub Actions success rate
- Track test execution time
- Review failed test artifacts

## 🔄 Continuous Improvement

### Regular Tasks

- Review and update test coverage
- Refactor tests for better maintainability
- Add tests for new features
- Update test data and fixtures
- Review and improve test performance

### Team Practices

- Code review should include test review
- Pair programming for complex test scenarios
- Regular test maintenance sessions
- Share testing knowledge and best practices
