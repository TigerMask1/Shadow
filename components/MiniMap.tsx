import React from "react";
import { StyleSheet, View } from "react-native";
import { Player, Pillar, MAP_WIDTH, MAP_HEIGHT } from "@/utils/gameLogic";
import { GameColors } from "@/constants/theme";

interface MiniMapProps {
  players: Player[];
  pillars: Pillar[];
  size?: number;
}

export function MiniMap({ players, pillars, size = 120 }: MiniMapProps) {
  const scale = size / Math.max(MAP_WIDTH, MAP_HEIGHT);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.mapBackground}>
        {pillars.map((pillar) => (
          <View
            key={`pillar-${pillar.id}`}
            style={[
              styles.miniPillar,
              {
                left: pillar.x * scale - 3,
                top: pillar.y * scale - 3,
                backgroundColor: pillar.isTarget
                  ? GameColors.pillarTarget
                  : GameColors.pillarInactive,
              },
            ]}
          />
        ))}

        {players.map((player) =>
          player.isDead ? null : (
            <View
              key={`player-${player.id}`}
              style={[
                styles.miniPlayer,
                {
                  left: player.x * scale - 2.5,
                  top: player.y * scale - 2.5,
                  backgroundColor: player.color,
                  borderColor: player.hasOrb ? GameColors.orbGlow : "transparent",
                  borderWidth: player.hasOrb ? 1.5 : 0,
                },
              ]}
            />
          )
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GameColors.background + "E6",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: GameColors.primaryAccent + "60",
  },
  mapBackground: {
    flex: 1,
    position: "relative",
    backgroundColor: GameColors.background + "40",
  },
  miniPillar: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  miniPlayer: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});
