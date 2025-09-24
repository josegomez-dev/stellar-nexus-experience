'use client';

import { useMemo } from 'react';

interface PixelArtAvatarProps {
  seed?: string;
  size?: number;
  className?: string;
}

interface AvatarConfig {
  backgroundColor: string;
  skinTone: string;
  hairColor: string;
  hairStyle: number;
  eyeColor: string;
  eyeStyle: number;
  mouthStyle: number;
  accessories: number[];
  clothing: number;
  clothingColor: string;
}

// Color palettes for different elements
const BACKGROUND_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483', '#7209b7',
  '#2d1b69', '#11998e', '#38ef7d', '#ff6b6b', '#4ecdc4'
];

const SKIN_TONES = [
  '#fdbb2d', '#fdb462', '#fd8d3c', '#e6550d', '#a63603',
  '#f4e4bc', '#e6d3a3', '#d4c29c', '#c4b896', '#b8a88b'
];

const HAIR_COLORS = [
  '#8b4513', '#654321', '#2f1b14', '#1a0f0a', '#ffd700',
  '#ff69b4', '#ff1493', '#8a2be2', '#00ced1', '#32cd32'
];

const EYE_COLORS = [
  '#8b4513', '#654321', '#2f1b14', '#1a0f0a', '#000080',
  '#008000', '#800080', '#ff69b4', '#ff4500', '#00ced1'
];

const CLOTHING_COLORS = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
  '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
];

// Generate a deterministic seed from string
const generateSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Generate random number from seed
const seededRandom = (seed: number, index: number = 0): number => {
  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x);
};

// Generate avatar configuration from seed
const generateAvatarConfig = (seed: string): AvatarConfig => {
  const seedNum = generateSeed(seed);
  
  return {
    backgroundColor: BACKGROUND_COLORS[Math.floor(seededRandom(seedNum, 1) * BACKGROUND_COLORS.length)],
    skinTone: SKIN_TONES[Math.floor(seededRandom(seedNum, 2) * SKIN_TONES.length)],
    hairColor: HAIR_COLORS[Math.floor(seededRandom(seedNum, 3) * HAIR_COLORS.length)],
    hairStyle: Math.floor(seededRandom(seedNum, 4) * 4), // 0-3
    eyeColor: EYE_COLORS[Math.floor(seededRandom(seedNum, 5) * EYE_COLORS.length)],
    eyeStyle: Math.floor(seededRandom(seedNum, 6) * 3), // 0-2
    mouthStyle: Math.floor(seededRandom(seedNum, 7) * 3), // 0-2
    accessories: [
      Math.floor(seededRandom(seedNum, 8) * 2), // glasses
      Math.floor(seededRandom(seedNum, 9) * 2), // hat
    ],
    clothing: Math.floor(seededRandom(seedNum, 10) * 3), // 0-2
    clothingColor: CLOTHING_COLORS[Math.floor(seededRandom(seedNum, 11) * CLOTHING_COLORS.length)],
  };
};

// Render pixel art avatar as SVG
const renderPixelAvatar = (config: AvatarConfig, size: number): string => {
  const pixelSize = size / 16; // 16x16 grid
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${config.backgroundColor}"/>
      
      <!-- Hair -->
      ${renderHair(config.hairColor, config.hairStyle, pixelSize)}
      
      <!-- Face -->
      <rect x="${pixelSize * 4}" y="${pixelSize * 4}" width="${pixelSize * 8}" height="${pixelSize * 8}" fill="${config.skinTone}"/>
      
      <!-- Eyes -->
      ${renderEyes(config.eyeColor, config.eyeStyle, pixelSize)}
      
      <!-- Mouth -->
      ${renderMouth(config.mouthStyle, pixelSize)}
      
      <!-- Accessories -->
      ${config.accessories[0] ? renderGlasses(pixelSize) : ''}
      ${config.accessories[1] ? renderHat(config.hairColor, pixelSize) : ''}
      
      <!-- Clothing -->
      ${renderClothing(config.clothing, config.clothingColor, pixelSize)}
    </svg>
  `;
  return svg;
};

// Hair styles
const renderHair = (color: string, style: number, pixelSize: number): string => {
  const styles = [
    // Style 0: Short hair
    `<rect x="${pixelSize * 3}" y="${pixelSize * 2}" width="${pixelSize * 10}" height="${pixelSize * 3}" fill="${color}"/>
     <rect x="${pixelSize * 2}" y="${pixelSize * 3}" width="${pixelSize * 12}" height="${pixelSize * 2}" fill="${color}"/>`,
    
    // Style 1: Long hair
    `<rect x="${pixelSize * 3}" y="${pixelSize * 2}" width="${pixelSize * 10}" height="${pixelSize * 3}" fill="${color}"/>
     <rect x="${pixelSize * 2}" y="${pixelSize * 3}" width="${pixelSize * 12}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 4}" y="${pixelSize * 5}" width="${pixelSize * 2}" height="${pixelSize * 6}" fill="${color}"/>
     <rect x="${pixelSize * 10}" y="${pixelSize * 5}" width="${pixelSize * 2}" height="${pixelSize * 6}" fill="${color}"/>`,
    
    // Style 2: Spiky hair
    `<rect x="${pixelSize * 3}" y="${pixelSize * 2}" width="${pixelSize * 10}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 2}" y="${pixelSize * 3}" width="${pixelSize * 12}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 1}" y="${pixelSize * 1}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 6}" y="${pixelSize * 1}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 13}" y="${pixelSize * 1}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>`,
    
    // Style 3: Bald/hat
    `<rect x="${pixelSize * 4}" y="${pixelSize * 3}" width="${pixelSize * 8}" height="${pixelSize * 1}" fill="${color}"/>`
  ];
  
  return styles[style] || styles[0];
};

