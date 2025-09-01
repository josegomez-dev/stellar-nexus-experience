const prefixes = [
  'Cyber', 'Neo', 'Crypto', 'Block', 'Chain', 'DeFi', 'Web3', 'Meta', 'Quantum', 'Neural',
  'Digital', 'Virtual', 'Smart', 'Hyper', 'Ultra', 'Mega', 'Super', 'Alpha', 'Beta', 'Gamma',
  'Delta', 'Omega', 'Sigma', 'Lambda', 'Theta', 'Zeta', 'Epsilon', 'Phi', 'Psi', 'Chi',
  'Nova', 'Vega', 'Orion', 'Atlas', 'Titan', 'Zeus', 'Apollo', 'Hermes', 'Ares', 'Dionysus',
  'Hades', 'Poseidon', 'Hera', 'Athena', 'Artemis', 'Aphrodite', 'Demeter', 'Hestia', 'Hecate', 'Nyx'
]

const suffixes = [
  'Dev', 'Coder', 'Hacker', 'Builder', 'Creator', 'Architect', 'Wizard', 'Ninja', 'Sage', 'Guru',
  'Master', 'Lord', 'King', 'Queen', 'Prince', 'Princess', 'Knight', 'Warrior', 'Mage', 'Sorcerer',
  'Alchemist', 'Engineer', 'Scientist', 'Technician', 'Specialist', 'Expert', 'Pro', 'Elite', 'Legend', 'Hero',
  'Villain', 'Antihero', 'Outlaw', 'Rebel', 'Revolutionary', 'Innovator', 'Pioneer', 'Trailblazer', 'Visionary', 'Prophet'
]

const techWords = [
  'Protocol', 'Network', 'System', 'Platform', 'Framework', 'Library', 'API', 'SDK', 'Toolkit', 'Suite',
  'Engine', 'Core', 'Hub', 'Node', 'Gateway', 'Bridge', 'Router', 'Switch', 'Firewall', 'Proxy',
  'Cache', 'Database', 'Storage', 'Cloud', 'Server', 'Client', 'Agent', 'Bot', 'AI', 'ML',
  'Blockchain', 'Token', 'Coin', 'NFT', 'DeFi', 'DAO', 'DApp', 'SmartContract', 'Wallet', 'Exchange'
]

const connectors = [
  'X', 'Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Alpha', 'Beta', 'Gamma', 'Delta', 'Prime', 'Pro', 'Plus', 'Max', 'Ultra', 'Mega',
  'Cyber', 'Digital', 'Virtual', 'Meta', 'Neo', 'Hyper', 'Super', 'Ultra', 'Mega', 'Giga'
]

export function generateWeb3Name(includeNumber: boolean = true): string {
  const patterns = [
    // Pattern 1: Prefix + Suffix
    () => `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
    // Pattern 2: Tech Word + Suffix
    () => `${techWords[Math.floor(Math.random() * techWords.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
    // Pattern 3: Prefix + Tech Word
    () => `${prefixes[Math.floor(Math.random() * prefixes.length)]}${techWords[Math.floor(Math.random() * techWords.length)]}`,
    // Pattern 4: Tech Word + Connector + Suffix
    () => `${techWords[Math.floor(Math.random() * techWords.length)]}${connectors[Math.floor(Math.random() * connectors.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`,
    // Pattern 5: Prefix + Connector + Tech Word
    () => `${prefixes[Math.floor(Math.random() * prefixes.length)]}${connectors[Math.floor(Math.random() * connectors.length)]}${techWords[Math.floor(Math.random() * techWords.length)]}`
  ]

  const pattern = patterns[Math.floor(Math.random() * patterns.length)]
  let name = pattern()

  if (includeNumber && Math.random() > 0.5) {
    const number = Math.floor(Math.random() * 999) + 1
    name += number.toString()
  }

  return name
}

export function generateMultipleNames(count: number, includeNumber: boolean = true): string[] {
  const names: string[] = []
  const usedNames = new Set<string>()

  while (names.length < count) {
    const name = generateWeb3Name(includeNumber)
    if (!usedNames.has(name)) {
      usedNames.add(name)
      names.push(name)
    }
  }

  return names
}
