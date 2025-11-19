import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeInDown,
  FadeInUp,
  BounceIn,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import Spacer from "@/components/Spacer";
import { Spacing } from "@/constants/theme";
import { GameColors } from "@/constants/theme";

interface GameOverScreenProps {
  navigation: any;
  route: {
    params: {
      result: "deposit" | "elimination" | "eliminated";
      survivalTime: number;
      eliminations: number;
    };
  };
}

export default function GameOverScreen({ navigation, route }: GameOverScreenProps) {
  const insets = useSafeAreaInsets();
  const { result, survivalTime, eliminations } = route.params;

  const isVictory = result === "deposit" || result === "elimination";

  const getResultText = () => {
    switch (result) {
      case "deposit":
        return "Victory by Deposit!";
      case "elimination":
        return "Victory by Elimination!";
      case "eliminated":
        return "Eliminated";
      default:
        return "Match Over";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
        <Animated.View entering={BounceIn.duration(600)}>
          <View
            style={[
              styles.resultBanner,
              {
                backgroundColor: isVictory
                  ? GameColors.success + "30"
                  : GameColors.danger + "30",
                borderColor: isVictory ? GameColors.success : GameColors.danger,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.resultText,
                { color: isVictory ? GameColors.success : GameColors.danger },
              ]}
            >
              {getResultText()}
            </ThemedText>
          </View>
        </Animated.View>

        <Spacer height={Spacing["4xl"]} />

        <Animated.View entering={FadeInUp.delay(300).duration(600)}>
          <Card elevation={2}>
            <ThemedText style={styles.statsTitle}>Match Summary</ThemedText>
            <Spacer height={Spacing.lg} />

            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Survival Time</ThemedText>
              <ThemedText style={styles.statValue}>{formatTime(survivalTime)}</ThemedText>
            </View>

            <Spacer height={Spacing.md} />

            <View style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Eliminations</ThemedText>
              <ThemedText style={styles.statValue}>{eliminations}</ThemedText>
            </View>
          </Card>
        </Animated.View>

        <Spacer height={Spacing["4xl"]} />

        <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.buttonContainer}>
          <Button
            title="Return to Home"
            onPress={() => navigation.navigate("Home")}
            style={styles.button}
          />
        </Animated.View>
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
    paddingHorizontal: Spacing["2xl"],
    justifyContent: "center",
  },
  resultBanner: {
    paddingVertical: Spacing["2xl"],
    paddingHorizontal: Spacing["3xl"],
    borderRadius: 16,
    borderWidth: 3,
    alignItems: "center",
  },
  resultText: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: GameColors.neutralText,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 16,
    color: GameColors.neutralText,
    opacity: 0.8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: GameColors.orbGlow,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    height: 56,
  },
});