// Eye styles
const renderEyes = (color: string, style: number, pixelSize: number): string => {
  const styles = [
    // Style 0: Normal eyes
    `<rect x="${pixelSize * 5}" y="${pixelSize * 6}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 9}" y="${pixelSize * 6}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>`,
    
    // Style 1: Big eyes
    `<rect x="${pixelSize * 4}" y="${pixelSize * 5}" width="${pixelSize * 3}" height="${pixelSize * 3}" fill="${color}"/>
     <rect x="${pixelSize * 9}" y="${pixelSize * 5}" width="${pixelSize * 3}" height="${pixelSize * 3}" fill="${color}"/>`,
    
    // Style 2: Small eyes
    `<rect x="${pixelSize * 6}" y="${pixelSize * 7}" width="${pixelSize * 1}" height="${pixelSize * 1}" fill="${color}"/>
     <rect x="${pixelSize * 9}" y="${pixelSize * 7}" width="${pixelSize * 1}" height="${pixelSize * 1}" fill="${color}"/>`
  ];
  
  return styles[style] || styles[0];
};

// Mouth styles
const renderMouth = (style: number, pixelSize: number): string => {
  const styles = [
    // Style 0: Smile
    `<rect x="${pixelSize * 6}" y="${pixelSize * 10}" width="${pixelSize * 4}" height="${pixelSize * 1}" fill="#8b4513"/>
     <rect x="${pixelSize * 5}" y="${pixelSize * 11}" width="${pixelSize * 6}" height="${pixelSize * 1}" fill="#8b4513"/>`,
    
    // Style 1: Neutral
    `<rect x="${pixelSize * 6}" y="${pixelSize * 10}" width="${pixelSize * 4}" height="${pixelSize * 1}" fill="#8b4513"/>`,
    
    // Style 2: Surprised
    `<rect x="${pixelSize * 7}" y="${pixelSize * 10}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="#8b4513"/>`
  ];
  
  return styles[style] || styles[0];
};

// Accessories
const renderGlasses = (pixelSize: number): string => {
  return `<rect x="${pixelSize * 4}" y="${pixelSize * 5}" width="${pixelSize * 8}" height="${pixelSize * 3}" fill="none" stroke="#333" stroke-width="${pixelSize * 0.5}"/>
          <rect x="${pixelSize * 4}" y="${pixelSize * 6}" width="${pixelSize * 3}" height="${pixelSize * 1}" fill="#87ceeb" opacity="0.3"/>
          <rect x="${pixelSize * 9}" y="${pixelSize * 6}" width="${pixelSize * 3}" height="${pixelSize * 1}" fill="#87ceeb" opacity="0.3"/>`;
};

const renderHat = (color: string, pixelSize: number): string => {
  return `<rect x="${pixelSize * 2}" y="${pixelSize * 1}" width="${pixelSize * 12}" height="${pixelSize * 2}" fill="${color}"/>
          <rect x="${pixelSize * 1}" y="${pixelSize * 2}" width="${pixelSize * 14}" height="${pixelSize * 1}" fill="${color}"/>`;
};

// Clothing styles
const renderClothing = (style: number, color: string, pixelSize: number): string => {
  const styles = [
    // Style 0: T-shirt
    `<rect x="${pixelSize * 3}" y="${pixelSize * 12}" width="${pixelSize * 10}" height="${pixelSize * 4}" fill="${color}"/>
     <rect x="${pixelSize * 2}" y="${pixelSize * 13}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 12}" y="${pixelSize * 13}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>`,
    
    // Style 1: Hoodie
    `<rect x="${pixelSize * 3}" y="${pixelSize * 12}" width="${pixelSize * 10}" height="${pixelSize * 4}" fill="${color}"/>
     <rect x="${pixelSize * 2}" y="${pixelSize * 13}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 12}" y="${pixelSize * 13}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 4}" y="${pixelSize * 11}" width="${pixelSize * 8}" height="${pixelSize * 1}" fill="${color}"/>`,
    
    // Style 2: Suit
    `<rect x="${pixelSize * 4}" y="${pixelSize * 12}" width="${pixelSize * 8}" height="${pixelSize * 4}" fill="${color}"/>
     <rect x="${pixelSize * 3}" y="${pixelSize * 13}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 11}" y="${pixelSize * 13}" width="${pixelSize * 2}" height="${pixelSize * 2}" fill="${color}"/>
     <rect x="${pixelSize * 6}" y="${pixelSize * 12}" width="${pixelSize * 4}" height="${pixelSize * 1}" fill="#ffffff"/>`
  ];
  
  return styles[style] || styles[0];
};

export const PixelArtAvatar = ({ seed = 'default', size = 64, className = '' }: PixelArtAvatarProps) => {
  const avatarSvg = useMemo(() => {
    const config = generateAvatarConfig(seed);
    return renderPixelAvatar(config, size);
  }, [seed, size]);

  return (
    <div 
      className={`inline-block ${className}`}
      dangerouslySetInnerHTML={{ __html: avatarSvg }}
    />
  );
};

// Export the config generator for use in profile management
export { generateAvatarConfig };
