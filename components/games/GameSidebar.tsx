'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount } from '@/contexts/auth/AccountContext';
import { useToast } from '@/contexts/ui/ToastContext';
import { gameSocialService, GameMessage, Challenge } from '@/lib/services/game-social-service';
import { accountService } from '@/lib/services/account-service';

interface GameSidebarProps {
  gameId: string;
  gameTitle: string;
  currentScore?: number;
  currentLevel?: number;
}

type SidebarView = 'games' | 'social' | 'challenges' | 'chat';

const AVAILABLE_GAMES = [
  { id: 'web3-basics-adventure', name: 'Web3 Basics Adventure', icon: '🚀' },
  // Add more games as needed
];

const GameSidebar: React.FC<GameSidebarProps> = ({ gameId, gameTitle, currentScore = 0, currentLevel = 1 }) => {
  const { account } = useAccount();
  const { addToast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<SidebarView>('games');
  const [messages, setMessages] = useState<GameMessage[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newChallengeDesc, setNewChallengeDesc] = useState('');
  const [newChallengeReward, setNewChallengeReward] = useState(1000);
  const [newChallengeScore, setNewChallengeScore] = useState(3000);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Subscribe to game messages
  useEffect(() => {
    if (!isOpen || currentView !== 'chat') return;
    
    const unsubscribe = gameSocialService.subscribeToGameMessages(
      gameId,
      (newMessages) => {
        setMessages(newMessages);
        // Auto-scroll to bottom
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      },
      50
    );

    return () => unsubscribe();
  }, [gameId, isOpen, currentView]);

  // Subscribe to challenges
  useEffect(() => {
    if (!isOpen || currentView !== 'challenges') return;
    
    const unsubscribe = gameSocialService.subscribeToOpenChallenges(
      gameId,
      (newChallenges) => {
        setChallenges(newChallenges);
      }
    );

    return () => unsubscribe();
  }, [gameId, isOpen, currentView]);

  // Load active users
  useEffect(() => {
    if (!isOpen) return;
    
    const loadUsers = async () => {
      const users = await gameSocialService.getActiveUsers(20);
      setActiveUsers(users);
    };
    
    loadUsers();
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!account || !newMessage.trim()) return;
    
    try {
      await gameSocialService.sendGameMessage(
        gameId,
        account.id,
        account.profile?.username || account.profile?.displayName || 'Anonymous',
        newMessage.trim()
      );
      
      setNewMessage('');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to send message',
        message: 'Please try again',
        duration: 3000,
      });
    }
  };

  const handleCreateChallenge = async () => {
    if (!account || !newChallengeDesc.trim()) return;
    
    const currentPoints = account.totalPoints || account.profile?.totalPoints || 0;
    
    if (currentPoints < newChallengeReward) {
      addToast({
        type: 'error',
        title: 'Insufficient Points',
        message: `You need ${newChallengeReward} points to create this challenge`,
        duration: 3000,
      });
      return;
    }
    
    try {
      // Deduct points from challenger
      await accountService.addExperienceAndPoints(account.id, 0, -newChallengeReward);
      
      await gameSocialService.createChallenge(
        gameId,
        account.id,
        account.profile?.username || account.profile?.displayName || 'Anonymous',
        newChallengeDesc.trim(),
        `Reach ${newChallengeScore} points`,
        newChallengeReward,
        undefined,
        undefined,
        newChallengeScore
      );
      
      addToast({
        type: 'success',
        title: '🎯 Challenge Created!',
        message: `${newChallengeReward} points staked!`,
        duration: 3000,
      });
      
      setNewChallengeDesc('');
      setNewChallengeReward(1000);
      setNewChallengeScore(3000);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to create challenge',
        message: 'Please try again',
        duration: 3000,
      });
    }
  };

  const handleAcceptChallenge = async (challenge: Challenge) => {
    if (!account) return;
    
    try {
      await gameSocialService.acceptChallenge(
        challenge.id,
        account.id,
        account.profile?.username || account.profile?.displayName || 'Anonymous'
      );
      
      addToast({
        type: 'success',
        title: '✅ Challenge Accepted!',
        message: `Win ${challenge.pointsReward} points!`,
        duration: 3000,
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Failed to accept challenge',
        message: 'Please try again',
        duration: 3000,
      });
    }
  };

  const shareToTwitter = () => {
    const text = `Just played ${gameTitle}! 🎮\n\nScore: ${currentScore}\nLevel: ${currentLevel}\n\nTry it yourself at Trustless Work!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  const copyShareLink = () => {
    const shareText = `Check out ${gameTitle}! I scored ${currentScore} points at level ${currentLevel}! 🎮`;
    navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
    addToast({
      type: 'success',
      title: 'Copied!',
      message: 'Share link copied to clipboard',
      duration: 2000,
    });
  };

  return (
    <>
      {/* Collapsed Sidebar Buttons */}
      {!isOpen && (
        <div 
          className='fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2'
          style={{ zIndex: 10000 }}
        >
          <button
            onClick={() => {
              setCurrentView('games');
              setIsOpen(true);
            }}
            className='bg-gradient-to-l from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white p-3 rounded-l-xl shadow-xl transition-all duration-300 border-l-4 border-purple-400'
            title="Game Selector"
          >
            <span className='text-2xl'>🎮</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentView('social');
              setIsOpen(true);
            }}
            className='bg-gradient-to-l from-pink-600 to-pink-700 hover:from-pink-500 hover:to-pink-600 text-white p-3 rounded-l-xl shadow-xl transition-all duration-300 border-l-4 border-pink-400'
            title="Share"
          >
            <span className='text-2xl'>🔗</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentView('challenges');
              setIsOpen(true);
            }}
            className='bg-gradient-to-l from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white p-3 rounded-l-xl shadow-xl transition-all duration-300 border-l-4 border-cyan-400'
            title="Challenges"
          >
            <span className='text-2xl'>🎯</span>
          </button>
          
          <button
            onClick={() => {
              setCurrentView('chat');
              setIsOpen(true);
            }}
            className='bg-gradient-to-l from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white p-3 rounded-l-xl shadow-xl transition-all duration-300 border-l-4 border-green-400'
            title="Chat"
          >
            <span className='text-2xl'>💬</span>
          </button>
        </div>
      )}

      {/* Sidebar Panel */}
      {isOpen && (
        <div 
          className='fixed right-0 top-0 h-screen w-80 bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-sm border-l-2 border-purple-500/30 shadow-2xl overflow-hidden flex flex-col'
          style={{ height: '93vh', marginTop: '65px' }}
        >
          {/* Header */}
          <div className='bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-b border-purple-500/30 p-4'>
            <div className='flex items-center justify-between mb-3'>
              <h3 className='text-white font-bold text-lg'>
                {currentView === 'games' && '🎮 Games'}
                {currentView === 'social' && '🔗 Share'}
                {currentView === 'challenges' && '🎯 Challenges'}
                {currentView === 'chat' && '💬 Chat'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className='text-white/80 hover:text-white text-2xl transition-colors'
              >
                ✕
              </button>
            </div>
            
            {/* View Tabs */}
            <div className='grid grid-cols-4 gap-1 bg-black/30 p-1 rounded-lg'>
              <button
                onClick={() => setCurrentView('games')}
                className={`py-2 text-xs rounded transition-all ${
                  currentView === 'games'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                🎮
              </button>
              <button
                onClick={() => setCurrentView('social')}
                className={`py-2 text-xs rounded transition-all ${
                  currentView === 'social'
                    ? 'bg-pink-600 text-white font-bold'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                🔗
              </button>
              <button
                onClick={() => setCurrentView('challenges')}
                className={`py-2 text-xs rounded transition-all ${
                  currentView === 'challenges'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                🎯
              </button>
              <button
                onClick={() => setCurrentView('chat')}
                className={`py-2 text-xs rounded transition-all ${
                  currentView === 'chat'
                    ? 'bg-green-600 text-white font-bold'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                💬
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className='flex-1 overflow-y-auto p-4'>
            {/* GAMES VIEW */}
            {currentView === 'games' && (
              <div className='space-y-2'>
                <p className='text-white/60 text-xs mb-3'>Available Mini-Games:</p>
                {AVAILABLE_GAMES.map((game) => (
                  <a
                    key={game.id}
                    href={`/mini-games/${game.id}`}
                    className='block p-3 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-purple-400/50 transition-all'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-2xl'>{game.icon}</span>
                      <div className='flex-1'>
                        <div className='text-white font-semibold text-sm'>{game.name}</div>
                        {game.id === gameId && (
                          <div className='text-green-400 text-xs'>▶ Playing now</div>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* SOCIAL SHARE VIEW */}
            {currentView === 'social' && (
              <div className='space-y-3'>
                <div className='bg-white/5 rounded-lg p-4 border border-white/10'>
                  <div className='text-white font-semibold text-sm mb-2'>Your Stats:</div>
                  <div className='grid grid-cols-2 gap-2 text-xs'>
                    <div>
                      <div className='text-white/60'>Score</div>
                      <div className='text-white font-bold text-lg'>{currentScore}</div>
                    </div>
                    <div>
                      <div className='text-white/60'>Level</div>
                      <div className='text-white font-bold text-lg'>{currentLevel}</div>
                    </div>
                  </div>
                </div>

                <div className='text-white/60 text-xs mb-2'>Share your progress:</div>
                
                <button
                  onClick={shareToTwitter}
                  className='w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
                >
                  <span className='text-xl'>🐦</span>
                  <span>Share on Twitter/X</span>
                </button>
                
                <button
                  onClick={shareToFacebook}
                  className='w-full p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
                >
                  <span className='text-xl'>📘</span>
                  <span>Share on Facebook</span>
                </button>
                
                <button
                  onClick={copyShareLink}
                  className='w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
                >
                  <span className='text-xl'>📋</span>
                  <span>Copy Share Link</span>
                </button>
              </div>
            )}

            {/* CHALLENGES VIEW */}
            {currentView === 'challenges' && (
              <div className='space-y-3'>
                {account && (
                  <div className='bg-gradient-to-br from-cyan-600/20 to-purple-600/20 rounded-lg p-3 border border-cyan-400/30'>
                    <div className='text-white font-semibold text-sm mb-2'>Create Challenge</div>
                    
                    <input
                      type='text'
                      value={newChallengeDesc}
                      onChange={(e) => setNewChallengeDesc(e.target.value)}
                      placeholder='Challenge description...'
                      className='w-full p-2 bg-black/30 text-white text-xs rounded border border-white/20 mb-2'
                      maxLength={100}
                    />
                    
                    <div className='grid grid-cols-2 gap-2 mb-2'>
                      <div>
                        <label className='text-white/60 text-xs'>Target Score:</label>
                        <input
                          type='number'
                          value={newChallengeScore}
                          onChange={(e) => setNewChallengeScore(Number(e.target.value))}
                          className='w-full p-2 bg-black/30 text-white text-xs rounded border border-white/20'
                          min={500}
                          max={10000}
                          step={500}
                        />
                      </div>
                      <div>
                        <label className='text-white/60 text-xs'>Reward:</label>
                        <input
                          type='number'
                          value={newChallengeReward}
                          onChange={(e) => setNewChallengeReward(Number(e.target.value))}
                          className='w-full p-2 bg-black/30 text-white text-xs rounded border border-white/20'
                          min={100}
                          max={5000}
                          step={100}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={handleCreateChallenge}
                      className='w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-bold text-xs rounded transition-all duration-200'
                    >
                      🎯 Create Challenge
                    </button>
                  </div>
                )}

                {!account && (
                  <div className='bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30 text-center'>
                    <span className='text-yellow-300 text-xs'>🔒 Connect wallet to create challenges</span>
                  </div>
                )}

                <div className='text-white/60 text-xs mb-2'>Open Challenges:</div>
                
                <div className='space-y-2 max-h-96 overflow-y-auto'>
                  {challenges.length === 0 && (
                    <div className='text-white/40 text-xs text-center py-8'>
                      No open challenges yet. Be the first to create one!
                    </div>
                  )}
                  
                  {challenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className='bg-white/5 rounded-lg p-3 border border-white/10 hover:border-cyan-400/30 transition-all'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex-1'>
                          <div className='text-white font-semibold text-xs'>{challenge.challengerName}</div>
                          <div className='text-white/70 text-xs mt-1'>{challenge.description}</div>
                        </div>
                        <div className='text-green-400 font-bold text-sm ml-2'>+{challenge.pointsReward}</div>
                      </div>
                      
                      <div className='flex items-center justify-between'>
                        <div className='text-cyan-300 text-xs'>{challenge.requirement}</div>
                        {account && account.id !== challenge.challengerId && (
                          <button
                            onClick={() => handleAcceptChallenge(challenge)}
                            className='px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded transition-all'
                          >
                            Accept
                          </button>
                        )}
                        {account && account.id === challenge.challengerId && (
                          <div className='text-yellow-400 text-xs'>Your challenge</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHAT VIEW */}
            {currentView === 'chat' && (
              <div className='flex flex-col h-full'>
                {account && (
                  <div className='bg-gradient-to-br from-green-600/20 to-cyan-600/20 rounded-lg p-3 border border-green-400/30 mb-3'>
                    <div className='text-white font-semibold text-xs mb-2'>Send Message</div>
                    <div className='flex gap-2'>
                      <input
                        type='text'
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder='Type your message...'
                        className='flex-1 p-2 bg-black/30 text-white text-xs rounded border border-white/20'
                        maxLength={200}
                      />
                      <button
                        onClick={handleSendMessage}
                        className='px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded transition-all'
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {!account && (
                  <div className='bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30 text-center mb-3'>
                    <span className='text-yellow-300 text-xs'>🔒 Connect wallet to chat</span>
                  </div>
                )}

                <div className='text-white/60 text-xs mb-2'>Game Chat:</div>
                
                <div className='flex-1 space-y-2 overflow-y-auto bg-black/20 rounded-lg p-3 border border-white/10'>
                  {messages.length === 0 && (
                    <div className='text-white/40 text-xs text-center py-8'>
                      No messages yet. Start the conversation!
                    </div>
                  )}
                  
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-lg ${
                        msg.userId === account?.id
                          ? 'bg-purple-600/30 border border-purple-400/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex-1 min-w-0'>
                          <div className='text-cyan-300 font-semibold text-xs truncate'>{msg.username}</div>
                          <div className='text-white text-xs mt-1 break-words'>{msg.message}</div>
                        </div>
                        {msg.type === 'achievement' && (
                          <span className='text-yellow-400 text-xs'>🏆</span>
                        )}
                      </div>
                      <div className='text-white/40 text-xs mt-1'>
                        {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GameSidebar;

