# 🚀 Quick Command Reference - Nexus Experience

> **Essential commands for daily development**

## 🎯 **Most Used Commands**

```bash
# 🚀 Start Development
npm run dev                    # Start development server
npm run dev:clean             # Clean start (removes cache)

# 🔍 Environment
npm run env:check             # Check environment status
npm run env:setup             # Create .env.local from template

# 🧪 Testing
npm run test:unit             # Run unit tests
npm run test:demo             # Run first demo E2E test
npm run test:demo:open        # Open Cypress for demo testing

# ✅ Quality & Health
npm run check                 # Run all checks (lint + test)
npm run check:fix            # Fix issues and run tests
npm run health               # Quick health check
```

## 🔧 **Development Workflow**

```bash
# Daily development cycle
npm run dev                  # Start development server
npm run test:unit:watch      # Watch unit tests in another terminal
npm run test:demo:open       # Open Cypress for manual testing

# Before committing
npm run check:fix            # Fix all issues automatically
npm run health:full          # Full health check
```

## 🧪 **Testing Commands**

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
npm run test:demo            # Run first demo test specifically

# Coverage
npm run test:coverage        # Generate coverage report
npm run test:coverage:open   # Open coverage report in browser
```

## 🔍 **Environment & Configuration**

```bash
# Environment management
npm run env:check            # Check current environment status
npm run env:setup            # Create .env.local from template
npm run env:validate         # Validate environment configuration
```

## 🎨 **Code Quality & Formatting**

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

## 🧹 **Cleanup & Reset**

```bash
# Cleanup commands
npm run clean               # Clean build cache and coverage
npm run clean:all           # Full reset (node_modules, etc.)
npm run dev:reset           # Reset everything and restart dev

# Build cleanup
npm run build:clean         # Clean build
```

## 🚀 **Deployment & Production**

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

## 🐳 **Docker Commands**

```bash
# Docker development
npm run docker:build        # Build Docker image
npm run docker:run          # Run Docker container
npm run docker:dev          # Start with docker-compose
npm run docker:stop         # Stop docker-compose
```

## 🔧 **CI/CD Commands**

```bash
# Continuous Integration
npm run ci                  # Full CI pipeline
npm run ci:quick            # Quick CI check
```

## 🆘 **Troubleshooting**

```bash
# Common fixes
npm run dev:clean           # Clean start development
npm run dev:reset           # Full reset and restart
npm run clean:all           # Reset everything
npm run health:full         # Full health check
```

## 📋 **Quick Setup for New Developers**

```bash
# 1. Clone and setup
git clone <repository-url>
cd nexus-experience
npm run setup:dev           # Complete setup and start dev

# 2. Verify everything works
npm run health:full         # Run full health check
npm run test:unit           # Run unit tests
npm run test:demo:open      # Open Cypress for demo testing
```

## 🎯 **Daily Development Commands**

```bash
# Morning routine
npm run dev                 # Start development
npm run test:unit:watch     # Watch tests in another terminal

# Before committing
npm run check:fix           # Fix all issues
npm run health:full         # Full health check

# End of day
npm run clean               # Clean up cache
```

---

**💡 Pro Tips:**
- Use `npm run dev:clean` if you encounter strange build issues
- Use `npm run health:full` to verify everything is working
- Use `npm run test:demo:open` to manually test your changes
- Use `npm run check:fix` before committing to automatically fix issues

**🚀 Happy coding!**



