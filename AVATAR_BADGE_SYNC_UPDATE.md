# Avatar and Badge Synchronization Update

## Feature Enhancement

Added dynamic badge display that changes in sync with the avatar phase navigation on the Nexus Account RewardsSidebar Overview tab.

## Changes Made

### 1. Dynamic Phase Badge Label (Line 242-245)

**Before:**
```typescript
<div className='absolute -top-6 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white/20'>
  {level < 5 ? 'Trustless Scout' : level < 10 ? 'Blockchain Explorer' : 'Stellar Expert'}
</div>
```

**After:**
```typescript
<div className='absolute -top-6 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white/20 transition-all duration-300'>
  {currentPhase?.name || 'Trustless Scout'}
</div>
```

**Result:** The badge label now changes when using the arrow buttons, not just based on level.

### 2. New Badge Display Component (Lines 267-294)

Added a visual badge card below the avatar that displays:
- **Badge icon** that changes per phase:
  - 🌱 for Trustless Scout (Phase 0)
  - 🚀 for Blockchain Explorer (Phase 1)
  - ⭐ for Stellar Expert (Phase 2)

- **Badge name** synchronized with arrow navigation
- **Level requirement** shown for each phase
- **Color-coded borders and backgrounds**:
  - Green gradient for Trustless Scout
  - Blue gradient for Blockchain Explorer
  - Purple gradient for Stellar Expert

- **Smooth transitions** when switching between phases

### 3. Enhanced Phase Navigation (Lines 171-185)

Updated the arrow navigation handlers with better structure for future enhancements.

## How It Works

### Avatar Phases
The avatar has three phases that unlock based on player level:

| Phase | Name | Image | Min Level | Icon | Color |
|-------|------|-------|-----------|------|-------|
| 0 | Trustless Scout | baby.png | 1 | 🌱 | Green |
| 1 | Blockchain Explorer | teen.png | 5 | 🚀 | Blue |
| 2 | Stellar Expert | nexus-prime-chat.png | 10 | ⭐ | Purple |

### Navigation Flow
1. User opens the Nexus Account (RewardsSidebar)
2. Clicks on the Overview tab
3. Sees their current avatar with navigation arrows (if multiple phases unlocked)
4. Clicks left/right arrows to cycle through unlocked phases
5. **Badge changes automatically** to match the selected phase:
   - Badge label above avatar updates
   - Badge card below avatar updates with new icon, name, and colors

### Visual Feedback
- **Avatar image** changes with smooth transition
- **Top badge label** changes with fade transition
- **Badge card** changes colors and icons with smooth animation
- **Phase indicators** (dots) show which phase is selected

## User Experience Improvements

### Before
- Badge label was fixed based on current level
- No visual badge representation
- Unclear what phase you were viewing when using arrows

### After
- Badge label changes dynamically with arrow navigation
- Visual badge card with icon and styling
- Clear indication of which phase is being viewed
- Color-coded system makes phases easily distinguishable
- Smooth transitions provide polished feel

## Testing Checklist

To test the new feature:

- [ ] Open Nexus Account sidebar (user profile dropdown)
- [ ] Click Overview tab
- [ ] If Level 5+: Use right arrow to cycle through phases
- [ ] Verify badge label above avatar changes (Trustless Scout → Blockchain Explorer → Stellar Expert)
- [ ] Verify badge card below avatar changes:
  - [ ] Icon changes (🌱 → 🚀 → ⭐)
  - [ ] Name changes
  - [ ] Colors change (Green → Blue → Purple)
  - [ ] Level requirement updates
- [ ] Use left arrow to go backward
- [ ] Verify changes are smooth with transitions
- [ ] Check phase indicator dots highlight correctly

## Code Structure

### Component: RewardsSidebar.tsx

**State:**
- `selectedCharacterPhase` (0-2): Tracks which phase is currently selected

**Functions:**
- `getAvailableCharacterPhases()`: Returns phases unlocked based on level
- `handlePreviousPhase()`: Cycles to previous phase
- `handleNextPhase()`: Cycles to next phase

**Display:**
- `currentPhase`: The phase object for currently selected phase
- `availablePhases`: Array of unlocked phases

### Badge Display Structure

```
Avatar Container
├── Navigation Arrows (Previous/Next)
├── Avatar Image (changes with phase)
├── Top Badge Label (shows phase name)
├── Phase Indicator Dots
└── Badge Card (NEW)
    ├── Icon (🌱/🚀/⭐)
    ├── Phase Name
    └── Level Requirement
```

## Visual Design

### Trustless Scout (Phase 0)
- **Background:** Green gradient (`from-green-500/20 to-emerald-500/20`)
- **Border:** Green (`border-green-400/50`)
- **Text:** Green (`text-green-300`)
- **Icon:** 🌱 (Seedling)
- **Level:** 1+

### Blockchain Explorer (Phase 1)
- **Background:** Blue gradient (`from-blue-500/20 to-indigo-500/20`)
- **Border:** Blue (`border-blue-400/50`)
- **Text:** Blue (`text-blue-300`)
- **Icon:** 🚀 (Rocket)
- **Level:** 5+

### Stellar Expert (Phase 2)
- **Background:** Purple gradient (`from-purple-500/20 to-pink-500/20`)
- **Border:** Purple (`border-purple-400/50`)
- **Text:** Purple (`text-purple-300`)
- **Icon:** ⭐ (Star)
- **Level:** 10+

## Future Enhancements

Potential improvements for future updates:

1. **Sound effects** when changing phases
2. **Animation effects** (sparkles, particles) when cycling
3. **Badge unlock animations** when reaching new level thresholds
4. **Hover tooltips** with phase descriptions
5. **Achievement tracking** for phase milestones
6. **Share phase** on social media
7. **Phase-specific rewards** or perks

## Files Modified

1. `components/ui/RewardsSidebar.tsx` - Main component with badge sync functionality
2. `AVATAR_BADGE_SYNC_UPDATE.md` - This documentation

## Related Components

- `PixelArtAvatar.tsx` - Avatar display component
- `Badge3D.tsx` - 3D badge rendering
- `UserProfile.tsx` - User profile dropdown
- `Header.tsx` - Contains user profile button

## Summary

Users can now cycle through their unlocked avatar phases using the arrow buttons, and the badge display will change in real-time to show the corresponding badge (Trustless Scout, Blockchain Explorer, or Stellar Expert) with proper visual styling, icons, and colors. This provides a more interactive and engaging experience when exploring character progression!

