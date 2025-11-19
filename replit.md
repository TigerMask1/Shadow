# Shadow Orb - Professional Arcade Battle Royale

## Project Overview
Shadow Orb is a professional arcade-style battle royale mobile game built with React Native and Expo. The game features 6 unique warrior classes, projectile-based combat, strategic gameplay on a large 2400x2400 battlefield, and a vibrant neon arcade aesthetic optimized for landscape mobile play.

## Game Features

### Core Gameplay
- **10-player battle royale** with last player standing victory
- **Shadow Orb collection** mechanic - collect orbs from pillars to win
- **Large battlefield**: 2400x2400 map with 30+ strategic obstacles
- **Time-limited matches**: 2-minute rounds with time-based victory conditions
- **Landscape orientation** locked for optimal mobile gameplay

### Warrior System (6 Unique Classes)
1. **Berserker** - High damage, aggressive melee fighter
   - Health: 120 | Defense: 3 | Speed: 3.5
   - Abilities: Blood Rage, Cleave, War Cry
   
2. **Assassin** - Fast, high burst damage, low defense
   - Health: 90 | Defense: 1 | Speed: 4.5
   - Abilities: Shadow Strike, Poison Dart, Smoke Bomb
   
3. **Tank** - Maximum defense, slow but durable
   - Health: 180 | Defense: 8 | Speed: 2.8
   - Abilities: Shield Bash, Fortify, Taunt
   
4. **Mage** - Long range, powerful magic attacks
   - Health: 100 | Defense: 2 | Speed: 3.2
   - Abilities: Fireball, Ice Shard, Lightning Bolt
   
5. **Archer** - Balanced ranged attacker
   - Health: 110 | Defense: 3 | Speed: 3.8
   - Abilities: Rapid Shot, Power Shot, Volley
   
6. **Paladin** - Balanced fighter with support abilities
   - Health: 140 | Defense: 6 | Speed: 3.0
   - Abilities: Holy Strike, Divine Shield, Healing Light

### Combat System
- **3 unique abilities per warrior** with different damage, range, and cooldowns
- **Projectile-based attacks** with realistic trajectory physics
- **Defense-based damage reduction** for strategic depth
- **Cooldown timers** (5-15 seconds) for ability balance
- **Visual feedback**: damage numbers, projectile animations, glow effects
- **Obstacle collision**: projectiles blocked by walls and barriers

### AI System
- **9 AI opponents** using different warrior classes for variety
- **Warrior-specific movement speeds** for realistic gameplay
- **Smart pathfinding** around obstacles
- **Orb collection** and pillar targeting behavior
- **Varied combat styles** based on warrior class

### Visual Design (Arcade Art Style)
- **Neon color palette** with vibrant hues and glow effects
- **Gradient backgrounds** (purple to blue theme)
- **Shadow and depth effects** on all UI elements
- **Animated projectiles** with warrior-specific colors
- **Floating damage numbers** with fade-out animations
- **Glowing attack buttons** with cooldown overlays
- **Character-centered home screen** with battle button in corner

## Technical Architecture

### Project Structure
```
/utils
  - warriors.ts          # 6 warrior class definitions
  - gameLogic.ts         # Core game mechanics
  - constants.ts         # Game configuration
/screens
  - HomeScreen.tsx       # Arcade-style main menu
  - WarriorSelectScreen.tsx  # Character selection
  - GameScreen.tsx       # Main battle arena
/components
  - AttackButton.tsx     # Ability buttons with cooldowns
  - HealthBar.tsx        # Health display
/navigation
  - RootStackNavigator.tsx  # Screen navigation
```

### Key Technologies
- **React Native** with Expo SDK 54
- **TypeScript** for type safety
- **React Navigation** for screen flow
- **Expo Linear Gradient** for visual effects
- **Interval-based game loops** for smooth gameplay

### Performance Optimizations
- **Ref-based state management** in game loops to prevent re-initialization
- **Efficient collision detection** with distance calculations
- **Optimized rendering** with conditional visibility
- **Obstacle caching** in refs for fast access

## Game Mechanics

### Victory Conditions
1. **Last Player Standing** - Eliminate all opponents
2. **Time Victory** - Most orbs collected when time expires
3. **Orb Completion** - Collect orbs from all 5 pillars

### Combat Balance
- **Damage range**: 15-60 per ability
- **Health range**: 90-180 per warrior
- **Defense reduction**: 0%-40% damage mitigation
- **Movement speeds**: 2.8-4.5 units/frame
- **Cooldowns**: 5-15 seconds per ability

### Map Layout
- **5 Shadow Orb pillars** strategically placed
- **30+ obstacles** for cover and tactical positioning
- **2400x2400 playing field** (3x larger than MVP)
- **Varied obstacle sizes**: 60-150px for visual interest

## Development Status

### Completed Features ✓
- [x] 6 unique warrior classes with stats and abilities
- [x] Warrior selection screen with character preview
- [x] Arcade-style home screen (horizontal layout, neon design)
- [x] Expanded 2400x2400 battlefield with 32+ obstacles
- [x] Attack system with 3 abilities per warrior
- [x] Projectile trajectories with physics and collision
- [x] Cooldown system with visual UI feedback
- [x] Defense-based damage calculations
- [x] Warrior-specific movement speeds
- [x] Visual effects (damage numbers, projectile glows)
- [x] AI diversity (each AI uses different warrior class)
- [x] Landscape orientation lock for mobile
- [x] Full arcade art style implementation

### Pending Features
- [ ] 3D/isometric rendering with depth
- [ ] Progress tracking (kills, damage, accuracy)
- [ ] Advanced AI attack patterns

## Recent Changes (November 19, 2025)

### Attack System Integration
- Added attack buttons to game HUD with cooldown display
- Integrated handleAbilityUse for creating projectiles
- Fixed critical game loop bug by removing volatile state from dependency array
- Added playersRef and projectilesRef for continuous interval execution
- Verified all systems working: cooldowns tick down, projectiles move, damage applies

### Code Quality
- No LSP errors or type issues
- Proper dependency arrays to prevent infinite loops
- Architect-reviewed and approved for production
- Stable game loops with ref-based state access

## User Preferences
- Focus on mobile-first design with landscape orientation
- Arcade aesthetic with vibrant colors and effects
- Strategic gameplay with warrior diversity
- Professional polish and visual feedback

## How to Play
1. **Select Your Warrior** - Choose from 6 unique classes
2. **Enter the Arena** - Battle 9 AI opponents
3. **Use Your Abilities** - Tap ability buttons to attack
4. **Collect Shadow Orbs** - Touch pillars to collect orbs
5. **Win** - Be the last standing or collect the most orbs

## Next Steps (Optional Enhancements)
- Implement 3D isometric rendering for enhanced visuals
- Add detailed progress tracking and leaderboards
- Create advanced AI with dodging and strategic positioning
- Add sound effects and music
- Implement multiplayer support
