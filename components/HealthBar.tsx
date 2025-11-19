import React from "react";
import { StyleSheet, View } from "react-native";
import { GameColors } from "@/constants/theme";

interface HealthBarProps {
  health: number;
  maxHealth: number;
  width?: number;
  height?: number;
}

export function HealthBar({ health, maxHealth, width = 30, height = 4 }: HealthBarProps) {
  const healthPercentage = Math.max(0, Math.min(100, (health / maxHealth) * 100));

  const getHealthColor = () => {
    if (healthPercentage > 60) return GameColors.success;
    if (healthPercentage > 30) return "#ffd60a";
    return GameColors.danger;
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <View
        style={[
          styles.healthFill,
          {
            width: `${healthPercentage}%`,
            backgroundColor: getHealthColor(),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GameColors.background + "80",
    borderRadius: 2,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: GameColors.neutralText + "40",
  },
  healthFill: {
    height: "100%",
  },
});
