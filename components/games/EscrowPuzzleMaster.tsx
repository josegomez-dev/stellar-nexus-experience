'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Puzzle {
  id: number;
  title: string;
  description: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reward: number;
}

const puzzles: Puzzle[] = [
  {
    id: 1,
    title: 'Escrow Basics',
    description: 'Learn the fundamental concept of escrow in blockchain transactions',
    question: 'What is the primary purpose of an escrow system in blockchain?',
    options: [
      'To increase transaction fees',
      'To hold funds until conditions are met',
      'To speed up transactions',
      'To reduce security',
    ],
    correctAnswer: 1,
    explanation:
      'Escrow systems hold funds in a smart contract until predefined conditions are met, ensuring trust between parties.',
    difficulty: 'easy',
    reward: 10,
  },
  {
    id: 2,
    title: 'Multi-Signature Wallets',
    description: 'Understand how multi-signature wallets enhance security',
    question: 'How many private keys are typically required in a 2-of-3 multi-signature wallet?',
    options: ['1 out of 3', '2 out of 3', '3 out of 3', '4 out of 3'],
    correctAnswer: 1,
    explanation:
      'A 2-of-3 multi-signature wallet requires 2 out of 3 private keys to authorize a transaction, providing enhanced security.',
    difficulty: 'medium',
    reward: 20,
  },
  {
    id: 3,
    title: 'Stellar Escrow',
    description: 'Master Stellar-specific escrow mechanisms',
    question: 'What happens to escrowed funds if the time lock expires on Stellar?',
    options: [
      'Funds are lost forever',
      'Funds return to the sender',
      'Funds are burned',
      'Funds go to a random address',
    ],
    correctAnswer: 1,
    explanation:
      'When a Stellar escrow time lock expires, the funds automatically return to the sender, preventing permanent loss.',
    difficulty: 'hard',
    reward: 30,
  },
];

