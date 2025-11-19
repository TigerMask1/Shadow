import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { Spacing } from "@/constants/theme";
import { WarriorAbility } from "@/utils/warriors";

interface AttackButtonProps {
  ability: WarriorAbility;
  onPress: () => void;
  cooldown: number;
  index: number;
}

export function AttackButton({ ability, onPress, cooldown, index }: AttackButtonProps) {
  const scale = useSharedValue(1);
  const cooldownProgress = useSharedValue(1);

  React.useEffect(() => {
    if (cooldown > 0) {
      cooldownProgress.value = withTiming(0, { duration: cooldown * 1000 });
    } else {
      cooldownProgress.value = withTiming(1, { duration: 200 });
    }
  }, [cooldown]);

  const handlePress = () => {
    if (cooldown <= 0) {
      scale.value = withSpring(0.85, { damping: 10 }, () => {
        scale.value = withSpring(1, { damping: 10 });
      });
      onPress();
    }
  };

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const cooldownStyle = useAnimatedStyle(() => ({
    height: `${cooldownProgress.value * 100}%`,
  }));

  const isOnCooldown = cooldown > 0;

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isOnCooldown}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: ability.color + (isOnCooldown ? "60" : "E6"),
            borderColor: ability.color,
          },
          scaleStyle,
        ]}
      >
        <View style={styles.cooldownOverlay}>
          <Animated.View
            style={[
              styles.cooldownFill,
              { backgroundColor: "#000000" + "80" },
              cooldownStyle,
            ]}
          />
        </View>

        <ThemedText style={styles.indexText}>{index + 1}</ThemedText>

        {isOnCooldown && (
          <ThemedText style={styles.cooldownText}>
            {cooldown.toFixed(1)}s
          </ThemedText>
        )}

        <ThemedText style={styles.abilityName} numberOfLines={1}>
          {ability.name}
        </ThemedText>
        <ThemedText style={styles.abilityDamage}>
          {ability.damage} DMG
        </ThemedText>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
    overflow: "hidden",
  },
  cooldownOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  cooldownFill: {
    width: "100%",
  },
  indexText: {
    position: "absolute",
    top: 4,
    right: 8,
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cooldownText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  abilityName: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginTop: 2,
  },
  abilityDamage: {
    fontSize: 8,
    fontWeight: "600",
    color: "#FFFFFF",
    opacity: 0.9,
  },
});
