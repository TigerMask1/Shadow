import React from "react";
import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { GameColors } from "@/constants/theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const pulseScale = useSharedValue(1);
  const glowScale = useSharedValue(1);
  const borderGlow = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1800 }),
        withTiming(1, { duration: 1800 })
      ),
      -1,
      false
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 2200 }),
        withTiming(1, { duration: 2200 })
      ),
      -1,
      false
    );

    borderGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.5, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: 0.6,
  }));

  const borderStyle = useAnimatedStyle(() => ({
    opacity: borderGlow.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleBattlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    buttonScale.value = withSequence(
      withSpring(0.9, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );
    setTimeout(() => navigation.navigate("WarriorSelect"), 100);
  };

  return (
    <LinearGradient
      colors={["#0A0014", "#1A0A2E", "#0D0221"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.arcadeGrid} />
      
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.md,
            paddingBottom: insets.bottom + Spacing.md,
            paddingLeft: insets.left + Spacing.lg,
            paddingRight: insets.right + Spacing.lg,
          },
        ]}
      >
        <View style={styles.topBar}>
          <ThemedText style={styles.logoText}>SHADOW ORB</ThemedText>
          <View style={styles.scoreDisplay}>
            <ThemedText style={styles.scoreLabel}>HIGH SCORE</ThemedText>
            <ThemedText style={styles.scoreValue}>9999</ThemedText>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.leftSection}>
            <View style={styles.titleSection}>
              <ThemedText style={styles.arcadeTitle}>BATTLE</ThemedText>
              <ThemedText style={styles.arcadeTitle}>ROYALE</ThemedText>
              <Spacer height={Spacing.md} />
              <ThemedText style={styles.tagline}>
                FIGHT. SURVIVE. CONQUER.
              </ThemedText>
              <Spacer height={Spacing.lg} />
              <View style={styles.infoBox}>
                <ThemedText style={styles.infoText}>⚡ 10 WARRIORS</ThemedText>
                <ThemedText style={styles.infoText}>⚔️ EPIC BATTLES</ThemedText>
                <ThemedText style={styles.infoText}>🏆 ONE VICTOR</ThemedText>
              </View>
            </View>
          </View>

          <View style={styles.centerSection}>
            <Animated.View style={[styles.glowRing, glowStyle]} />
            <Animated.View style={[styles.characterContainer, pulseStyle]}>
              <View style={styles.characterCircle}>
                <LinearGradient
                  colors={[GameColors.orbGlow, GameColors.primaryAccent, "#FF00FF"]}
                  style={styles.gradientCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                />
              </View>
              <Animated.View style={[styles.borderRing, borderStyle]} />
            </Animated.View>
            <ThemedText style={styles.characterLabel}>SELECT YOUR WARRIOR</ThemedText>
          </View>

          <View style={styles.rightSection} />
        </View>

        <TouchableOpacity
          style={[
            styles.battleButton,
            {
              right: insets.right + Spacing.lg,
              bottom: insets.bottom + Spacing.lg,
            },
          ]}
          onPress={handleBattlePress}
          activeOpacity={0.9}
        >
          <Animated.View style={buttonAnimatedStyle}>
            <LinearGradient
              colors={["#FF00FF", "#8B00FF", "#FF00AA"]}
              style={styles.battleButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <ThemedText style={styles.battleButtonText}>BATTLE</ThemedText>
              <ThemedText style={styles.battleButtonSubtext}>START</ThemedText>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arcadeGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  content: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#FF00FF" + "80",
    paddingBottom: Spacing.md,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FF00FF",
    letterSpacing: 4,
    textShadowColor: "#FF00FF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  scoreDisplay: {
    alignItems: "flex-end",
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#00FFFF",
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFD700",
    textShadowColor: "#FFD700",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  mainContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flex: 1,
    justifyContent: "center",
  },
  titleSection: {
    paddingLeft: Spacing.xl,
  },
  arcadeTitle: {
    fontSize: 48,
    fontWeight: "900",
    color: "#00FFFF",
    letterSpacing: 6,
    textShadowColor: "#00FFFF",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 12,
    lineHeight: 52,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF00AA",
    letterSpacing: 3,
    textShadowColor: "#FF00AA",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  infoBox: {
    backgroundColor: "#1A0A2E" + "CC",
    borderWidth: 2,
    borderColor: "#FF00FF",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  centerSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: GameColors.orbGlow,
    opacity: 0.3,
  },
  characterContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  characterCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#FF00FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 20,
  },
  gradientCircle: {
    width: "100%",
    height: "100%",
  },
  borderRing: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: "#00FFFF",
    shadowColor: "#00FFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
  },
  characterLabel: {
    marginTop: Spacing.lg,
    fontSize: 14,
    fontWeight: "800",
    color: "#FFD700",
    letterSpacing: 2,
    textShadowColor: "#FFD700",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rightSection: {
    flex: 1,
  },
  battleButton: {
    position: "absolute",
    width: 140,
    height: 140,
  },
  battleButtonGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#FF00FF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 15,
  },
  battleButtonText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 3,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  battleButtonSubtext: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2,
    opacity: 0.9,
  },
});
