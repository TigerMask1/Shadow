import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import Spacer from "@/components/Spacer";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { GameColors } from "@/constants/theme";

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <LinearGradient
      colors={[GameColors.background, GameColors.primaryAccent + "20"]}
      style={styles.container}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.titleContainer}>
          <Animated.View style={[styles.orbContainer, pulseStyle]}>
            <View style={styles.orb} />
          </Animated.View>
          <Spacer height={Spacing["4xl"]} />
          <ThemedText style={styles.title}>SHADOW ORB</ThemedText>
          <Spacer height={Spacing.sm} />
          <ThemedText style={styles.subtitle}>
            Hunt or be hunted. Deposit the orb to win.
          </ThemedText>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Start Match"
            onPress={() => navigation.navigate("Matchmaking")}
            style={styles.startButton}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing["2xl"],
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orbContainer: {
    width: 120,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: BorderRadius.full,
    backgroundColor: GameColors.orbGlow,
    shadowColor: GameColors.orbGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "700",
    textAlign: "center",
    color: GameColors.neutralText,
    letterSpacing: 2,
    textShadowColor: GameColors.orbGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: GameColors.neutralText,
    opacity: 0.8,
  },
  buttonContainer: {
    width: "100%",
    gap: Spacing.md,
  },
  startButton: {
    height: 56,
  },
});