export default function EscrowPuzzleMaster() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [timeLeft, setTimeLeft] = useState(60);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState('completed');
    }
  }, [timeLeft, gameState]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(60);
    setScore(0);
    setCurrentPuzzle(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const nextPuzzle = () => {
    if (selectedAnswer === puzzles[currentPuzzle].correctAnswer) {
      const newScore = score + puzzles[currentPuzzle].reward;
      setScore(newScore);

      // Check for achievements
      if (newScore >= 30 && !achievements.includes('Puzzle Master')) {
        setAchievements([...achievements, 'Puzzle Master']);
      }
      if (newScore >= 50 && !achievements.includes('Escrow Expert')) {
        setAchievements([...achievements, 'Escrow Expert']);
      }
    }

    if (currentPuzzle < puzzles.length - 1) {
      setCurrentPuzzle(currentPuzzle + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameState('completed');
    }
  };

  const resetGame = () => {
    setGameState('intro');
    setScore(0);
    setCurrentPuzzle(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAchievements([]);
  };

  if (gameState === 'intro') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Game Logo */}
          <div className='mb-8'>
            <div className='text-8xl mb-4 animate-pulse'>🔐</div>
            <h1 className='text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4'>
              Escrow Puzzle Master
            </h1>
            <h2 className='text-2xl md:text-3xl font-semibold text-white/90 mb-6'>
              Master the Art of Trustless Transactions
            </h2>
          </div>

          {/* Game Description */}
          <div className='bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8'>
            <p className='text-lg text-white/80 leading-relaxed mb-6'>
              Solve complex escrow puzzles while learning Stellar blockchain fundamentals. Complete
              challenges, unlock achievements, and become a DeFi expert!
            </p>

            <div className='grid md:grid-cols-3 gap-6 mb-6'>
              <div className='text-center p-4 bg-white/5 rounded-2xl'>
                <div className='text-3xl mb-2'>🧩</div>
                <h3 className='text-white font-semibold mb-2'>3 Puzzles</h3>
                <p className='text-white/60 text-sm'>Progressive difficulty</p>
              </div>
              <div className='text-center p-4 bg-white/5 rounded-2xl'>
                <div className='text-3xl mb-2'>⏱️</div>
                <h3 className='text-white font-semibold mb-2'>60 Seconds</h3>
                <p className='text-white/60 text-sm'>Time challenge</p>
              </div>
              <div className='text-center p-4 bg-white/5 rounded-2xl'>
                <div className='text-3xl mb-2'>🏆</div>
                <h3 className='text-white font-semibold mb-2'>60 XLM</h3>
                <p className='text-white/60 text-sm'>Total rewards</p>
              </div>
            </div>

            <div className='text-center'>
              <button
                onClick={startGame}
                className='px-12 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-2xl rounded-3xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25'
              >
                🚀 START GAME
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const puzzle = puzzles[currentPuzzle];

    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
        <div className='max-w-4xl mx-auto w-full'>
          {/* Game Header */}
          <div className='text-center mb-8'>
            <div className='flex justify-between items-center mb-4'>
              <div className='text-left'>
                <div className='text-white/60 text-sm'>
                  Puzzle {currentPuzzle + 1} of {puzzles.length}
                </div>
                <div className='text-white/60 text-sm'>Difficulty: {puzzle.difficulty}</div>
              </div>
              <div className='text-right'>
                <div className='text-white/60 text-sm'>Score: {score}</div>
                <div className='text-white/60 text-sm'>Time: {timeLeft}s</div>
              </div>
            </div>

            <h1 className='text-3xl md:text-4xl font-bold text-white mb-2'>{puzzle.title}</h1>
            <p className='text-white/80'>{puzzle.description}</p>
          </div>

          {/* Puzzle Card */}
          <div className='bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8'>
            <h2 className='text-xl font-bold text-white mb-6'>{puzzle.question}</h2>

            <div className='space-y-4'>
              {puzzle.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-2xl border-2 transition-all duration-300 ${
                    selectedAnswer === index
                      ? index === puzzle.correctAnswer
                        ? 'border-green-400 bg-green-500/20'
                        : 'border-red-400 bg-red-500/20'
                      : 'border-white/20 hover:border-cyan-400/50 hover:bg-white/10'
                  } ${showResult ? 'cursor-default' : 'cursor-pointer hover:scale-105'}`}
                >
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? index === puzzle.correctAnswer
                            ? 'border-green-400 bg-green-400'
                            : 'border-red-400 bg-red-400'
                          : 'border-white/40'
                      }`}
                    >
                      {selectedAnswer === index && (
                        <span className='text-white text-sm font-bold'>
                          {index === puzzle.correctAnswer ? '✓' : '✗'}
                        </span>
                      )}
                    </div>
                    <span className='text-white font-medium'>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Result Display */}
            {showResult && (
              <div className='mt-6 p-6 bg-gradient-to-br from-white/5 to-white/10 rounded-2xl border border-white/20'>
                <div className='text-center mb-4'>
                  {selectedAnswer === puzzle.correctAnswer ? (
                    <div className='text-green-400 text-4xl mb-2'>🎉 Correct!</div>
                  ) : (
                    <div className='text-red-400 text-4xl mb-2'>❌ Incorrect</div>
                  )}
                </div>

                <div className='text-white/80 mb-4'>
                  <strong>Explanation:</strong> {puzzle.explanation}
                </div>

                <div className='text-center'>
                  <button
                    onClick={nextPuzzle}
                    className='px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105'
                  >
                    {currentPuzzle < puzzles.length - 1 ? 'Next Puzzle →' : 'Finish Game'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'completed') {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Game Results */}
          <div className='mb-8'>
            <div className='text-8xl mb-4'>🏆</div>
            <h1 className='text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 mb-4'>
              Game Complete!
            </h1>
            <h2 className='text-2xl md:text-3xl font-semibold text-white/90 mb-6'>
              Final Score: {score} XLM
            </h2>
          </div>

          {/* Score and Achievements */}
          <div className='bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8'>
            <div className='grid md:grid-cols-2 gap-8 mb-8'>
              <div>
                <h3 className='text-2xl font-bold text-white mb-4'>📊 Game Statistics</h3>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center p-3 bg-white/5 rounded-xl'>
                    <span className='text-white/70'>Final Score:</span>
                    <span className='text-white font-semibold'>{score} XLM</span>
                  </div>
                  <div className='flex justify-between items-center p-3 bg-white/5 rounded-xl'>
                    <span className='text-white/70'>Puzzles Solved:</span>
                    <span className='text-white font-semibold'>{puzzles.length}</span>
                  </div>
                  <div className='flex justify-between items-center p-3 bg-white/5 rounded-xl'>
                    <span className='text-white/70'>Time Remaining:</span>
                    <span className='text-white font-semibold'>{timeLeft}s</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-2xl font-bold text-white mb-4'>🏅 Achievements</h3>
                <div className='space-y-3'>
                  {achievements.length > 0 ? (
                    achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className='p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-400/30'
                      >
                        <div className='text-yellow-400 font-semibold'>⭐ {achievement}</div>
                      </div>
                    ))
                  ) : (
                    <div className='p-3 bg-white/5 rounded-xl border border-white/20'>
                      <div className='text-white/60'>No achievements unlocked yet</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='text-center'>
              <button
                onClick={resetGame}
                className='px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 mr-4'
              >
                🎮 Play Again
              </button>

              <button
                onClick={() => (window.location.href = '/mini-games')}
                className='px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xl rounded-2xl border border-white/20 transition-all duration-300 transform hover:scale-105'
              >
                🏠 Back to Arcade
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
