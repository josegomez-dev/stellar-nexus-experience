# 🚀 Developer Guide - Nexus Experience

> **Complete onboarding guide for developers joining the Nexus Experience
> project**

## 📋 **Quick Start**

### **Prerequisites**

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

### **Initial Setup**

```bash
# Clone the repository
git clone <repository-url>
cd nexus-experience

# Quick setup (recommended for new developers)
npm run setup:dev
```

This will:

- Install dependencies
- Create environment file from template
- Fix code formatting
- Start development server

## 🎯 **Command Reference - Modern Development Experience**

### **🚀 Quick Commands (Most Used)**

```bash
# Start development
npm run dev                    # Start development server
npm run dev:clean             # Clean start (removes .next cache)

# Environment management
npm run env:check             # Check environment status
npm run env:setup             # Create .env.local from template
npm run env:validate          # Validate environment configuration

# Testing
npm run test:demo             # Run the first demo E2E test
npm run test:demo:open        # Open Cypress for demo testing
npm run test:unit             # Run unit tests only
npm run test:e2e:dev         # Run E2E tests against local dev server

# Code quality
npm run check                 # Run all checks (lint + test)
npm run check:fix            # Fix issues and run tests
npm run health               # Quick health check
npm run health:full          # Full health check with tests
```

### **🔧 Development Workflow**

```bash
# Daily development cycle
npm run dev                  # Start development server
npm run test:unit:watch      # Watch unit tests in another terminal
npm run test:demo:open       # Open Cypress for manual testing

# Before committing
npm run check:fix            # Fix all issues automatically
npm run health:full          # Full health check
```

### **🧪 Testing Commands**

```bash
# Unit Testing
npm run test                 # Run all tests
npm run test:unit            # Run unit tests only
npm run test:unit:watch      # Watch unit tests
npm run test:components      # Test React components
npm run test:lib             # Test utility functions

# E2E Testing
npm run test:e2e             # Run all E2E tests
npm run test:e2e:open        # Open Cypress UI
npm run test:e2e:dev         # Run against local dev server
npm run test:e2e:headed      # Run with browser visible
npm run test:demo            # Run first demo test specifically

# Coverage
npm run test:coverage        # Generate coverage report
npm run test:coverage:html   # Generate HTML coverage report
npm run test:coverage:open   # Open coverage report in browser
```

### **🔍 Environment & Configuration**

```bash
# Environment management
npm run env:check            # Check current environment status
npm run env:setup            # Create .env.local from template
npm run env:validate         # Validate environment configuration

# Environment file structure:
.env.local                   # Local development (gitignored)
env.example                  # Template with all variables
env.production               # Production environment
```

### **🎨 Code Quality & Formatting**

```bash
# Code quality checks
npm run code-quality         # Run all quality checks
npm run code-quality:fix     # Fix issues automatically
npm run lint:check           # Check linting only
npm run lint:fix            # Fix linting issues
npm run format:check         # Check formatting only
npm run format              # Fix formatting issues
npm run type-check          # TypeScript type checking

# Quick fixes
npm run check               # Run all checks
npm run check:fix           # Fix all issues
```

### **🧹 Cleanup & Reset**

```bash
# Cleanup commands
npm run clean               # Clean build cache and coverage
npm run clean:all           # Full reset (node_modules, etc.)
npm run dev:reset           # Reset everything and restart dev

# Build cleanup
npm run build:clean         # Clean build
npm run build:analyze       # Build with bundle analysis
```

### **🚀 Deployment & Production**

```bash
# Production builds
npm run build               # Build for production
npm run start:prod         # Build and start production server
npm run preview             # Build and preview production

# Deployment
npm run deploy              # Prepare for deployment
npm run deploy:vercel       # Deploy to Vercel (production)
npm run deploy:vercel:preview # Deploy to Vercel (preview)
```

### **🐳 Docker Commands**

```bash
# Docker development
npm run docker:build        # Build Docker image
npm run docker:run          # Run Docker container
npm run docker:dev          # Start with docker-compose
npm run docker:stop         # Stop docker-compose
```

### **🔧 CI/CD Commands**

```bash
# Continuous Integration
npm run ci                  # Full CI pipeline
npm run ci:quick            # Quick CI check
```

## 📁 **Project Structure**

```
nexus-experience/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── demos/             # Demo components
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── lib/                   # Core libraries
│   ├── env.ts             # Environment validation
│   ├── config.ts          # Application configuration
│   └── design-tokens.ts   # Design system
├── __tests__/             # Unit tests
├── cypress/               # E2E tests
├── scripts/               # Build scripts
└── public/                # Static assets
```

## 🎯 **Development Workflow**

