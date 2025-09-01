export interface NewsArticle {
  id: string
  title: string
  description: string
  image: string
  link: string
  type: 'youtube' | 'medium'
  category: string
  demo: string
  date: string
  readTime: string
  tags: string[]
}

export const nexusNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Revolutionizing Escrow: How Trustless Work is Changing the Game',
    description: 'Discover how smart contract-powered escrow systems are transforming traditional payment methods and creating a new standard for trustless transactions.',
    image: '/images/news/escrow-revolution.jpg',
    link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    type: 'youtube',
    category: 'Technology',
    demo: 'Hello Milestone Demo',
    date: '2024-01-15',
    readTime: '8 min',
    tags: ['Escrow', 'Smart Contracts', 'Trustless Work', 'Stellar']
  },
  {
    id: '2',
    title: 'The Future of Dispute Resolution: AI-Powered Arbitration on Stellar',
    description: 'Explore how automated dispute resolution systems are making conflict resolution faster, fairer, and more transparent than ever before.',
    image: '/images/news/dispute-resolution.jpg',
    link: 'https://medium.com/@stellar/dispute-resolution-future',
    type: 'medium',
    category: 'Innovation',
    demo: 'Dispute Resolution Demo',
    date: '2024-01-12',
    readTime: '12 min',
    tags: ['Dispute Resolution', 'AI', 'Arbitration', 'Automation']
  },
  {
    id: '3',
    title: 'Multi-Stakeholder Governance: The New Standard for Project Management',
    description: 'Learn how multi-voting systems are democratizing project governance and ensuring all stakeholders have a voice in critical decisions.',
    image: '/images/news/governance.jpg',
    link: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    type: 'youtube',
    category: 'Governance',
    demo: 'Milestone Voting Demo',
    date: '2024-01-10',
    readTime: '10 min',
    tags: ['Governance', 'Voting', 'Democracy', 'Stakeholders']
  },
  {
    id: '4',
    title: 'Gig Economy 2.0: Trustless Micro-Task Marketplaces',
    description: 'See how decentralized platforms are revolutionizing the gig economy with transparent, fair, and automated task management systems.',
    image: '/images/news/gig-economy.jpg',
    link: 'https://medium.com/@stellar/gig-economy-2-0',
    type: 'medium',
    category: 'Economy',
    demo: 'Micro Task Marketplace Demo',
    date: '2024-01-08',
    readTime: '15 min',
    tags: ['Gig Economy', 'Micro Tasks', 'Marketplace', 'Decentralized']
  }
]

export const nexusBlog: NewsArticle[] = [
  {
    id: '5',
    title: 'Building Trustless Escrow Systems: A Developer\'s Guide',
    description: 'Step-by-step tutorial on implementing secure escrow systems using Trustless Work technology and the Stellar blockchain.',
    image: '/images/blog/developer-guide.jpg',
    link: 'https://medium.com/@stellar/developer-guide-escrow',
    type: 'medium',
    category: 'Development',
    demo: 'Hello Milestone Demo',
    date: '2024-01-14',
    readTime: '20 min',
    tags: ['Development', 'Tutorial', 'Smart Contracts', 'Code']
  },
  {
    id: '6',
    title: 'Smart Contract Arbitration: Code is Law',
    description: 'Deep dive into how smart contracts are automating legal processes and creating a new paradigm for digital dispute resolution.',
    image: '/images/blog/smart-contracts.jpg',
    link: 'https://www.youtube.com/watch?v=3JluqTojuME',
    type: 'youtube',
    category: 'Technology',
    demo: 'Dispute Resolution Demo',
    date: '2024-01-11',
    readTime: '25 min',
    tags: ['Smart Contracts', 'Legal Tech', 'Automation', 'Law']
  },
  {
    id: '7',
    title: 'Democratizing Project Governance with Blockchain',
    description: 'How blockchain technology is enabling transparent and democratic decision-making processes in project management.',
    image: '/images/blog/governance-blockchain.jpg',
    link: 'https://medium.com/@stellar/democratizing-governance',
    type: 'medium',
    category: 'Governance',
    demo: 'Milestone Voting Demo',
    date: '2024-01-09',
    readTime: '18 min',
    tags: ['Governance', 'Blockchain', 'Democracy', 'Transparency']
  },
  {
    id: '8',
    title: 'The Rise of Decentralized Freelancing Platforms',
    description: 'Exploring the future of work through decentralized platforms that eliminate intermediaries and empower workers.',
    image: '/images/blog/freelancing.jpg',
    link: 'https://www.youtube.com/watch?v=2Z4m4lnjxkY',
    type: 'youtube',
    category: 'Future of Work',
    demo: 'Micro Task Marketplace Demo',
    date: '2024-01-07',
    readTime: '22 min',
    tags: ['Freelancing', 'Decentralized', 'Future of Work', 'Platforms']
  }
]

export function getNewsByDemo(demoName: string): NewsArticle[] {
  return [...nexusNews, ...nexusBlog].filter(article => article.demo === demoName)
}

export function getLatestNews(count: number = 4): NewsArticle[] {
  return [...nexusNews, ...nexusBlog]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)
}
