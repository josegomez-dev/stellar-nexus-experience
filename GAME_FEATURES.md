# 🎮 Infinite Runner Game - Features & Documentation

## Overview
A full-screen infinite runner game similar to Chrome's dinosaur game, integrated with the Trustless Work platform's account and reward system.

## 🚀 Features Implemented

### 1. Full-Screen Game Experience
- **Route**: `/play/[gameId]`
- **Layout**: Header visible with account info, rest is full-screen game canvas
- **Responsive**: Adapts to different screen sizes

### 2. Infinite Runner Gameplay
Based on Chrome's dinosaur game with enhancements:

#### Player Controls
- **Space/Arrow Up**: Jump
- **Arrow Down**: Duck/Crouch
- **Arrow Right**: Speed up (1.5x)
- **Arrow Left**: Slow down (0.5x)
- **ESC**: Pause/Resume

#### Game Mechanics
- SVG-based graphics for smooth rendering
- Physics-based jumping with gravity
- Collision detection with obstacles
- Coin collection system (+50 points per coin)
- Scrolling background
- Progressive difficulty

### 3. Progressive Difficulty System

#### Level Progression
- **Level 1 (Day Theme)**: Basic obstacles (cactus, rocks)
- **Level 2 (Sunset Theme)**: Added flying obstacles (birds) and blockchain icons
- **Level 3 (Night Theme)**: All obstacle types active, faster speed
- **Level 4+ (Cyber Theme)**: Maximum difficulty with crypto obstacles

#### Difficulty Scaling
- Levels up every 60 seconds (3600 frames)
- Speed increases with each level
- New obstacle types unlock at higher levels
- Obstacle spawn rate increases
- Visual theme changes to indicate difficulty

### 4. Reward System

#### Scoring
- **Base Score**: +1 per frame while alive
- **Coin Bonus**: +50 points per coin collected
- **High Score**: Tracked locally in browser

#### XP & Points Integration
- **XP Earned**: 1 XP per 10 score points
- **Account Points**: 1 point per 10 score points
- **Auto-Save**: Progress automatically saved to account on game over
- **Visual Feedback**: Save status displayed on game over screen

### 5. Visual Themes

Each level has a unique theme:

1. **Day (Level 1)**
   - Blue sky background
   - Green ground
   - White clouds
   - Beginner difficulty

2. **Sunset (Level 2)**
   - Orange/pink/purple gradient
   - Orange ground
   - Enhanced visuals
   - Medium difficulty

3. **Night (Level 3)**
   - Dark indigo/purple/black
   - Gray ground
   - Stars instead of clouds
   - Hard difficulty

4. **Cyber (Level 4+)**
   - Cyan/purple/pink neon
   - Purple ground
   - Futuristic aesthetic
   - Expert difficulty

### 6. Obstacle Types

Different obstacles with unique behaviors:

- **Cactus**: Ground-level, static
- **Rock**: Ground-level, triangular
- **Bird**: Flying, mid-air height
- **Blockchain**: Chained blocks icon
- **Crypto**: Bitcoin symbol coin

### 7. Game States

- **Ready**: Initial screen with instructions
- **Playing**: Active gameplay
- **Paused**: ESC to pause/resume
- **Game Over**: Shows stats and save status

## 🎯 How to Play

1. Navigate to `/mini-games/[gameId]`
2. Click "START GAME" (requires connected wallet)
3. Game opens in full-screen at `/play/[gameId]`
4. Use controls to avoid obstacles and collect coins
5. Survive as long as possible to earn XP and points
6. Progress automatically saves to your account

## 💾 Account Integration

### Requirements
- User must have connected wallet
- Account must be created

### Benefits
- XP earned adds to account experience
- Points earned add to account total
- Progress contributes to leveling up
- Stats tracked for leaderboards

### Saves Automatically
- On game over (1 second delay)
- Shows save status on end screen
- Toast notification on successful save
- Error handling with retry option

## 🎨 Technical Implementation

### Technologies
- **React**: Component-based architecture
- **TypeScript**: Type-safe development
- **SVG**: Scalable graphics
- **Next.js**: Routing and SSR
- **Firebase**: Account data persistence
- **RequestAnimationFrame**: Smooth 60fps gameplay

### Performance Optimizations
- Efficient collision detection
- Object pooling for obstacles/coins
- Cleanup of off-screen objects
- Optimized render loop

### Code Structure
```
/app/play/[gameId]/page.tsx          # Main game route
/components/games/InfiniteRunner.tsx  # Game component
```

## 🔧 Future Enhancements

Potential additions:
- Multiplayer leaderboards
- Daily challenges
- Power-ups and special abilities
- More obstacle types and themes
- Mobile touch controls
- Sound effects and music
- Achievements and badges
- Social sharing

## 🐛 Known Issues

None currently! All features working as expected.

## 📝 Testing Checklist

- [x] Player controls (jump, duck, speed)
- [x] Collision detection
- [x] Coin collection
- [x] Level progression
- [x] Theme changes
- [x] Score tracking
- [x] XP calculation
- [x] Account integration
- [x] Auto-save functionality
- [x] Pause/Resume
- [x] Navigation
- [x] Responsive design

---

**Enjoy the game!** 🎮🚀

