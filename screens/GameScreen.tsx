import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Joystick } from "@/components/Joystick";
import { MiniMap } from "@/components/MiniMap";
import { HealthBar } from "@/components/HealthBar";
import { Spacing } from "@/constants/theme";
import { GameColors } from "@/constants/theme";
import {
  Player,
  Pillar,
  Obstacle,
  createPillars,
  createPlayers,
  createObstacles,
  checkCollision,
  checkObstacleCollision,
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
const GAME_DURATION = 60;

export default function GameScreen({ navigation, route }: any) {
  const insets = useSafeAreaInsets();
  const { selectedWarrior } = route.params || {};
  const [players, setPlayers] = React.useState<Player[]>([]);
  const [pillars, setPillars] = React.useState<Pillar[]>([]);
  const [obstacles, setObstacles] = React.useState<Obstacle[]>([]);
  const [targetPillarId, setTargetPillarId] = React.useState(0);
  const [timeLeft, setTimeLeft] = React.useState(GAME_DURATION);
  const [alivePlayers, setAlivePlayers] = React.useState(10);
  const [eliminations, setEliminations] = React.useState(0);
  const velocityRef = React.useRef({ x: 0, y: 0 });
  const gameLoopRef = React.useRef<NodeJS.Timeout | null>(null);
  const damageTimerRef = React.useRef<{ [key: string]: number }>({});
  const obstaclesRef = React.useRef<Obstacle[]>([]);

  React.useEffect(() => {
    const newPlayers = createPlayers(selectedWarrior);
    const newPillars = createPillars();
    const newObstacles = createObstacles();
    const initialTargetId = getRandomTargetPillar();

    obstaclesRef.current = newObstacles;
    
    setPlayers(newPlayers);
    setPillars(
      newPillars.map((p) => ({
        ...p,
        isTarget: p.id === initialTargetId,
      }))
    );
    setObstacles(newObstacles);
    setTargetPillarId(initialTargetId);

    gameLoopRef.current = setInterval(() => {
      setPlayers((prevPlayers) => {
        return prevPlayers.map((player, index) => {
          if (player.isDead) return player;

          let newX = player.x;
          let newY = player.y;

          if (index === 0) {
            const potentialX = player.x + velocityRef.current.x * 3;
            const potentialY = player.y + velocityRef.current.y * 3;

            if (!checkObstacleCollision(potentialX, player.y, PLAYER_SIZE, obstaclesRef.current)) {
              newX = potentialX;
            }
            if (!checkObstacleCollision(player.x, potentialY, PLAYER_SIZE, obstaclesRef.current)) {
              newY = potentialY;
            }

            newX = Math.max(PLAYER_SIZE, Math.min(MAP_WIDTH - PLAYER_SIZE, newX));
            newY = Math.max(PLAYER_SIZE, Math.min(MAP_HEIGHT - PLAYER_SIZE, newY));
          } else {
            const orbHolder = prevPlayers.find((p) => p.hasOrb);
            if (orbHolder && !orbHolder.isDead) {
              const dx = orbHolder.x - player.x;
              const dy = orbHolder.y - player.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance > 50) {
                const potentialX = player.x + (dx / distance) * 1.5;
                const potentialY = player.y + (dy / distance) * 1.5;
                
                if (!checkObstacleCollision(potentialX, player.y, PLAYER_SIZE, obstaclesRef.current)) {
                  newX = potentialX;
                }
                if (!checkObstacleCollision(player.x, potentialY, PLAYER_SIZE, obstaclesRef.current)) {
                  newY = potentialY;
                }
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
  }, [navigation, selectedWarrior]);

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
        const now = Date.now();
        const damageKey = player.hasOrb ? `player-${index}` : `orb-${index}`;
        const lastDamage = damageTimerRef.current[damageKey] || 0;
        
        if (now - lastDamage < 500) return;
        
        damageTimerRef.current[damageKey] = now;

        if (player.hasOrb) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setPlayers((prev) =>
            prev.map((p) => {
              if (p.id === 0) {
                const newHealth = p.health - 20;
                if (newHealth <= 0) {
                  setTimeout(() => {
                    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
                    navigation.replace("GameOver", {
                      result: "eliminated",
                      survivalTime: GAME_DURATION - timeLeft,
                      eliminations,
                    });
                  }, 100);
                  return { ...p, health: 0, isDead: true, hasOrb: false };
                }
                return { ...p, health: newHealth };
              }
              return p;
            })
          );
        } else if (otherPlayer.hasOrb) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setPlayers((prev) => {
            const updatedPlayers = prev.map((p) => ({ ...p }));
            const targetPlayer = updatedPlayers[index];
            const localPlayer = updatedPlayers[0];
            
            const newHealth = targetPlayer.health - 20;
            if (newHealth <= 0) {
              setAlivePlayers((a) => a - 1);
              setEliminations((e) => e + 1);
              const newTargetId = getRandomTargetPillar(targetPillarId);
              setTargetPillarId(newTargetId);
              setPillars((prevPillars) =>
                prevPillars.map((pillar) => ({ ...pillar, isTarget: pillar.id === newTargetId }))
              );
              
              targetPlayer.health = 0;
              targetPlayer.isDead = true;
              targetPlayer.hasOrb = false;
              localPlayer.hasOrb = true;
            } else {
              targetPlayer.health = newHealth;
            }
            
            return updatedPlayers;
          });
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
          {obstacles.map((obstacle) => (
            <View
              key={`obstacle-${obstacle.id}`}
              style={[
                styles.obstacle,
                {
                  left: obstacle.x - obstacle.width / 2,
                  top: obstacle.y - obstacle.height / 2,
                  width: obstacle.width,
                  height: obstacle.height,
                  backgroundColor: obstacle.type === "rock" ? "#5a5a5a" : "#3a3a3a",
                  borderRadius: obstacle.type === "rock" ? obstacle.width / 4 : 2,
                },
              ]}
            />
          ))}

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
                style={{
                  position: "absolute",
                  left: p.x - PLAYER_SIZE / 2,
                  top: p.y - PLAYER_SIZE / 2 - 8,
                }}
              >
                <HealthBar health={p.health} maxHealth={p.maxHealth} width={PLAYER_SIZE} height={3} />
                <View
                  style={[
                    styles.player,
                    {
                      backgroundColor: p.color,
                      borderColor: p.hasOrb ? GameColors.orbGlow : "transparent",
                      borderWidth: p.hasOrb ? 4 : 0,
                      shadowColor: p.hasOrb ? GameColors.orbGlow : p.color,
                      marginTop: 2,
                    },
                  ]}
                />
              </View>
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
          <View style={styles.miniMapContainer}>
            <MiniMap players={players} pillars={pillars} size={100} />
          </View>
          <View style={styles.hudItem}>
            <ThemedText style={styles.hudText}>{alivePlayers} alive</ThemedText>
          </View>
        </View>

        <View style={styles.hudBottom}>
          <View style={[styles.joystickContainer, { left: Spacing["2xl"] }]}>
            <Joystick onMove={handleJoystickMove} />
          </View>

          <View style={[styles.playerHealthContainer, { left: Spacing["2xl"], bottom: Spacing["2xl"] + 150 }]}>
            <ThemedText style={styles.healthLabel}>Health</ThemedText>
            {player ? <HealthBar health={player.health} maxHealth={player.maxHealth} width={80} height={8} /> : null}
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
  obstacle: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "#666666",
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
    alignItems: "flex-start",
    paddingHorizontal: Spacing["2xl"],
  },
  miniMapContainer: {
    marginTop: -Spacing.xs,
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
  playerHealthContainer: {
    position: "absolute",
    backgroundColor: GameColors.background + "E6",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  healthLabel: {
    color: GameColors.neutralText,
    fontSize: 12,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
});
