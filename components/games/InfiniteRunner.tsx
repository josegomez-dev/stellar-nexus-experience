'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from '@/contexts/auth/AccountContext';
import { useToast } from '@/contexts/ui/ToastContext';
import { accountService } from '@/lib/services/account-service';
import Image from 'next/image';

interface InfiniteRunnerProps {
  gameId: string;
  gameTitle: string;
  embedded?: boolean; // Whether game is embedded in another page
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'bird' | 'rock' | 'blockchain' | 'crypto' | 'drone' | 'satellite' | 'meteor';
  verticalSpeed?: number; // For moving enemies
  amplitude?: number; // For wave motion
  phase?: number; // For wave motion offset
}

interface Coin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

type GameState = 'ready' | 'playing' | 'paused' | 'gameOver';

const InfiniteRunner: React.FC<InfiniteRunnerProps> = ({ gameId, gameTitle, embedded = false }) => {
  const router = useRouter();
  const { account } = useAccount();
  const { addToast } = useToast();

  // Client-side only check
  const [isMounted, setIsMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(false); // For collapsible controls

  // Game state
  const [gameState, setGameState] = useState<GameState>('ready');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [xpEarned, setXpEarned] = useState(0);
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);

  // Player state
  const [playerY, setPlayerY] = useState(300);
  const [playerVelocity, setPlayerVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const [jumpCount, setJumpCount] = useState(0); // For double jump

  // Game speed
  const [gameSpeed, setGameSpeed] = useState(5);
  const [baseSpeed, setBaseSpeed] = useState(5);

  // Obstacles and coins
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);

  // Background
  const [bgOffset, setBgOffset] = useState(0);
  const [theme, setTheme] = useState<'day' | 'sunset' | 'night' | 'cyber'>('day');

  // Web3 Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [lastLevelUpScore, setLastLevelUpScore] = useState(0);
  const [invulnerableUntil, setInvulnerableUntil] = useState(0); // Timestamp for invulnerability

  // Refs
  const gameLoopRef = useRef<number>();
  const obstacleIdRef = useRef(0);
  const coinIdRef = useRef(0);
  const lastObstacleRef = useRef(0);
  const lastCoinRef = useRef(0);
  const levelTimerRef = useRef(0);

  // Constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const DOUBLE_JUMP_FORCE = -11; // Slightly less powerful second jump
  const GROUND_Y = 300;
  const PLAYER_X = 100;
  const PLAYER_WIDTH = 50;
  const PLAYER_HEIGHT = 50;
  const DUCKING_HEIGHT = 30;
  const MAX_JUMPS = 2; // Allow double jump

  // Web3 Quiz Questions
  const quizQuestions = [
    {
      question: "What is a blockchain?",
      options: [
        "A type of cryptocurrency",
        "A distributed ledger technology",
        "A cloud storage service",
        "A social media platform"
      ],
      correctAnswer: 1,
      explanation: "A blockchain is a distributed ledger technology that records transactions across multiple computers."
    },
    {
      question: "What does 'DeFi' stand for?",
      options: [
        "Digital Finance",
        "Decentralized Finance",
        "Defined Finance",
        "Delegated Finance"
      ],
      correctAnswer: 1,
      explanation: "DeFi stands for Decentralized Finance, which refers to financial services built on blockchain."
    },
    {
      question: "What is a smart contract?",
      options: [
        "A legal document",
        "Self-executing code on blockchain",
        "A trading bot",
        "A wallet app"
      ],
      correctAnswer: 1,
      explanation: "A smart contract is self-executing code that runs on a blockchain when conditions are met."
    },
    {
      question: "What is the purpose of a wallet in crypto?",
      options: [
        "To mine cryptocurrency",
        "To store and manage private keys",
        "To validate transactions",
        "To create new tokens"
      ],
      correctAnswer: 1,
      explanation: "A crypto wallet stores and manages your private keys, allowing you to control your assets."
    },
    {
      question: "What does 'gas fee' refer to?",
      options: [
        "Mining reward",
        "Transaction cost on blockchain",
        "Staking reward",
        "Exchange fee"
      ],
      correctAnswer: 1,
      explanation: "Gas fees are the transaction costs paid to validators/miners for processing blockchain transactions."
    }
  ];

  // Theme colors based on level
  const themes = {
    day: {
      bg: 'from-blue-400 via-cyan-300 to-blue-500',
      ground: 'fill-green-600',
      accent: 'fill-green-800',
    },
    sunset: {
      bg: 'from-orange-400 via-pink-400 to-purple-500',
      ground: 'fill-orange-600',
      accent: 'fill-orange-800',
    },
    night: {
      bg: 'from-indigo-900 via-purple-900 to-black',
      ground: 'fill-gray-700',
      accent: 'fill-gray-900',
    },
    cyber: {
      bg: 'from-cyan-500 via-purple-600 to-pink-600',
      ground: 'fill-purple-800',
      accent: 'fill-pink-900',
    },
  };

  // Save game progress
  const saveGameProgress = useCallback(async (finalScore: number, finalLevel: number, earnedXP: number) => {
    if (!account || progressSaved || isSavingProgress || earnedXP <= 0) {
      return;
    }

    setIsSavingProgress(true);

    try {
      // Calculate points: 1 point per 10 score
      const pointsEarned = Math.floor(finalScore / 10);
      
      // Save to account
      await accountService.addExperienceAndPoints(account.id, earnedXP, pointsEarned);
      
      setProgressSaved(true);
      
      addToast({
        type: 'success',
        title: '💾 Progress Saved!',
        message: `Earned ${earnedXP} XP and ${pointsEarned} points!`,
        duration: 5000,
      });
    } catch (error) {
      console.error('Failed to save game progress:', error);
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save your progress. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsSavingProgress(false);
    }
  }, [account, progressSaved, isSavingProgress, addToast]);

  // Client-side only mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Disable scrolling when game is active
  useEffect(() => {
    if (gameState === 'playing') {
      // Disable scroll
      document.body.style.overflow = 'hidden';
      
      // Prevent arrow key scrolling
      const preventScroll = (e: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
          e.preventDefault();
        }
      };
      
      window.addEventListener('keydown', preventScroll);
      
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', preventScroll);
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [gameState]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Enter fullscreen on game start
  const enterFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setXpEarned(0);
    setProgressSaved(false);
    setIsSavingProgress(false);
    setPlayerY(GROUND_Y);
    setPlayerVelocity(0);
    setIsJumping(false);
    setIsDucking(false);
    setJumpCount(0);
    setGameSpeed(5);
    setBaseSpeed(5);
    setObstacles([]);
    setCoins([]);
    setBgOffset(0);
    setTheme('day');
    setLastLevelUpScore(0);
    obstacleIdRef.current = 0;
    coinIdRef.current = 0;
    lastObstacleRef.current = 0;
    lastCoinRef.current = 0;
    levelTimerRef.current = 0;
    
    // Give player 5 seconds of invulnerability at start
    setInvulnerableUntil(Date.now() + 5000);
    
    // Don't auto-enter fullscreen - let user choose with button
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key for pause/resume in any state
      if (e.code === 'Escape' && (gameState === 'playing' || gameState === 'paused')) {
        setGameState(gameState === 'paused' ? 'playing' : 'paused');
        return;
      }

      if (gameState !== 'playing') {
        if (e.code === 'Space' && gameState === 'ready') {
          startGame();
        }
        return;
      }

      switch (e.code) {
        case 'Space':
        case 'ArrowUp':
          // Allow double jump
          if (jumpCount < MAX_JUMPS) {
            if (jumpCount === 0) {
              setPlayerVelocity(JUMP_FORCE);
              setIsJumping(true);
            } else {
              // Double jump with visual feedback
              setPlayerVelocity(DOUBLE_JUMP_FORCE);
            }
            setJumpCount(prev => prev + 1);
          }
          break;
        case 'ArrowDown':
          setIsDucking(true);
          break;
        case 'ArrowRight':
          setGameSpeed(Math.min(baseSpeed * 1.5, 15));
          break;
        case 'ArrowLeft':
          setGameSpeed(Math.max(baseSpeed * 0.5, 2));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowDown':
          setIsDucking(false);
          break;
        case 'ArrowRight':
        case 'ArrowLeft':
          setGameSpeed(baseSpeed);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, isJumping, playerY, baseSpeed, startGame]);

  // Main game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const gameLoop = () => {
      // Update player physics
      setPlayerVelocity(v => v + GRAVITY);
      setPlayerY(y => {
        const newY = y + playerVelocity;
        if (newY >= GROUND_Y) {
          setIsJumping(false);
          setJumpCount(0); // Reset jump count when landing
          return GROUND_Y;
        }
        return newY;
      });

      // Update background
      setBgOffset(offset => (offset + gameSpeed) % 1000);

      // Update score
      setScore(s => {
        const newScore = s + 1;
        
        // Level up every 1000 points
        if (newScore > 0 && newScore % 1000 === 0 && newScore !== lastLevelUpScore) {
          setLastLevelUpScore(newScore);
          
          // Pause game and show quiz
          setTimeout(() => {
            setGameState('paused');
            setShowQuiz(true);
            setCurrentQuestion(Math.floor(Math.random() * quizQuestions.length));
            setQuizAnswered(false);
          }, 100);
        }
        
        return newScore;
      });

      // Spawn obstacles (but not during invulnerability period)
      const isInvulnerable = Date.now() < invulnerableUntil;
      
      lastObstacleRef.current += 1;
      const obstacleInterval = Math.max(60 - level * 5, 30);
      if (lastObstacleRef.current > obstacleInterval && !isInvulnerable) {
        lastObstacleRef.current = 0;
        const obstacleTypes: Obstacle['type'][] = ['cactus', 'rock'];
        
        // Add new obstacle types at higher levels
        if (level >= 2) obstacleTypes.push('bird', 'blockchain', 'drone');
        if (level >= 3) obstacleTypes.push('crypto', 'satellite');
        if (level >= 4) obstacleTypes.push('meteor');

        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        const isFlying = type === 'bird' || type === 'drone' || type === 'satellite' || type === 'meteor';
        
        // Different heights and behaviors for different types
        let yPos = GROUND_Y;
        let verticalSpeed = 0;
        let amplitude = 0;
        
        if (type === 'bird') {
          yPos = GROUND_Y - 80 - Math.random() * 40;
          verticalSpeed = 0.5 + Math.random() * 0.5; // Slow wave motion
          amplitude = 15 + Math.random() * 10;
        } else if (type === 'drone') {
          yPos = GROUND_Y - 100 - Math.random() * 60;
          verticalSpeed = 1 + Math.random(); // Faster wave motion
          amplitude = 20 + Math.random() * 15;
        } else if (type === 'satellite') {
          yPos = GROUND_Y - 150 - Math.random() * 30;
          verticalSpeed = 0.3; // Slow, steady
          amplitude = 5;
        } else if (type === 'meteor') {
          yPos = GROUND_Y - 200 - Math.random() * 50;
          verticalSpeed = 2 + Math.random() * 2; // Fast diagonal
          amplitude = 30;
        }
        
        setObstacles(obs => [
          ...obs,
          {
            id: obstacleIdRef.current++,
            x: 800,
            y: yPos,
            width: type === 'blockchain' || type === 'crypto' ? 50 : type === 'satellite' ? 40 : 30,
            height: type === 'blockchain' || type === 'crypto' ? 50 : type === 'satellite' ? 40 : isFlying ? 30 : 40,
            type,
            verticalSpeed: isFlying ? verticalSpeed : 0,
            amplitude: isFlying ? amplitude : 0,
            phase: Math.random() * Math.PI * 2,
          },
        ]);
      }

      // Spawn coins
      lastCoinRef.current += 1;
      if (lastCoinRef.current > 100) {
        lastCoinRef.current = 0;
        setCoins(c => [
          ...c,
          {
            id: coinIdRef.current++,
            x: 800,
            y: GROUND_Y - 50 - Math.random() * 100,
            collected: false,
          },
        ]);
      }

      // Move obstacles with dynamic vertical movement
      setObstacles(obs =>
        obs
          .map(o => {
            let newY = o.y;
            
            // Apply wave motion to flying enemies
            if (o.verticalSpeed && o.amplitude && o.phase !== undefined) {
              const time = Date.now() / 1000;
              newY = o.y + Math.sin(time * o.verticalSpeed + o.phase) * o.amplitude;
              
              // Keep within bounds
              newY = Math.max(GROUND_Y - 220, Math.min(GROUND_Y - 50, newY));
            }
            
            return { ...o, x: o.x - gameSpeed, y: newY };
          })
          .filter(o => o.x > -100)
      );

      // Move coins
      setCoins(c =>
        c
          .map(coin => ({ ...coin, x: coin.x - gameSpeed }))
          .filter(coin => coin.x > -50)
      );

      // Check collisions with obstacles (skip if invulnerable)
      const isInvulnerableNow = Date.now() < invulnerableUntil;
      
      // Adjust hitbox when ducking - make it smaller and lower
      const playerWidth = isDucking ? PLAYER_WIDTH * 0.8 : PLAYER_WIDTH;
      const playerHeight = isDucking ? DUCKING_HEIGHT : PLAYER_HEIGHT;
      const playerTop = isDucking ? GROUND_Y - DUCKING_HEIGHT + 5 : playerY;
      const playerLeft = isDucking ? PLAYER_X + (PLAYER_WIDTH * 0.1) : PLAYER_X;
      
      const collision = !isInvulnerableNow && obstacles.some(obs => {
        const playerRight = playerLeft + playerWidth;
        const playerBottom = playerTop + playerHeight;
        const obsRight = obs.x + obs.width;
        const obsBottom = obs.y + obs.height;

        return (
          playerLeft < obsRight &&
          playerRight > obs.x &&
          playerTop < obsBottom &&
          playerBottom > obs.y
        );
      });

      if (collision) {
        setGameState('gameOver');
        if (score > highScore) {
          setHighScore(score);
        }
        // Calculate XP earned (1 XP per 10 score)
        const earnedXP = Math.floor(score / 10);
        setXpEarned(earnedXP);
        
        // Save progress automatically
        setTimeout(() => {
          saveGameProgress(score, level, earnedXP);
        }, 1000);
        
        return;
      }

      // Check coin collection (use adjusted hitbox for ducking)
      setCoins(c =>
        c.map(coin => {
          if (coin.collected) return coin;
          
          const playerWidth = isDucking ? PLAYER_WIDTH * 0.8 : PLAYER_WIDTH;
          const playerHeight = isDucking ? DUCKING_HEIGHT : PLAYER_HEIGHT;
          const playerTop = isDucking ? GROUND_Y - DUCKING_HEIGHT + 5 : playerY;
          const playerLeft = isDucking ? PLAYER_X + (PLAYER_WIDTH * 0.1) : PLAYER_X;
          
          const playerRight = playerLeft + playerWidth;
          const playerBottom = playerTop + playerHeight;
          const coinRight = coin.x + 20;
          const coinBottom = coin.y + 20;

          if (
            playerLeft < coinRight &&
            playerRight > coin.x &&
            playerTop < coinBottom &&
            playerBottom > coin.y
          ) {
            setScore(s => s + 50);
            return { ...coin, collected: true };
          }
          return coin;
        })
      );

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, playerVelocity, gameSpeed, obstacles, coins, isDucking, playerY, score, highScore, level, baseSpeed, addToast, saveGameProgress]);

  // Render obstacle with improved graphics
  const renderObstacle = (obs: Obstacle) => {
    const currentTheme = themes[theme];
    
    switch (obs.type) {
      case 'cactus':
        return (
          <g key={obs.id} transform={`translate(${obs.x}, ${obs.y})`}>
            {/* Main trunk */}
            <rect x="8" y="0" width="14" height={obs.height} className="fill-green-700" stroke="#2d5016" strokeWidth="1" />
            {/* Left arm */}
            <rect x="0" y="15" width="8" height="15" className="fill-green-700" stroke="#2d5016" strokeWidth="1" />
            <rect x="0" y="15" width="6" height="2" className="fill-green-600" />
            {/* Right arm */}
            <rect x="22" y="10" width="8" height="20" className="fill-green-700" stroke="#2d5016" strokeWidth="1" />
            <rect x="22" y="10" width="6" height="2" className="fill-green-600" />
            {/* Spikes */}
            {[...Array(6)].map((_, i) => (
              <line key={i} x1="8" y1={i * 6} x2="6" y2={i * 6 + 3} stroke="#2d5016" strokeWidth="1" />
            ))}
            {[...Array(6)].map((_, i) => (
              <line key={i} x1="22" y1={i * 6} x2="24" y2={i * 6 + 3} stroke="#2d5016" strokeWidth="1" />
            ))}
          </g>
        );
      case 'rock':
        return (
          <g key={obs.id} transform={`translate(${obs.x}, ${obs.y})`}>
            {/* Base rock */}
            <polygon
              points="15,0 30,35 25,40 5,40 0,35"
              className="fill-gray-600"
              stroke="#444"
              strokeWidth="2"
            />
            {/* Highlight */}
            <polygon
              points="15,5 25,35 10,35"
              className="fill-gray-500"
            />
            {/* Shadow */}
            <polygon
              points="15,20 25,35 20,40 10,40 5,35"
              className="fill-gray-700"
              opacity="0.5"
            />
            {/* Cracks */}
            <line x1="12" y1="15" x2="10" y2="25" stroke="#333" strokeWidth="1.5" />
            <line x1="18" y1="10" x2="20" y2="20" stroke="#333" strokeWidth="1.5" />
          </g>
        );
      case 'bird':
        return (
          <g key={obs.id} transform={`translate(${obs.x}, ${obs.y})`}>
            {/* Body */}
            <ellipse cx="15" cy="15" rx="15" ry="12" className="fill-red-600" stroke="#8B0000" strokeWidth="1" />
            {/* Wing flap animation */}
            <ellipse cx="8" cy="12" rx="8" ry="10" className="fill-red-700" opacity="0.9" 
              style={{ animation: 'flap 0.3s ease-in-out infinite alternate' }} />
            <ellipse cx="22" cy="12" rx="8" ry="10" className="fill-red-700" opacity="0.9"
              style={{ animation: 'flap 0.3s ease-in-out infinite alternate-reverse' }} />
            {/* Beak */}
            <polygon points="25,15 32,13 32,17" className="fill-yellow-500" stroke="#DAA520" strokeWidth="1" />
            {/* Eye */}
            <circle cx="20" cy="13" r="3" className="fill-white" />
            <circle cx="21" cy="13" r="1.5" className="fill-black" />
            {/* Tail feathers */}
            <polygon points="0,15 5,10 5,20" className="fill-red-800" />
          </g>
        );
      case 'blockchain':
        return (
          <g key={obs.id} transform={`translate(${obs.x}, ${obs.y})`}>
            {/* First block */}
            <rect x="0" y="0" width="20" height="20" className="fill-cyan-500" stroke="#00CED1" strokeWidth="2" rx="2" />
            <rect x="3" y="3" width="14" height="14" className="fill-cyan-400" opacity="0.5" rx="1" />
            <text x="10" y="14" textAnchor="middle" className="fill-white font-bold text-xs">B</text>
            
            {/* Second block */}
            <rect x="15" y="15" width="20" height="20" className="fill-purple-500" stroke="#8B00FF" strokeWidth="2" rx="2" />
            <rect x="18" y="18" width="14" height="14" className="fill-purple-400" opacity="0.5" rx="1" />
            <text x="25" y="29" textAnchor="middle" className="fill-white font-bold text-xs">L</text>
            
            {/* Third block */}
            <rect x="30" y="30" width="20" height="20" className="fill-pink-500" stroke="#FF1493" strokeWidth="2" rx="2" />
            <rect x="33" y="33" width="14" height="14" className="fill-pink-400" opacity="0.5" rx="1" />
            <text x="40" y="44" textAnchor="middle" className="fill-white font-bold text-xs">K</text>
            
            {/* Connection lines with glow */}
            <line x1="10" y1="10" x2="25" y2="25" stroke="#00FFFF" strokeWidth="3" opacity="0.8" />
            <line x1="10" y1="10" x2="25" y2="25" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="25" y1="25" x2="40" y2="40" stroke="#FF00FF" strokeWidth="3" opacity="0.8" />
            <line x1="25" y1="25" x2="40" y2="40" stroke="#FFFFFF" strokeWidth="1" />
          </g>
        );
      case 'crypto':
        return (
          <g key={obs.id} transform={`translate(${obs.x}, ${obs.y})`}>
            {/* Outer glow */}
            <circle cx="25" cy="25" r="27" className="fill-yellow-300" opacity="0.3" />
            {/* Main coin */}
            <circle cx="25" cy="25" r="25" className="fill-yellow-500" stroke="#FFA500" strokeWidth="3" />
            {/* Inner circle */}
            <circle cx="25" cy="25" r="22" className="fill-yellow-400" stroke="#FFD700" strokeWidth="2" />
            {/* Bitcoin symbol */}
            <text x="25" y="35" textAnchor="middle" className="fill-orange-600 font-bold" style={{ fontSize: '28px' }}>₿</text>
            {/* Shine effect */}
            <ellipse cx="18" cy="15" rx="8" ry="12" className="fill-white" opacity="0.3" />
          </g>
        );
      case 'drone':
        return (
          <g key={obs.id} transform={`translate(${obs.x}, ${obs.y})`}>
            {/* Main body */}
            <rect x="10" y="10" width="20" height="10" className="fill-gray-700" stroke="#555" strokeWidth="1" rx="2" />
            {/* Propeller arms */}
            <line x1="15" y1="15" x2="5" y2="5" stroke="#666" strokeWidth="2" />
            <line x1="25" y1="15" x2="35" y2="5" stroke="#666" strokeWidth="2" />
            <line x1="15" y1="15" x2="5" y2="25" stroke="#666" strokeWidth="2" />
            <line x1="25" y1="15" x2="35" y2="25" stroke="#666" strokeWidth="2" />
            {/* Propellers (spinning) */}
            <circle cx="5" cy="5" r="4" className="fill-red-500" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="0 5 5" to="360 5 5" dur="0.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="35" cy="5" r="4" className="fill-red-500" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="0 35 5" to="360 35 5" dur="0.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="5" cy="25" r="4" className="fill-red-500" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="0 5 25" to="360 5 25" dur="0.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="35" cy="25" r="4" className="fill-red-500" opacity="0.6">
              <animateTransform attributeName="transform" type="rotate" from="0 35 25" to="360 35 25" dur="0.2s" repeatCount="indefinite" />
            </circle>
            {/* Camera/sensor */}
            <circle cx="20" cy="15" r="3" className="fill-blue-400" />
          </g>
        );
      case 'satellite':
        return (
          <g key={obs.id} transform={`translate(${obs.x}, ${obs.y})`}>
            {/* Main body */}
            <rect x="15" y="10" width="20" height="20" className="fill-gray-600" stroke="#888" strokeWidth="1" />
            <rect x="18" y="13" width="14" height="14" className="fill-blue-300" opacity="0.3" />
            {/* Solar panels */}
            <rect x="0" y="15" width="15" height="10" className="fill-blue-900" stroke="#4169E1" strokeWidth="1" />
            <rect x="35" y="15" width="15" height="10" className="fill-blue-900" stroke="#4169E1" strokeWidth="1" />
            {/* Panel lines */}
            {[...Array(3)].map((_, i) => (
              <line key={`left-${i}`} x1={5 * i} y1="15" x2={5 * i} y2="25" stroke="#4169E1" strokeWidth="0.5" />
            ))}
            {[...Array(3)].map((_, i) => (
              <line key={`right-${i}`} x1={35 + 5 * i} y1="15" x2={35 + 5 * i} y2="25" stroke="#4169E1" strokeWidth="0.5" />
            ))}
            {/* Antenna */}
            <line x1="25" y1="10" x2="25" y2="0" stroke="#888" strokeWidth="1.5" />
            <circle cx="25" cy="0" r="2" className="fill-red-500" />
          </g>
        );
      case 'meteor':
        return (
          <g key={obs.id} transform={`translate(${obs.x}, ${obs.y})`}>
            {/* Meteor trail */}
            <ellipse cx="10" cy="15" rx="40" ry="8" className="fill-orange-500" opacity="0.3" />
            <ellipse cx="20" cy="15" rx="30" ry="6" className="fill-red-500" opacity="0.4" />
            {/* Main meteor */}
            <circle cx="40" cy="15" r="15" className="fill-gray-700" stroke="#555" strokeWidth="2" />
            <circle cx="40" cy="15" r="12" className="fill-gray-600" />
            {/* Craters */}
            <circle cx="35" cy="12" r="3" className="fill-gray-800" opacity="0.5" />
            <circle cx="43" cy="18" r="2" className="fill-gray-800" opacity="0.5" />
            <circle cx="42" cy="10" r="2.5" className="fill-gray-800" opacity="0.5" />
            {/* Fire effect */}
            <ellipse cx="50" cy="15" rx="8" ry="10" className="fill-orange-600" opacity="0.6">
              <animate attributeName="rx" values="8;10;8" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="53" cy="15" rx="5" ry="7" className="fill-yellow-500" opacity="0.7">
              <animate attributeName="rx" values="5;7;5" dur="0.2s" repeatCount="indefinite" />
            </ellipse>
          </g>
        );
    }
  };

  const currentTheme = themes[theme];

  // Prevent hydration issues - only render on client
  if (!isMounted) {
    return (
      <div className='relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
        <div className='text-white text-2xl'>Loading game...</div>
      </div>
    );
  }

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 w-screen h-screen z-50' : 'relative w-full h-full'} flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`}>
      {/* Fullscreen toggle button - Outside game frame, always visible */}
      {gameState === 'playing' && (
        <div className='w-full max-w-[1200px] px-4 mb-2 flex justify-end'>
          <button
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            className='px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl border-2 border-white/30 shadow-xl transition-all transform hover:scale-105 flex items-center gap-2'
          >
            <span className='text-xl'>{isFullscreen ? '⛶' : '⛶'}</span>
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}</span>
          </button>
        </div>
      )}
      
      {/* Arcade Machine Border & Game Canvas */}
      <div className='relative w-full h-full flex items-center justify-center p-4'>
        {/* Arcade Machine Frame */}
        <div className='relative max-w-[1200px] max-h-[700px] w-full h-full'>
          {/* Outer Frame - Wood texture */}
          <div className='absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 rounded-3xl shadow-2xl' 
               style={{ 
                 boxShadow: '0 0 0 8px #422006, 0 0 0 12px #78350f, inset 0 0 30px rgba(0,0,0,0.5), 0 20px 50px rgba(0,0,0,0.8)'
               }}>
          </div>
                    
          {/* CRT Screen Effect Border */}
          <div className='absolute inset-6 rounded-lg overflow-hidden'
               style={{
                 boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
                 border: '2px solid rgba(0,255,255,0.2)'
               }}>
            
            {/* Game Canvas */}
            <div className='relative w-full h-full flex items-center justify-center bg-black'>
        {/* Stats Overlay */}
        <div className='absolute top-4 left-4 right-20 flex justify-between items-start z-10'>
          <div className='bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl'>
            <div className='text-white font-bold text-2xl mb-1'>Score: {score}</div>
            <div className='text-white/80 text-sm'>High Score: {highScore}</div>
            <div className='text-cyan-400 text-sm font-semibold'>Level: {level}</div>
            {/* Invulnerability indicator */}
            {Date.now() < invulnerableUntil && (
              <div className='text-green-400 text-xs font-bold mt-2 animate-pulse'>
                🛡️ Safe Zone! {Math.ceil((invulnerableUntil - Date.now()) / 1000)}s
              </div>
            )}
          </div>
          
          <div className='bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl'>
            <div className='text-white/80 text-xs mb-2 font-semibold'>Controls:</div>
            <div className='text-white text-xs space-y-1'>
              <div>⬆️ SPACE/↑: Jump (x2!)</div>
              <div>⬇️ ↓: Duck</div>
              <div>➡️ →: Speed Up</div>
              <div>⬅️ ←: Slow Down</div>
              <div>⏸️ ESC: Pause</div>
            </div>
          </div>
        </div>

        {/* Game SVG */}
        <svg
          className='w-full h-full'
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid slice"
          style={{ 
            background: theme === 'day' ? 'linear-gradient(to bottom, #3b82f6, #22d3ee, #3b82f6)' :
                       theme === 'sunset' ? 'linear-gradient(to bottom, #fb923c, #f472b6, #a855f7)' :
                       theme === 'night' ? 'linear-gradient(to bottom, #4c1d95, #581c87, #000000)' :
                       'linear-gradient(to bottom, #06b6d4, #9333ea, #ec4899)'
          }}
        >
          {/* Animated Background Elements */}
          <g id="background">
            {/* Realistic Clouds/Stars based on theme */}
            {theme === 'night' || theme === 'cyber' ? (
              // Stars for night/cyber theme
              [...Array(20)].map((_, i) => (
                <g key={`star-${i}`}>
                  <circle
                    cx={(bgOffset * 0.3 + i * 100) % 1000}
                    cy={20 + (i * 37) % 100}
                    r={1 + (i % 3)}
                    className="fill-white"
                    opacity={0.6 + (i % 4) * 0.1}
                  />
                </g>
              ))
            ) : (
              // Realistic clouds for day/sunset
              [...Array(4)].map((_, i) => {
                const x = (bgOffset * 0.4 + i * 250) % 1000;
                const y = 40 + i * 25;
                return (
                  <g key={`cloud-${i}`} transform={`translate(${x}, ${y})`}>
                    {/* Main cloud body - multiple overlapping circles */}
                    <ellipse cx="0" cy="0" rx="40" ry="25" className="fill-white/40" />
                    <ellipse cx="30" cy="-5" rx="35" ry="28" className="fill-white/45" />
                    <ellipse cx="60" cy="0" rx="40" ry="25" className="fill-white/40" />
                    <ellipse cx="25" cy="8" rx="30" ry="20" className="fill-white/35" />
                    <ellipse cx="15" cy="-8" rx="25" ry="20" className="fill-white/50" />
                    <ellipse cx="45" cy="-10" rx="28" ry="22" className="fill-white/48" />
                    {/* Cloud shadow */}
                    <ellipse cx="30" cy="12" rx="50" ry="15" className="fill-white/20" />
                  </g>
                );
              })
            )}
          </g>

          {/* Ground */}
          <rect x="0" y={GROUND_Y + PLAYER_HEIGHT} width="800" height="100" className={currentTheme.ground} />
          <rect x="0" y={GROUND_Y + PLAYER_HEIGHT + 10} width="800" height="90" className={currentTheme.accent} />

          {/* Ground decoration */}
          {[...Array(20)].map((_, i) => (
            <rect
              key={`ground-${i}`}
              x={(bgOffset + i * 40) % 800}
              y={GROUND_Y + PLAYER_HEIGHT - 5}
              width="30"
              height="5"
              className="fill-white/20"
            />
          ))}

          {/* Coins */}
          {coins.filter(c => !c.collected).map(coin => (
            <g key={coin.id} transform={`translate(${coin.x}, ${coin.y})`}>
              <circle cx="10" cy="10" r="10" className="fill-yellow-400" stroke="#FFA500" strokeWidth="2" />
              <text x="10" y="14" textAnchor="middle" className="fill-orange-600 font-bold text-xs">$</text>
            </g>
          ))}

          {/* Obstacles */}
          {obstacles.map(renderObstacle)}

          {/* Player - Baby Character */}
          <g transform={`translate(${PLAYER_X}, ${isDucking ? GROUND_Y - DUCKING_HEIGHT : playerY})`}>
            {/* Invulnerability shield */}
            {Date.now() < invulnerableUntil && (
              <g>
                <circle cx="25" cy="25" r="35" className="fill-cyan-400" opacity="0.2">
                  <animate attributeName="r" from="30" to="40" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.3" to="0.1" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="25" cy="25" r="32" stroke="#00FFFF" strokeWidth="2" fill="none" opacity="0.6">
                  <animate attributeName="r" from="28" to="38" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.8" to="0.2" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </g>
            )}
            
            <foreignObject x="-5" y={isDucking ? "5" : "-5"} width={PLAYER_WIDTH + 10} height={isDucking ? DUCKING_HEIGHT + 10 : PLAYER_HEIGHT + 10}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                transform: isDucking ? 'scaleY(0.5)' : 'scaleY(1)',
                transition: 'transform 0.15s ease-out'
              }}>
                <Image 
                  src="/images/character/baby-full.png" 
                  alt="Baby character"
                  width={PLAYER_WIDTH}
                  height={PLAYER_HEIGHT}
                  style={{ 
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                    filter: Date.now() < invulnerableUntil 
                      ? 'drop-shadow(0 0 10px rgba(0,255,255,0.8)) drop-shadow(0 3px 6px rgba(0,0,0,0.4))'
                      : 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))'
                  }}
                  priority
                />
              </div>
            </foreignObject>
            {/* Double jump indicator */}
            {jumpCount === 2 && (
              <g>
                <circle cx="20" cy="25" r="15" className="fill-cyan-400" opacity="0.3">
                  <animate attributeName="r" from="15" to="25" dur="0.3s" repeatCount="1" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="0.3s" repeatCount="1" />
                </circle>
              </g>
            )}
          </g>
        </svg>

        {/* Ready Screen */}
        {gameState === 'ready' && (
          <div className='absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40'>
            <div className='text-center bg-gradient-to-br from-white/10 to-white/5 p-12 rounded-3xl border-2 border-cyan-400/30 max-w-2xl shadow-2xl'>
              <div className='mb-6'>
                <h1 className='text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4'>
                  {gameTitle}
                </h1>
              </div>
              
              <p className='text-white/80 text-xl mb-4'>
                Infinite Runner is a simple game where you control a character and run through an endless runner.
              </p>
              <div className='bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-xl p-4 mb-8 border border-purple-400/40'>
                <p className='text-cyan-300 font-semibold'>🎯 Level up every 1,000 points!</p>
                <p className='text-white/70 text-sm mt-1'>Answer Web3 questions to advance</p>
              </div>
              
              <div className='bg-black/30 rounded-2xl border border-white/10 overflow-hidden'>
                {/* Collapsible Header */}
                <button
                  onClick={() => setShowControls(!showControls)}
                  className='w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all duration-300'
                >
                  <h3 className='text-white font-semibold text-lg flex items-center gap-2'>
                    🎯 Controls & Features
                  </h3>
                  <span className={`text-white text-2xl transform transition-transform duration-300 ${showControls ? 'rotate-180' : 'rotate-0'}`}>
                    ▼
                  </span>
                </button>
                
                {/* Collapsible Content */}
                <div className={`transition-all duration-300 overflow-hidden ${showControls ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className='px-6 pb-6'>
                    <div className='grid grid-cols-2 gap-3 text-white/70 text-sm mb-4'>
                      <div className='flex items-center gap-2'>
                        <span className='text-xl'>⬆️</span>
                        <span>SPACE/↑ to Jump (x2!)</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xl'>⬇️</span>
                        <span>↓ to Duck</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xl'>➡️</span>
                        <span>→ to Speed Up</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xl'>⬅️</span>
                        <span>← to Slow Down</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xl'>⏸️</span>
                        <span>ESC to Pause</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='text-xl'>⛶</span>
                        <span>Fullscreen mode</span>
                      </div>
                    </div>
                    <div className='bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg p-3 border border-purple-400/30'>
                      <p className='text-cyan-300 text-xs font-semibold'>🧠 Level up every 1,000 points with Web3 quizzes!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className='mt-4 px-12 py-6 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 text-white font-bold text-2xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/50 animate-pulse'
              >
                🚀 START GAME
              </button>
              
              <p className='text-white/50 text-xs mt-6'>
                💡 Tip: Use fullscreen for the best experience!
              </p>
            </div>
          </div>
        )}

        {/* Web3 Quiz Modal */}
        {showQuiz && gameState === 'paused' && (
          <div className='absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='text-center bg-gradient-to-br from-purple-900/90 to-cyan-900/90 p-8 rounded-3xl border-2 border-cyan-400/50 max-w-2xl shadow-2xl'>
              <div className='mb-6'>
                <div className='text-6xl mb-4'>🧠</div>
                <h2 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2'>
                  Level Up Challenge!
                </h2>
                <p className='text-cyan-300 text-lg mb-4'>Answer correctly to advance to Level {level + 1}</p>
              </div>

              {!quizAnswered ? (
                <>
                  <div className='bg-black/30 rounded-2xl p-6 mb-6 border border-cyan-400/30'>
                    <h3 className='text-white text-xl font-semibold mb-6'>{quizQuestions[currentQuestion].question}</h3>
                    
                    <div className='space-y-3'>
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuizAnswered(true);
                            if (index === quizQuestions[currentQuestion].correctAnswer) {
                              // Correct answer - level up!
                              setLevel(l => {
                                const newLevel = l + 1;
                                
                                // Increase base speed
                                setBaseSpeed(s => Math.min(s + 1, 10));
                                setGameSpeed(s => Math.min(s + 1, 10));

                                // Change theme
                                if (newLevel === 2) setTheme('sunset');
                                else if (newLevel === 3) setTheme('night');
                                else if (newLevel >= 4) setTheme('cyber');

                                // Give 4 seconds of invulnerability after level up
                                setInvulnerableUntil(Date.now() + 4000);
                                
                                // Clear existing obstacles for fair start
                                setObstacles([]);

                                return newLevel;
                              });
                            }
                          }}
                          className='w-full p-4 text-left rounded-xl border-2 border-white/20 hover:border-cyan-400/50 bg-white/5 hover:bg-cyan-500/20 text-white font-medium transition-all duration-300 transform hover:scale-105'
                        >
                          <span className='mr-3'>{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='bg-black/30 rounded-2xl p-6 mb-6 border-2 border-cyan-400/50'>
                    <div className='text-6xl mb-4'>
                      {quizAnswered && quizQuestions[currentQuestion].correctAnswer >= 0 ? '🎉' : '❌'}
                    </div>
                    <h3 className='text-2xl font-bold text-cyan-400 mb-4'>
                      {quizAnswered ? '✅ Correct!' : '❌ Incorrect'}
                    </h3>
                    <p className='text-white/80 text-lg mb-4'>{quizQuestions[currentQuestion].explanation}</p>
                    {quizAnswered && (
                      <div className='bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl p-4 border border-cyan-400/30'>
                        <p className='text-cyan-300 font-bold text-xl'>🎊 Level {level} Unlocked!</p>
                        <p className='text-white/70 text-sm mt-2'>Speed increased • New challenges await!</p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowQuiz(false);
                      setGameState('playing');
                      levelTimerRef.current = 0;
                    }}
                    className='px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl rounded-xl transition-all duration-300 transform hover:scale-105 w-full'
                  >
                    ▶️ Continue Playing
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Paused Screen (only show if not showing quiz) */}
        {gameState === 'paused' && !showQuiz && (
          <div className='absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='text-center bg-gradient-to-br from-white/10 to-white/5 p-12 rounded-3xl border border-white/20'>
              <h2 className='text-4xl font-bold text-white mb-4'>⏸️ PAUSED</h2>
              <p className='text-white/70 text-lg mb-8'>Press ESC to continue</p>
              <div className='space-y-4'>
                <button
                  onClick={() => setGameState('playing')}
                  className='px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl rounded-xl transition-all duration-300 transform hover:scale-105 w-full'
                >
                  ▶️ Continue
                </button>
                <button
                  onClick={() => {
                    exitFullscreen();
                    if (embedded) {
                      // If embedded, just reset to ready state
                      setGameState('ready');
                      setScore(0);
                      setLevel(1);
                      setObstacles([]);
                      setCoins([]);
                    } else {
                      // If standalone, navigate back
                      router.push(`/mini-games/${gameId}`);
                    }
                  }}
                  className='px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xl rounded-xl border border-white/20 transition-all duration-300 w-full'
                >
                  🏠 {embedded ? 'Back to Start' : 'Exit to Menu'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <div className='absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50'>
            <div className='text-center bg-gradient-to-br from-white/10 to-white/5 p-12 rounded-3xl border border-white/20 max-w-xl'>
              <div className='text-6xl mb-4'>💀</div>
              <h2 className='text-4xl font-bold text-white mb-4'>Game Over!</h2>
              
              <div className='bg-white/5 rounded-xl p-6 mb-6'>
                <div className='grid grid-cols-2 gap-4 text-white'>
                  <div>
                    <div className='text-white/60 text-sm'>Score</div>
                    <div className='text-3xl font-bold'>{score}</div>
                  </div>
                  <div>
                    <div className='text-white/60 text-sm'>Level</div>
                    <div className='text-3xl font-bold'>{level}</div>
                  </div>
                  <div>
                    <div className='text-white/60 text-sm'>High Score</div>
                    <div className='text-2xl font-bold text-yellow-400'>{highScore}</div>
                  </div>
                  <div>
                    <div className='text-white/60 text-sm'>XP Earned</div>
                    <div className='text-2xl font-bold text-cyan-400'>+{xpEarned}</div>
                  </div>
                </div>
              </div>

              {/* Progress Save Status */}
              {account && (
                <div className='bg-white/5 rounded-xl p-4 mb-8 border-2 border-white/10'>
                  {isSavingProgress && (
                    <div className='flex items-center justify-center gap-2 text-white'>
                      <div className='animate-spin text-2xl'>⏳</div>
                      <span>Saving progress...</span>
                    </div>
                  )}
                  {progressSaved && (
                    <div className='flex items-center justify-center gap-2 text-green-400'>
                      <span className='text-2xl'>✅</span>
                      <span className='font-semibold'>Progress saved to your account!</span>
                    </div>
                  )}
                  {!isSavingProgress && !progressSaved && xpEarned > 0 && (
                    <div className='flex items-center justify-center gap-2 text-yellow-400'>
                      <span className='text-2xl'>💾</span>
                      <span>Saving your progress...</span>
                    </div>
                  )}
                </div>
              )}

              {!account && (
                <div className='bg-yellow-500/10 rounded-xl p-4 mb-8 border-2 border-yellow-500/30'>
                  <div className='flex items-center justify-center gap-2 text-yellow-400'>
                    <span className='text-2xl'>⚠️</span>
                    <span className='text-sm'>Connect wallet to save your progress</span>
                  </div>
                </div>
              )}

              <div className='space-y-4'>
                <button
                  onClick={startGame}
                  className='px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-xl rounded-xl transition-all duration-300 transform hover:scale-105 w-full'
                >
                  🔄 Play Again
                </button>
                <button
                  onClick={() => {
                    exitFullscreen();
                    if (embedded) {
                      // If embedded, scroll to top and reset game
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setTimeout(() => {
                        setGameState('ready');
                        setScore(0);
                        setLevel(1);
                        setObstacles([]);
                        setCoins([]);
                      }, 300);
                    } else {
                      // If standalone, navigate back
                      router.push(`/mini-games/${gameId}`);
                    }
                  }}
                  className='px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xl rounded-xl border border-white/20 transition-all duration-300 w-full'
                >
                  🏠 {embedded ? 'Back to Start' : 'Exit to Menu'}
                </button>
              </div>
            </div>
          </div>
        )}
            </div>
          </div>
          
          {/* Arcade Machine Details */}
          
          {/* Ventilation slots at bottom */}
          <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='w-1 h-3 bg-gray-900 rounded-sm' />
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default InfiniteRunner;
