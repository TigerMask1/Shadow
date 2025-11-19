import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import Spacer from "@/components/Spacer";
import { Spacing } from "@/constants/theme";
import { GameColors } from "@/constants/theme";

export default function MatchmakingScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [playerCount, setPlayerCount] = React.useState(1);

  const opacity = useSharedValue(0.5);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setPlayerCount((prev) => {
        if (prev >= 10) {
          clearInterval(timer);
          setTimeout(() => navigation.replace("Game"), 500);
          return 10;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
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
            paddingTop: insets.top + 100 + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={GameColors.orbGlow} />
          <Spacer height={Spacing["3xl"]} />
          <Animated.View style={animatedStyle}>
            <ThemedText style={styles.findingText}>
              Finding players...
            </ThemedText>
          </Animated.View>
          <Spacer height={Spacing.lg} />
          <ThemedText style={styles.countText}>
            {playerCount}/10 players
          </ThemedText>
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
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    alignItems: "center",
  },
  findingText: {
    fontSize: 20,
    color: GameColors.neutralText,
    fontWeight: "600",
  },
  countText: {
    fontSize: 24,
    color: GameColors.orbGlow,
    fontWeight: "700",
  },
});
