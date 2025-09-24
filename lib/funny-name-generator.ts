'use client';

// Web3, Stellar, and Trustless Work themed word lists
const WEB3_WORDS = [
  'Crypto', 'Blockchain', 'DeFi', 'NFT', 'DAO', 'Web3', 'Smart', 'Contract',
  'Token', 'Protocol', 'Consensus', 'Hash', 'Merkle', 'Genesis', 'Fork',
  'Mining', 'Staking', 'Yield', 'Liquidity', 'Governance', 'Validator',
  'Node', 'Peer', 'Distributed', 'Immutable', 'Transparent', 'Decentralized',
  'Permissionless', 'Trustless', 'Composable', 'Interoperable', 'Scalable',
  'Atomic', 'Cross-chain', 'Layer', 'Bridge', 'Oracle', 'Relayer'
];

const STELLAR_WORDS = [
  'Stellar', 'Lumen', 'Horizon', 'Anchor', 'Federation', 'Memo', 'Asset',
  'Payment', 'Transaction', 'Account', 'Balance', 'Trust', 'Issuer',
  'Path', 'Payment', 'Operation', 'Sequence', 'Fee', 'Threshold',
  'Signer', 'Weight', 'Multi-sig', 'Inflation', 'Pool', 'Swap',
  'Liquidity', 'Yield', 'Farm', 'Vault', 'Bridge', 'Cross-chain',
  'Interstellar', 'Cosmic', 'Galaxy', 'Nebula', 'Quasar', 'Pulsar',
  'Constellation', 'Orbit', 'Gravity', 'Light', 'Speed', 'Quantum'
];

const TRUSTLESS_WORDS = [
  'Trustless', 'Escrow', 'Milestone', 'Dispute', 'Resolution', 'Arbitration',
  'Consensus', 'Voting', 'Governance', 'Transparent', 'Immutable', 'Secure',
  'Decentralized', 'Peer-to-peer', 'Direct', 'Automated', 'Smart',
  'Contract', 'Execution', 'Completion', 'Verification', 'Proof', 'Work',
  'Task', 'Project', 'Freelance', 'Gig', 'Marketplace', 'Platform',
  'Service', 'Provider', 'Client', 'Worker', 'Employer', 'Collaboration',
  'Cooperation', 'Partnership', 'Agreement', 'Terms', 'Conditions',
  'Payment', 'Release', 'Fund', 'Deposit', 'Withdraw', 'Transfer'
];

const TECH_WORDS = [
  'Digital', 'Virtual', 'Cyber', 'Quantum', 'Neural', 'AI', 'Machine',
  'Learning', 'Algorithm', 'Data', 'Analytics', 'Cloud', 'Edge',
  'Serverless', 'Microservice', 'API', 'REST', 'GraphQL', 'Database',
  'Cache', 'Redis', 'MongoDB', 'PostgreSQL', 'Elasticsearch', 'Kafka',
  'Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'Git', 'GitHub', 'GitLab',
  'Jenkins', 'Terraform', 'Ansible', 'Monitoring', 'Logging', 'Metrics',
  'Alerting', 'Dashboard', 'Visualization', 'Reporting', 'Testing',
  'Unit', 'Integration', 'E2E', 'Performance', 'Security', 'Audit'
];

const CREATIVE_WORDS = [
  'Nexus', 'Prime', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Omega', 'Sigma',
  'Phoenix', 'Dragon', 'Tiger', 'Eagle', 'Falcon', 'Wolf', 'Bear',
  'Lion', 'Panther', 'Jaguar', 'Cheetah', 'Lynx', 'Fox', 'Raven',
  'Crow', 'Hawk', 'Owl', 'Swan', 'Dove', 'Robin', 'Cardinal',
  'Fire', 'Ice', 'Storm', 'Thunder', 'Lightning', 'Wind', 'Rain',
  'Snow', 'Frost', 'Flame', 'Spark', 'Glow', 'Shine', 'Bright',
  'Dark', 'Shadow', 'Mystery', 'Secret', 'Hidden', 'Ancient', 'Legend'
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

// Generate a funny name from seed
export const generateFunnyName = (seed: string): string => {
  const seedNum = generateSeed(seed);
  
  // Combine all word lists
  const allWords = [
    ...WEB3_WORDS,
    ...STELLAR_WORDS,
    ...TRUSTLESS_WORDS,
    ...TECH_WORDS,
    ...CREATIVE_WORDS
  ];
  
  // Generate two random words
  const word1Index = Math.floor(seededRandom(seedNum, 1) * allWords.length);
  const word2Index = Math.floor(seededRandom(seedNum, 2) * allWords.length);
  
  const word1 = allWords[word1Index];
  const word2 = allWords[word2Index];
  
  // Ensure we don't get the same word twice
  if (word1 === word2) {
    const newIndex = (word2Index + 1) % allWords.length;
    return `${word1} ${allWords[newIndex]}`;
  }
  
  return `${word1} ${word2}`;
};

// Generate multiple name options
export const generateNameOptions = (seed: string, count: number = 5): string[] => {
  const options: string[] = [];
  const seedNum = generateSeed(seed);
  
  for (let i = 0; i < count; i++) {
    const name = generateFunnyName(seed + i.toString());
    if (!options.includes(name)) {
      options.push(name);
    }
  }
  
  return options;
};

// Get a random name from a specific category
export const generateCategoryName = (seed: string, category: 'web3' | 'stellar' | 'trustless' | 'tech' | 'creative'): string => {
  const seedNum = generateSeed(seed);
  let wordList: string[];
  
  switch (category) {
    case 'web3':
      wordList = WEB3_WORDS;
      break;
    case 'stellar':
      wordList = STELLAR_WORDS;
      break;
    case 'trustless':
      wordList = TRUSTLESS_WORDS;
      break;
    case 'tech':
      wordList = TECH_WORDS;
      break;
    case 'creative':
      wordList = CREATIVE_WORDS;
      break;
    default:
      wordList = [...WEB3_WORDS, ...STELLAR_WORDS, ...TRUSTLESS_WORDS];
  }
  
  const word1Index = Math.floor(seededRandom(seedNum, 1) * wordList.length);
  const word2Index = Math.floor(seededRandom(seedNum, 2) * wordList.length);
  
  const word1 = wordList[word1Index];
  const word2 = wordList[word2Index];
  
  if (word1 === word2) {
    const newIndex = (word2Index + 1) % wordList.length;
    return `${word1} ${wordList[newIndex]}`;
  }
  
  return `${word1} ${word2}`;
};

// Export word lists for other uses
export { WEB3_WORDS, STELLAR_WORDS, TRUSTLESS_WORDS, TECH_WORDS, CREATIVE_WORDS };
