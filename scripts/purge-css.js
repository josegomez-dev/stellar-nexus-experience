#!/usr/bin/env node

/**
 * CSS Purge Script
 * Identifies and removes unused CSS classes from the codebase
 */

const fs = require('fs');
const glob = require('glob');

// Configuration
const CONFIG = {
  sourceFiles: [
    './app/**/*.{tsx,ts,jsx,js}',
    './components/**/*.{tsx,ts,jsx,js}',
    './pages/**/*.{tsx,ts,jsx,js}',
  ],
  cssFile: './app/globals.css',
  outputFile: './app/globals-purged.css',
  ignoredClasses: [
    // Tailwind classes that should always be included
    'container',
    'sr-only',
    'not-sr-only',
    // Dynamic classes
    'animate-*',
    'bg-*',
    'text-*',
    'border-*',
    'shadow-*',
    // Responsive classes
    'sm:*',
    'md:*',
    'lg:*',
    'xl:*',
    '2xl:*',
    // State classes
    'hover:*',
    'focus:*',
    'active:*',
    'disabled:*',
  ],
  // Classes that are definitely used (manual override)
  definitelyUsed: [
    'epic-text',
    'epic-particle',
    'animate-fadeIn',
    'animate-slideInUp',
    'animate-fadeInUp',
    'animate-float',
    'animate-shimmer',
    'animate-slideInRight',
    'animate-slideInLeft',
    'onboarding-highlight',
    'onboarding-element',
    'typewriter-text',
    'enhanced-float',
    'epic-container',
    'slider',
    'animate-loading-bar',
    'glass',
    'gradient-text',
    'glow',
    'glow-text',
  ],
};

/**
 * Extract CSS classes from a file
 */
function extractClassesFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const classes = new Set();

    // Match className="..." or className='...'
    const classRegex = /className=["']([^"']+)["']/g;
    let match;
    while ((match = classRegex.exec(content)) !== null) {
      const classString = match[1];
      const individualClasses = classString.split(' ').filter(Boolean);
      individualClasses.forEach(cls => classes.add(cls));
    }

    // Match className={`...`} or className={`${...}`}
    const templateRegex = /className=\{`([^`]+)`\}/g;
    while ((match = templateRegex.exec(content)) !== null) {
      const classString = match[1];
      const individualClasses = classString.split(' ').filter(Boolean);
      individualClasses.forEach(cls => classes.add(cls));
    }

    // Match className={...} with string literals
    const dynamicRegex = /className=\{([^}]+)\}/g;
    while ((match = dynamicRegex.exec(content)) !== null) {
      const classString = match[1];
      // Extract string literals from dynamic expressions
      const stringRegex = /["']([^"']+)["']/g;
      let stringMatch;
      while ((stringMatch = stringRegex.exec(classString)) !== null) {
        const individualClasses = stringMatch[1].split(' ').filter(Boolean);
        individualClasses.forEach(cls => classes.add(cls));
      }
    }

    return Array.from(classes);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error reading file ${filePath}:`, error.message);
    return [];
  }
}

/**
 * Extract CSS classes from CSS file
 */
function extractClassesFromCSS(cssContent) {
  const classRegex = /\.([a-zA-Z0-9_-]+)(?:\s*[.{])/g;
  const classes = new Set();

  let match;
  while ((match = classRegex.exec(cssContent)) !== null) {
    classes.add(match[1]);
  }

  return Array.from(classes);
}

/**
 * Check if a class should be ignored
 */
function shouldIgnoreClass(className) {
  return CONFIG.ignoredClasses.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(className);
    }
    return className === pattern;
  });
}

/**
 * Main purge function
 */
function purgeCSS() {
  // eslint-disable-next-line no-console
  console.log('🔍 Starting CSS purge...');

  // Get all source files
  const sourceFiles = CONFIG.sourceFiles.flatMap(pattern => glob.sync(pattern));
  // eslint-disable-next-line no-console
  console.log(`📁 Found ${sourceFiles.length} source files`);

  // Extract used classes from source files
  const usedClasses = new Set();
  sourceFiles.forEach(file => {
    const classes = extractClassesFromFile(file);
    classes.forEach(cls => {
      if (!shouldIgnoreClass(cls)) {
        usedClasses.add(cls);
      }
    });
  });

  // Add definitely used classes
  CONFIG.definitelyUsed.forEach(cls => usedClasses.add(cls));

  // eslint-disable-next-line no-console
  console.log(`🎯 Found ${usedClasses.size} used classes`);

  // Read CSS file
  const cssContent = fs.readFileSync(CONFIG.cssFile, 'utf8');
  const cssClasses = extractClassesFromCSS(cssContent);
  // eslint-disable-next-line no-console
  console.log(`📄 Found ${cssClasses.length} classes in CSS`);

  // Find unused classes
  const unusedClasses = cssClasses.filter(cls => !usedClasses.has(cls));
  // eslint-disable-next-line no-console
  console.log(`🗑️  Found ${unusedClasses.length} unused classes`);

  // Remove unused classes from CSS
  let purgedCSS = cssContent;
  unusedClasses.forEach(cls => {
    const classRegex = new RegExp(
      `\\.${cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*{[^}]*}`,
      'g'
    );
    purgedCSS = purgedCSS.replace(classRegex, '');
  });

  // Clean up empty lines and comments
  purgedCSS = purgedCSS
    .replace(/\n\s*\n/g, '\n') // Remove multiple empty lines
    .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '') // Remove comments
    .trim();

  // Write purged CSS
  fs.writeFileSync(CONFIG.outputFile, purgedCSS);

  // eslint-disable-next-line no-console
  console.log(`✅ Purged CSS written to ${CONFIG.outputFile}`);
  // eslint-disable-next-line no-console
  console.log(`📊 Original size: ${(cssContent.length / 1024).toFixed(2)}KB`);
  // eslint-disable-next-line no-console
  console.log(`📊 Purged size: ${(purgedCSS.length / 1024).toFixed(2)}KB`);
  // eslint-disable-next-line no-console
  console.log(`📊 Reduction: ${((1 - purgedCSS.length / cssContent.length) * 100).toFixed(1)}%`);

  // Log unused classes for reference
  if (unusedClasses.length > 0) {
    // eslint-disable-next-line no-console
    console.log('\n🗑️  Unused classes:');
    unusedClasses.forEach(cls => {
      // eslint-disable-next-line no-console
      console.log(`  - ${cls}`);
    });
  }

  // Log definitely used classes
  // eslint-disable-next-line no-console
  console.log('\n✅ Definitely used classes:');
  CONFIG.definitelyUsed.forEach(cls => {
    // eslint-disable-next-line no-console
    console.log(`  - ${cls}`);
  });
}

// Run the purge
if (require.main === module) {
  purgeCSS();
}

module.exports = { purgeCSS };
