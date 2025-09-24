// Funny name generator for Web3/Stellar/Trustless themes
export const generateFunnyName = (): string => {
  const prefixes = [
    // Web3 & Crypto
    'Crypto', 'DeFi', 'Web3', 'Blockchain', 'Smart', 'Decentralized', 'Trustless', 'Immutable',
    'Hash', 'Merkle', 'Consensus', 'Validator', 'Miner', 'Node', 'Protocol', 'Token',
    
    // Stellar specific
    'Stellar', 'Lumen', 'Horizon', 'Anchors', 'Federation', 'MultiSig', 'XLM', 'StellarX',
    'Cosmic', 'Galactic', 'Nebula', 'Quasar', 'Pulsar', 'Stellaris', 'Luminary', 'Astro',
    
    // Trustless Work
    'Trustless', 'Escrow', 'Milestone', 'Dispute', 'Arbitration', 'Consensus', 'Governance',
    'Autonomous', 'Decentralized', 'Peer', 'Distributed', 'Collaborative', 'Transparent',
    
    // Tech & Fun
    'Pixel', 'Byte', 'Code', 'Bug', 'Stack', 'Queue', 'Cache', 'Buffer', 'Thread', 'Process',
    'Quantum', 'Neural', 'Digital', 'Virtual', 'Cyber', 'Meta', 'Nano', 'Micro', 'Macro',
  ];

  const suffixes = [
    // Web3 & Crypto
    'Builder', 'Hacker', 'Dev', 'Architect', 'Engineer', 'Wizard', 'Master', 'Guru',
    'Ninja', 'Samurai', 'Warrior', 'Knight', 'Guardian', 'Protector', 'Sage', 'Oracle',
    
    // Stellar specific
    'Navigator', 'Explorer', 'Pioneer', 'Captain', 'Commander', 'Pilot', 'Astronaut',
    'Cosmonaut', 'Voyager', 'Discoverer', 'Adventurer', 'Traveler', 'Wanderer', 'Seeker',
    
    // Trustless Work
    'Worker', 'Creator', 'Maker', 'Builder', 'Craftsman', 'Artisan', 'Innovator',
    'Pioneer', 'Trailblazer', 'Visionary', 'Dreamer', 'Thinker', 'Solver', 'Optimizer',
    
    // Fun & Creative
    'Pixel', 'Sprite', 'Byte', 'Bit', 'Nibble', 'Chunk', 'Block', 'Chain', 'Link',
    'Node', 'Edge', 'Vertex', 'Point', 'Vector', 'Matrix', 'Array', 'List', 'Stack',
    'Queue', 'Tree', 'Graph', 'Hash', 'Key', 'Value', 'Pair', 'Tuple', 'Set', 'Map',
  ];

  // Get random prefix and suffix
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  // Sometimes add a number for uniqueness
  const shouldAddNumber = Math.random() < 0.3;
  const number = shouldAddNumber ? Math.floor(Math.random() * 999) + 1 : '';

  return `${prefix}${suffix}${number}`;
};

// Generate multiple names for selection
export const generateNameOptions = (count: number = 5): string[] => {
  const names = new Set<string>();
  
  while (names.size < count) {
    names.add(generateFunnyName());
  }
  
  return Array.from(names);
};

// Special themed name generators
export const generateStellarName = (): string => {
  const stellarPrefixes = [
    'Stellar', 'Lumen', 'Horizon', 'Cosmic', 'Galactic', 'Nebula', 'Quasar', 'Pulsar',
    'Astro', 'Lunar', 'Solar', 'Orbit', 'Gravity', 'Magnetic', 'Radiation', 'Spectrum'
  ];
  
  const stellarSuffixes = [
    'Navigator', 'Explorer', 'Pioneer', 'Captain', 'Commander', 'Pilot', 'Astronaut',
    'Voyager', 'Discoverer', 'Adventurer', 'Traveler', 'Wanderer', 'Seeker', 'Guardian'
  ];
  
  const prefix = stellarPrefixes[Math.floor(Math.random() * stellarPrefixes.length)];
  const suffix = stellarSuffixes[Math.floor(Math.random() * stellarSuffixes.length)];
  
  return `${prefix}${suffix}${Math.random() < 0.2 ? Math.floor(Math.random() * 99) + 1 : ''}`;
};

export const generateWeb3Name = (): string => {
  const web3Prefixes = [
    'Crypto', 'DeFi', 'Web3', 'Blockchain', 'Smart', 'Decentralized', 'Trustless',
    'Hash', 'Merkle', 'Consensus', 'Validator', 'Protocol', 'Token', 'NFT'
  ];
  
  const web3Suffixes = [
    'Builder', 'Hacker', 'Dev', 'Architect', 'Engineer', 'Wizard', 'Master',
    'Ninja', 'Samurai', 'Warrior', 'Guardian', 'Oracle', 'Prophet', 'Sage'
  ];
  
  const prefix = web3Prefixes[Math.floor(Math.random() * web3Prefixes.length)];
  const suffix = web3Suffixes[Math.floor(Math.random() * web3Suffixes.length)];
  
  return `${prefix}${suffix}${Math.random() < 0.2 ? Math.floor(Math.random() * 99) + 1 : ''}`;
};

export const generateTrustlessName = (): string => {
  const trustlessPrefixes = [
    'Trustless', 'Escrow', 'Milestone', 'Dispute', 'Arbitration', 'Consensus',
    'Autonomous', 'Decentralized', 'Peer', 'Distributed', 'Collaborative', 'Transparent'
  ];
  
  const trustlessSuffixes = [
    'Worker', 'Creator', 'Maker', 'Builder', 'Craftsman', 'Artisan', 'Innovator',
    'Pioneer', 'Trailblazer', 'Visionary', 'Dreamer', 'Thinker', 'Solver', 'Optimizer'
  ];
  
  const prefix = trustlessPrefixes[Math.floor(Math.random() * trustlessPrefixes.length)];
  const suffix = trustlessSuffixes[Math.floor(Math.random() * trustlessSuffixes.length)];
  
  return `${prefix}${suffix}${Math.random() < 0.2 ? Math.floor(Math.random() * 99) + 1 : ''}`;
};
