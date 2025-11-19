# Design Guidelines: Shadow Orb Battle Royale

## Authentication & User Profile
**Authentication Required**: Multiplayer matchmaking requires user accounts.
- **Implementation**: Use SSO (Apple Sign-In for iOS, Google Sign-In for Android)
- **Login Flow**: Simple login screen with SSO buttons, game title, and tagline
- **Profile Screen**: 
  - Player avatar (generate 8 futuristic/mystical warrior avatars matching the shadow orb theme)
  - Display name
  - Match statistics (wins, total matches, orb deposits)
  - Settings: audio toggle, haptic feedback toggle, logout button

## Navigation Architecture
**Stack-Only Navigation**: Linear game flow from home → matchmaking → game → results

### Screen Flow:
1. **Home Screen** → Start Match (transitions to Matchmaking)
2. **Matchmaking Screen** → Finding players (transitions to Game when 10 players ready)
3. **Game Screen** → Active gameplay
4. **Game Over Screen** → Results & return to Home

## Screen Specifications

### 1. Home Screen
**Purpose**: Entry point to start matchmaking

**Layout**:
- Header: Transparent, no navigation buttons, displays game logo centered
- Main content (centered, non-scrollable):
  - Large game title
  - "Start Match" primary action button (prominent, glowing effect)
  - Secondary button: "Profile" (smaller, ghost style)
- Safe area insets: top: insets.top + Spacing.xl, bottom: insets.bottom + Spacing.xl

**Visual Elements**:
- Atmospheric background with shadow/mystic theme
- Pulsing shadow orb asset as background decoration
- Particle effects for ambiance

### 2. Matchmaking Screen
**Purpose**: Show matchmaking progress

**Layout**:
- Header: Transparent with left "Cancel" button
- Main content (centered, non-scrollable):
  - Loading spinner with shadow orb visual
  - Player count indicator (X/10 players)
  - Animated "Finding players..." text
- Safe area insets: top: headerHeight + Spacing.xl, bottom: insets.bottom + Spacing.xl

### 3. Game Screen
**Purpose**: Main gameplay area

**Layout**:
- Header: None (full screen game)
- HUD Overlay (non-intrusive, positioned at safe edges):
  - Top-left: Match timer (countdown from 10:00)
  - Top-right: Mini player count (survivors remaining)
  - Bottom: On-screen joystick (left side for movement)
  - Bottom-right: Orb status indicator (only visible when player has orb, shows target pillar icon)
  - Center flash notifications: "You got the orb!", "Target: Pillar X", "Player eliminated"
- Game canvas fills entire screen
- Safe area insets: All HUD elements respect insets + Spacing.md

**Game Map Design**:
- Top-down 2D view
- 8 shadow pillars distributed evenly around the map (octagonal pattern)
- Pillars are distinct landmarks with mystical glow
- Player represented as simple avatar with colored outline
- Orb holder has special visual effect (shadow aura, glowing outline)
- Target pillar for orb holder glows differently than others
- Dead players fade out

**Visual Feedback**:
- Haptic feedback when collecting orb, eliminating player, or being eliminated
- Screen shake on elimination
- Orb pickup animation with sound effect
- Pillar deposit animation with particle effects

### 4. Game Over Screen
**Purpose**: Display match results

**Layout**:
- Header: None (modal-style overlay)
- Main content (centered, scrollable if needed):
  - Victory/defeat banner with animation
  - Match summary card:
    - Result (Won by deposit / Won by elimination / Eliminated)
    - Survival time
    - Eliminations made
  - "Return to Home" button
- Safe area insets: top: insets.top + Spacing.xl, bottom: insets.bottom + Spacing.xl

## Design System

### Color Palette
**Primary Theme**: Dark mystical/shadow aesthetic
- **Background**: Deep purple-black (#1a0f2e)
- **Primary Accent**: Ethereal purple (#9d4edd)
- **Secondary Accent**: Shadow blue (#4361ee)
- **Orb Glow**: Vibrant violet (#c77dff)
- **Success/Safe**: Muted teal (#06ffa5)
- **Danger/Elimination**: Deep crimson (#ff006e)
- **Neutral Text**: Light gray (#e0e1dd)
- **Pillar Inactive**: Dark gray with subtle glow (#3c3f51)
- **Pillar Target**: Bright gold (#ffd60a)

### Typography
- **Game Title**: Bold, 42pt, uppercase, with subtle glow effect
- **Headers**: Semibold, 24pt
- **Body**: Regular, 16pt
- **HUD Text**: Medium, 14pt, high contrast with background
- **Timer**: Monospace, 18pt

### Component Specifications

**Primary Button (Start Match)**:
- Height: 56px
- Border radius: 12px
- Background: Linear gradient (Primary → Secondary Accent)
- Glow effect: shadowOpacity 0.4, shadowRadius 8
- Pressed state: Scale down 0.96, increase glow

**Joystick**:
- Outer circle: 120px diameter, semi-transparent dark (#1a0f2e80)
- Inner thumb: 50px diameter, primary accent color
- Pressed feedback: Thumb scales to 54px

**Orb Status Indicator**:
- Floating pill at bottom-right
- Background: Semi-transparent orb glow color
- Icon: Target pillar number
- Subtle pulsing animation
- Shadow: width 0, height 2, opacity 0.10, radius 2

**HUD Elements**:
- Background: Semi-transparent dark cards (#1a0f2e90)
- Border radius: 8px
- Padding: Spacing.md
- Text: High contrast white

### Critical Assets

1. **Shadow Orb Asset**: Glowing mystical sphere with particle trail (animated)
2. **Shadow Pillar Assets**: 8 identical pillar models with glow variants (idle, active, target)
3. **Player Avatars**: 8 unique warrior silhouettes for profile selection (geometric, minimalist style matching shadow theme)
4. **Game Logo**: Stylized text with shadow orb integration
5. **Victory/Defeat Banners**: Animated overlay graphics

### Accessibility
- High contrast mode for HUD elements
- Haptic feedback for important game events (toggle-able)
- Audio cues for orb collection, elimination, timer warnings
- Joystick has minimum 44pt touch target
- All buttons minimum 44pt height

### Interaction Design
- All buttons provide immediate visual and haptic feedback
- Screen transitions use fade animations (300ms)
- Game events trigger particle effects and screen effects
- Elimination shows brief slow-motion effect
- Orb collection shows radial burst animation
- Victory celebration animation with confetti/particle effects