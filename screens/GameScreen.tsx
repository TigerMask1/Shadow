import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Joystick } from "@/components/Joystick";
import { Spacing } from "@/constants/theme";
import { GameColors } from "@/constants/theme";
import {
  Player,
  Pillar,
  createPillars,
  createPlayers,
  checkCollision,
  getRandomTargetPillar,
  PLAYER_SIZE,
  PILLAR_SIZE,
  COLLISION_DISTANCE,
  DEPOSIT_DISTANCE,
  MAP_WIDTH,
  MAP_HEIGHT,
} from "@/utils/gameLogic";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const GAME_DURATION = 600;

export default function GameScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [pillars, setPillars] = React.useState<Pillar[]>([]);
  const [targetPillarId, setTargetPillarId] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(GAME_DURATION);
  const [alivePlayers, setAlivePlayers] = React.useState(10);
  const velocityRef = React.useRef({ x: 0, y: 0 });
  const gameLoopRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const newPlayers = createPlayers();
    const newPillars = createPillars();
    const initialTargetId = getRandomTargetPillar();

    setPlayers(newPlayers);
    setPillars(
      newPillars.map((p) => ({
        ...p,
        isTarget: p.id === initialTargetId,
      }))
    );
    setTargetPillarId(initialTargetId);

    gameLoopRef.current = setInterval(() => {
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player, index) => {
          if (player.isDead) return player;

          let newX = player.x;
          let newY = player.y;

          if (index === 0) {
            newX += velocityRef.current.x * 3;
            newY += velocityRef.current.y * 3;

            newX = Math.max(PLAYER_SIZE, Math.min(MAP_WIDTH - PLAYER_SIZE, newX));
            newY = Math.max(PLAYER_SIZE, Math.min(MAP_HEIGHT - PLAYER_SIZE, newY));
          } else {
            const orbHolder = prevPlayers.find((p) => p.hasOrb);
            if (orbHolder && !orbHolder.isDead) {
              const dx = orbHolder.x - player.x;
              const dy = orbHolder.y - player.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance > 50) {
                newX += (dx / distance) * 1.5;
                newY += (dy / distance) * 1.5;
              }
            }
          }

          return { ...player, x: newX, y: newY };
        });
      });
    }, 16);

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          if (gameLoopRef.current) clearInterval(gameLoopRef.current);
          navigation.replace("GameOver", {
            result: "eliminated",
            survivalTime: GAME_DURATION,
            eliminations: 0,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      clearInterval(timerInterval);
    };
  }, [navigation]);

  React.useEffect(() => {
    const player = players[0];
    if (!player || player.isDead) return;

    const orbHolder = players.find((p) => p.hasOrb && !p.isDead);
    if (!orbHolder) return;

    const targetPillar = pillars.find((p) => p.isTarget);
    if (!targetPillar) return;

    if (
      orbHolder.id === 0 &&
      checkCollision(
        orbHolder.x,
        orbHolder.y,
        targetPillar.x,
        targetPillar.y,
        DEPOSIT_DISTANCE
      )
    ) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      navigation.replace("GameOver", {
        result: "deposit",
        survivalTime: GAME_DURATION - timeLeft,
        eliminations: 10 - alivePlayers,
      });
      return;
    }

    players.forEach((otherPlayer, index) => {
      if (
        index !== 0 &&
        !otherPlayer.isDead &&
        checkCollision(player.x, player.y, otherPlayer.x, otherPlayer.y, COLLISION_DISTANCE)
      ) {
        if (player.hasOrb) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          if (gameLoopRef.current) clearInterval(gameLoopRef.current);
          navigation.replace("GameOver", {
            result: "eliminated",
            survivalTime: GAME_DURATION - timeLeft,
            eliminations: 10 - alivePlayers,
          });
        } else if (otherPlayer.hasOrb) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setPlayers((prev) =>
            prev.map((p) => {
              if (p.id === index) return { ...p, isDead: true, hasOrb: false };
              if (p.id === 0) return { ...p, hasOrb: true };
              return p;
            })
          );
          setAlivePlayers((prev) => prev - 1);

          const newTargetId = getRandomTargetPillar(targetPillarId);
          setTargetPillarId(newTargetId);
          setPillars((prev) =>
            prev.map((p) => ({ ...p, isTarget: p.id === newTargetId }))
          );
        }
      }
    });
  }, [players, pillars, targetPillarId, timeLeft, alivePlayers, navigation]);

  const handleJoystickMove = (x: number, y: number) => {
    velocityRef.current = { x, y };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const player = players[0];
  const cameraX = player ? SCREEN_WIDTH / 2 - player.x : 0;
  const cameraY = player ? SCREEN_HEIGHT / 2 - player.y : 0;

  return (
    <View style={[styles.container, { backgroundColor: GameColors.background }]}>
      <View style={[styles.mapContainer, { transform: [{ translateX: cameraX }, { translateY: cameraY }] }]}>
        <View style={[styles.map, { width: MAP_WIDTH, height: MAP_HEIGHT }]}>
          {pillars.map((pillar) => (
            <View
              key={pillar.id}
              style={[
                styles.pillar,
                {
                  left: pillar.x - PILLAR_SIZE / 2,
                  top: pillar.y - PILLAR_SIZE / 2,
                  backgroundColor: pillar.isTarget
                    ? GameColors.pillarTarget
                    : GameColors.pillarInactive,
                  shadowColor: pillar.isTarget
                    ? GameColors.pillarTarget
                    : GameColors.pillarInactive,
                },
              ]}
            />
          ))}

          {players.map((p) =>
            p.isDead ? null : (
              <View
                key={p.id}
                style={[
                  styles.player,
                  {
                    left: p.x - PLAYER_SIZE / 2,
                    top: p.y - PLAYER_SIZE / 2,
                    backgroundColor: p.color,
                    borderColor: p.hasOrb ? GameColors.orbGlow : "transparent",
                    borderWidth: p.hasOrb ? 4 : 0,
                    shadowColor: p.hasOrb ? GameColors.orbGlow : p.color,
                  },
                ]}
              />
            )
          )}
        </View>
      </View>

      <View
        style={[
          styles.hud,
          {
            paddingTop: insets.top + Spacing.md,
            paddingBottom: insets.bottom + Spacing.md,
          },
        ]}
      >
        <View style={styles.hudTop}>
          <View style={styles.hudItem}>
            <ThemedText style={styles.hudText}>{formatTime(timeLeft)}</ThemedText>
          </View>
          <View style={styles.hudItem}>
            <ThemedText style={styles.hudText}>{alivePlayers} alive</ThemedText>
          </View>
        </View>

        <View style={styles.hudBottom}>
          <View style={[styles.joystickContainer, { left: Spacing["2xl"] }]}>
            <Joystick onMove={handleJoystickMove} />
          </View>

          {player?.hasOrb ? (
            <View
              style={[
                styles.orbIndicator,
                { right: Spacing["2xl"], bottom: Spacing["2xl"] },
              ]}
            >
              <ThemedText style={styles.orbText}>Pillar {targetPillarId + 1}</ThemedText>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    backgroundColor: GameColors.background + "40",
  },
  pillar: {
    position: "absolute",
    width: PILLAR_SIZE,
    height: PILLAR_SIZE,
    borderRadius: PILLAR_SIZE / 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 5,
  },
  player: {
    position: "absolute",
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    borderRadius: PLAYER_SIZE / 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 3,
  },
  hud: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "box-none",
  },
  hudTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing["2xl"],
  },
  hudItem: {
    backgroundColor: GameColors.background + "E6",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  hudText: {
    color: GameColors.neutralText,
    fontSize: 14,
    fontWeight: "600",
  },
  hudBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: "box-none",
  },
  joystickContainer: {
    position: "absolute",
    bottom: Spacing["2xl"],
  },
  orbIndicator: {
    position: "absolute",
    backgroundColor: GameColors.orbGlow + "CC",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  orbText: {
    color: GameColors.background,
    fontSize: 16,
    fontWeight: "700",
  },
});