### **1. Starting a New Feature**

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Start development
npm run dev

# 3. Run tests in watch mode
npm run test:unit:watch

# 4. Test your changes
npm run test:demo:open
```

### **2. Before Committing**

```bash
# 1. Run health check
npm run health:full

# 2. Fix any issues
npm run check:fix

# 3. Commit your changes
git add .
git commit -m "feat: your feature description"
```

### **3. Testing Your Feature**

```bash
# Unit tests
npm run test:unit

# Component tests
npm run test:components

# E2E tests
npm run test:e2e:dev

# Specific demo test
npm run test:demo
```

## 🔍 **Environment Variables**

### **Quick Environment Check**

```bash
npm run env:check
```

This will show:

- ✅ Environment loaded successfully
- 📊 Number of public variables
- 🔐 Number of server variables

### **Setting Up Environment**

```bash
# Create environment file
npm run env:setup

# Validate configuration
npm run env:validate
```

### **Required Variables**

```bash
# Core Stellar Configuration
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_STELLAR_HORIZON_TESTNET=https://horizon-testnet.stellar.org
NEXT_PUBLIC_STELLAR_HORIZON_PUBLIC=https://horizon.stellar.org

# Asset Configuration
NEXT_PUBLIC_DEFAULT_ASSET_CODE=USDC
NEXT_PUBLIC_DEFAULT_ASSET_ISSUER=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA
NEXT_PUBLIC_DEFAULT_ASSET_DECIMALS=7

# App Configuration
NEXT_PUBLIC_APP_NAME=NEXUS EXPERIENCE
NEXT_PUBLIC_APP_VERSION=0.1.0
```

## 🧪 **Testing Strategy**

### **Unit Tests**

- **Location**: `__tests__/` directory
- **Command**: `npm run test:unit`
- **Watch mode**: `npm run test:unit:watch`
- **Coverage**: `npm run test:coverage`

### **Component Tests**

- **Location**: `components/**/*.test.tsx`
- **Command**: `npm run test:components`
- **Watch mode**: `npm run test:components:watch`

### **E2E Tests**

- **Location**: `cypress/e2e/`
- **Command**: `npm run test:e2e`
- **UI**: `npm run test:e2e:open`
- **Demo test**: `npm run test:demo`

## 🎨 **Design System**

### **Design Tokens**

```typescript
import { DESIGN_TOKENS } from '@/lib/design-tokens';

// Colors
const brandColor = DESIGN_TOKENS.colors.brand[500];
const accentColor = DESIGN_TOKENS.colors.accent[500];

// Spacing
const padding = DESIGN_TOKENS.spacing.md;
const margin = DESIGN_TOKENS.spacing.lg;

// Animations
const duration = DESIGN_TOKENS.animations.duration.normal;
const easing = DESIGN_TOKENS.animations.easing['ease-out'];
```

### **Component Library**

- **Badge**: Status indicators and labels
- **Card**: Content containers with glassmorphism
- **Modal**: Overlay dialogs and forms
- **Button**: Interactive elements with gradients
- **Tooltip**: Contextual help and information

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Environment Problems**

```bash
# Check environment status
npm run env:check

# Reset environment
npm run env:setup

# Validate configuration
npm run env:validate
```

#### **Build Issues**

```bash
# Clean build
npm run build:clean

# Reset everything
npm run dev:reset
```

#### **Test Failures**

```bash
# Run tests in isolation
npm run test:unit -- --testNamePattern="test name"

# Check coverage
npm run test:coverage:open
```

#### **Development Server Issues**

```bash
# Clean start
npm run dev:clean

# Full reset
npm run dev:reset
```

### **Debug Information**

- **Browser Console**: Check for JavaScript errors
- **Network Tab**: Verify API calls and responses
- **Environment**: `npm run env:check`
- **Health Check**: `npm run health:full`

## 📚 **Documentation**

- **Testing Guide**: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
- **Environment Setup**: [env.example](./env.example)
- **Design System**: [lib/design-tokens.ts](./lib/design-tokens.ts)

### **External Links**

- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Stellar Documentation**:
  [developers.stellar.org](https://developers.stellar.org)
- **TailwindCSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **TypeScript**: [typescriptlang.org/docs](https://typescriptlang.org/docs)

### **Support Channels**

- **GitHub Issues**: Report bugs and request features
- **Discord**: Join the developer community
- **Documentation**: Check the guides and examples

### **Issue Reporting**

When reporting issues, include:

- **Environment**: OS, Node.js version, browser
- **Steps**: Clear reproduction steps
- **Expected**: What should happen
- **Actual**: What actually happens
- **Console**: Any error messages

**Happy coding! 🚀🌟**
