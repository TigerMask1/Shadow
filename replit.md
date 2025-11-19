# Shadow Orb Battle Royale

## Overview

Shadow Orb is a mobile battle royale game built with React Native and Expo. Players compete in 10-player matches where they collect shadow orbs and deposit them at designated pillars while avoiding elimination. The game features real-time movement controls via a virtual joystick, a circular arena with strategic pillar placement, and multiple victory conditions (successful orb deposit or last player standing).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Mobile Application Framework

**Problem**: Need to build a cross-platform mobile game that runs on iOS and Android with native performance.

**Solution**: React Native with Expo SDK 54, utilizing the new architecture enabled for improved performance.

**Rationale**: 
- Expo provides managed workflow for easier deployment and updates
- React Native 0.81.5 with new architecture enabled improves rendering performance critical for games
- React 19.1.0 with experimental React Compiler for optimized re-renders
- Cross-platform support reduces development time

**Pros**: Single codebase, rapid iteration, managed builds, extensive library ecosystem
**Cons**: Some performance overhead vs native, limited access to certain native APIs

### Navigation Architecture

**Problem**: Need stack-based navigation for linear game flow (Home → Matchmaking → Game → GameOver).

**Solution**: React Navigation v7 with native-stack navigator, implementing transparent headers with blur effects.

**Design Pattern**: Stack-only navigation with no tabs or drawer - appropriate for game flow where screens shouldn't be randomly accessible.

**Key Decisions**:
- Transparent headers with platform-specific blur effects (iOS native blur, Android fallback)
- Gesture-based navigation disabled during gameplay to prevent accidental exits
- Centralized screen options with theme-aware styling

### Animation System

**Problem**: Need smooth, performant animations for UI interactions and game elements.

**Solution**: React Native Reanimated v4.1.1 with Worklets for animations running on UI thread.

**Implementation**:
- Shared values for state that doesn't require React re-renders
- Spring-based animations for natural feel (buttons, cards)
- Worklets for gesture handling in joystick component
- Repeat animations for ambient effects (pulsing orb, loading indicators)

**Pros**: 60 FPS animations, runs on UI thread, declarative API
**Cons**: Steeper learning curve than Animated API

### Game State Management

**Problem**: Real-time game state updates for player positions, collisions, and game logic.

**Solution**: React hooks with refs for velocity tracking and intervals for game loop.

**Architecture**:
- `useRef` for high-frequency data (player velocity) to avoid re-renders
- `useState` for UI-relevant state (player positions, game time, alive count)
- `setInterval` for game loop (60 FPS target) handling movement, collisions, AI
- Centralized game logic in `/utils/gameLogic.ts` with pure functions

**Key Components**:
- Collision detection between players (orb stealing)
- Distance checking for pillar deposits
- AI behavior for bot players with state machine (moving to pillar, fleeing, chasing)
- Game timer with win conditions

### UI Component System

**Problem**: Need consistent, theme-aware components across screens.

**Solution**: Custom themed components with light/dark mode support.

**Component Architecture**:
- `ThemedView` and `ThemedText`: Base components that consume theme context
- `Button` and `Card`: Interactive components with spring animations
- Screen wrappers (`ScreenScrollView`, `ScreenKeyboardAwareScrollView`, `ScreenFlatList`): Handle safe areas and header heights consistently
- `Joystick`: Custom gesture-based control using pan gestures

**Theme System**:
- Elevation-based background colors (0-3 levels)
- Separate game colors for in-game UI vs app UI
- Platform-specific adaptations (web fallbacks for keyboard awareness)

### Input Handling

**Problem**: Need responsive touch controls for real-time gameplay.

**Solution**: Custom joystick component using React Native Gesture Handler v2.28.

**Implementation**:
- Pan gesture for continuous movement input
- Normalized velocity output (-1 to 1 for x/y axes)
- Visual feedback with animated thumb position
- Spring animation for thumb return on release

**Design Choice**: Virtual joystick over tilt controls for precision and accessibility.

### Error Boundaries

**Problem**: Need graceful error handling to prevent app crashes.

**Solution**: Class-based ErrorBoundary with custom fallback UI.

**Features**:
- Development mode: Shows detailed error stack with toggle
- Production mode: User-friendly error message with restart option
- App reload functionality via `expo.reloadAppAsync()`

**Note**: Error boundaries must use class components per React lifecycle requirements.

### Screen Layout System

**Problem**: Consistent padding and safe area handling across screens.

**Solution**: Custom `useScreenInsets` hook calculating padding from header height and safe area insets.

**Pattern**: All screen wrapper components consume this hook to apply consistent spacing (headerHeight + Spacing.xl top, safeArea bottom + Spacing.xl).

### Platform Adaptations

**Problem**: Different capabilities across iOS, Android, and web platforms.

**Solution**: Platform-specific implementations with graceful degradation.

**Examples**:
- Blur effects: iOS native blur, Android solid backgrounds
- Keyboard handling: Native keyboard controller on mobile, ScrollView fallback on web
- Gestures: Full gesture support on mobile, limited on web

### Code Organization

**Problem**: Maintain clean architecture as project scales.

**Solution**: Feature-based organization with absolute imports.

**Structure**:
- `/screens`: Screen components
- `/components`: Reusable UI components
- `/navigation`: Navigation configuration
- `/hooks`: Custom React hooks
- `/utils`: Pure utility functions (game logic)
- `/constants`: Theme, spacing, typography constants

**Module Resolution**: Babel module resolver with `@/` alias for clean imports.

## External Dependencies

### Core Framework
- **Expo SDK 54**: Managed React Native platform with build services
- **React Native 0.81.5**: Mobile framework with new architecture enabled
- **React 19.1.0**: UI library with experimental compiler

### Navigation
- **React Navigation v7**: Native stack navigator for screen transitions
- **React Navigation Elements**: Header components and utilities

### Animations & Gestures
- **React Native Reanimated v4.1.1**: UI thread animations with worklets
- **React Native Gesture Handler v2.28**: Touch gesture recognition
- **React Native Worklets 0.5.1**: JavaScript worklets for animations

### UI Components
- **Expo Linear Gradient**: Gradient backgrounds
- **Expo Blur**: iOS blur effects
- **Expo Glass Effect**: Platform-specific glass morphism
- **Expo Symbols**: iOS SF Symbols support
- **Expo Image**: Optimized image component

### Device APIs
- **Expo Haptics**: Tactile feedback for game events
- **React Native Keyboard Controller**: Keyboard-aware views
- **React Native Safe Area Context**: Safe area insets

### Developer Tools
- **TypeScript 5.9**: Type safety
- **ESLint with Expo config**: Code linting
- **Prettier**: Code formatting
- **Babel Module Resolver**: Path aliasing

### Future Considerations
The architecture currently supports local/simulated multiplayer. Real multiplayer would require:
- WebSocket server for real-time communication
- Backend API for matchmaking and user accounts
- Authentication service (Apple Sign-In, Google Sign-In mentioned in design docs)
- Database for player profiles and match history (design mentions SSO requirement)