import React from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import Spacer from "@/components/Spacer";
import { Spacing, BorderRadius } from "@/constants/theme";
import { GameColors } from "@/constants/theme";
import { WARRIORS, WarriorClass } from "@/utils/warriors";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function WarriorSelectScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [selectedWarrior, setSelectedWarrior] = React.useState<WarriorClass>(WARRIORS[0]);
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const handleWarriorSelect = (warrior: WarriorClass) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedWarrior(warrior);
  };

  const handleStartBattle = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.navigate("Matchmaking", { selectedWarrior });
  };

  return (
    <LinearGradient
      colors={[GameColors.background, selectedWarrior.glowColor + "15"]}
      style={styles.container}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.lg,
          },
        ]}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>CHOOSE YOUR WARRIOR</ThemedText>
          <Spacer height={Spacing.sm} />
          <ThemedText style={styles.subtitle}>
            Each warrior has unique abilities and playstyle
          </ThemedText>
        </View>

        <View style={styles.mainSection}>
          <View style={styles.previewSection}>
            <Animated.View style={[styles.characterPreview, pulseStyle]}>
              <View
                style={[
                  styles.characterCircle,
                  {
                    backgroundColor: selectedWarrior.color,
                    shadowColor: selectedWarrior.glowColor,
                  },
                ]}
              />
            </Animated.View>

            <Spacer height={Spacing.lg} />

            <View style={styles.warriorInfo}>
              <ThemedText style={[styles.warriorName, { color: selectedWarrior.glowColor }]}>
                {selectedWarrior.name}
              </ThemedText>
              <Spacer height={Spacing.xs} />
              <ThemedText style={styles.warriorDescription}>
                {selectedWarrior.description}
              </ThemedText>
              <Spacer height={Spacing.md} />
              <View style={styles.typeTag}>
                <ThemedText style={styles.typeText}>{selectedWarrior.type.toUpperCase()}</ThemedText>
              </View>
            </View>

            <Spacer height={Spacing.lg} />

            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Health</ThemedText>
                <View style={styles.statBarContainer}>
                  <View
                    style={[
                      styles.statBar,
                      {
                        width: `${(selectedWarrior.stats.maxHealth / 200) * 100}%`,
                        backgroundColor: selectedWarrior.glowColor,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={styles.statValue}>{selectedWarrior.stats.maxHealth}</ThemedText>
              </View>

              <View style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Speed</ThemedText>
                <View style={styles.statBarContainer}>
                  <View
                    style={[
                      styles.statBar,
                      {
                        width: `${(selectedWarrior.stats.moveSpeed / 5) * 100}%`,
                        backgroundColor: selectedWarrior.glowColor,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={styles.statValue}>{selectedWarrior.stats.moveSpeed.toFixed(1)}</ThemedText>
              </View>

              <View style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Defense</ThemedText>
                <View style={styles.statBarContainer}>
                  <View
                    style={[
                      styles.statBar,
                      {
                        width: `${(selectedWarrior.stats.defense / 1.5) * 100}%`,
                        backgroundColor: selectedWarrior.glowColor,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={styles.statValue}>{selectedWarrior.stats.defense.toFixed(1)}</ThemedText>
              </View>
            </View>

            <Spacer height={Spacing.lg} />

            <View style={styles.abilitiesContainer}>
              <ThemedText style={styles.sectionTitle}>ABILITIES</ThemedText>
              <Spacer height={Spacing.md} />
              {selectedWarrior.abilities.map((ability, index) => (
                <View key={ability.id} style={styles.abilityCard}>
                  <View style={styles.abilityHeader}>
                    <View
                      style={[
                        styles.abilityIcon,
                        {
                          backgroundColor: ability.color + "40",
                          borderColor: ability.color,
                        },
                      ]}
                    >
                      <ThemedText style={[styles.abilityNumber, { color: ability.color }]}>
                        {index + 1}
                      </ThemedText>
                    </View>
                    <View style={styles.abilityDetails}>
                      <ThemedText style={styles.abilityName}>{ability.name}</ThemedText>
                      <ThemedText style={styles.abilityDescription}>
                        {ability.description}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.abilityStats}>
                    <View style={styles.abilityStatItem}>
                      <ThemedText style={styles.abilityStatLabel}>DMG</ThemedText>
                      <ThemedText style={[styles.abilityStatValue, { color: ability.color }]}>
                        {ability.damage}
                      </ThemedText>
                    </View>
                    <View style={styles.abilityStatItem}>
                      <ThemedText style={styles.abilityStatLabel}>CD</ThemedText>
                      <ThemedText style={[styles.abilityStatValue, { color: ability.color }]}>
                        {ability.cooldown}s
                      </ThemedText>
                    </View>
                    <View style={styles.abilityStatItem}>
                      <ThemedText style={styles.abilityStatLabel}>RNG</ThemedText>
                      <ThemedText style={[styles.abilityStatValue, { color: ability.color }]}>
                        {ability.range}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.selectionSection}>
            <ScrollView
              style={styles.warriorList}
              contentContainerStyle={styles.warriorListContent}
              showsVerticalScrollIndicator={false}
            >
              {WARRIORS.map((warrior) => (
                <TouchableOpacity
                  key={warrior.id}
                  onPress={() => handleWarriorSelect(warrior)}
                  style={[
                    styles.warriorCard,
                    selectedWarrior.id === warrior.id && [
                      styles.warriorCardSelected,
                      { borderColor: warrior.glowColor, backgroundColor: warrior.glowColor + "15" },
                    ],
                  ]}
                >
                  <View
                    style={[
                      styles.warriorCardCircle,
                      {
                        backgroundColor: warrior.color,
                        shadowColor: warrior.glowColor,
                      },
                    ]}
                  />
                  <View style={styles.warriorCardInfo}>
                    <ThemedText style={styles.warriorCardName}>{warrior.name}</ThemedText>
                    <ThemedText style={styles.warriorCardType}>{warrior.type}</ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="ENTER BATTLE"
            onPress={handleStartBattle}
            style={[styles.battleButton, { backgroundColor: selectedWarrior.glowColor }]}
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
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    color: GameColors.neutralText,
    letterSpacing: 2,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: GameColors.neutralText,
    opacity: 0.7,
  },
  mainSection: {
    flex: 1,
    flexDirection: "row",
    marginTop: Spacing.lg,
  },
  previewSection: {
    flex: 2,
    marginRight: Spacing.md,
  },
  characterPreview: {
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  characterCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 15,
  },
  warriorInfo: {
    alignItems: "center",
  },
  warriorName: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  warriorDescription: {
    fontSize: 13,
    textAlign: "center",
    color: GameColors.neutralText,
    opacity: 0.8,
    paddingHorizontal: Spacing.md,
  },
  typeTag: {
    backgroundColor: GameColors.background + "CC",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: GameColors.neutralText + "40",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
    color: GameColors.neutralText,
    letterSpacing: 1,
  },
  statsContainer: {
    backgroundColor: GameColors.background + "80",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: GameColors.neutralText + "20",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: GameColors.neutralText,
    width: 60,
  },
  statBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: GameColors.background + "CC",
    borderRadius: 6,
    marginHorizontal: Spacing.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: GameColors.neutralText + "30",
  },
  statBar: {
    height: "100%",
    borderRadius: 6,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "700",
    color: GameColors.neutralText,
    width: 40,
    textAlign: "right",
  },
  abilitiesContainer: {
    backgroundColor: GameColors.background + "80",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: GameColors.neutralText + "20",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: GameColors.neutralText,
    letterSpacing: 1,
  },
  abilityCard: {
    backgroundColor: GameColors.background + "60",
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: GameColors.neutralText + "20",
  },
  abilityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xs,
  },
  abilityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    marginRight: Spacing.sm,
  },
  abilityNumber: {
    fontSize: 14,
    fontWeight: "800",
  },
  abilityDetails: {
    flex: 1,
  },
  abilityName: {
    fontSize: 13,
    fontWeight: "700",
    color: GameColors.neutralText,
  },
  abilityDescription: {
    fontSize: 11,
    color: GameColors.neutralText,
    opacity: 0.7,
  },
  abilityStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: Spacing.xs,
  },
  abilityStatItem: {
    alignItems: "center",
  },
  abilityStatLabel: {
    fontSize: 10,
    color: GameColors.neutralText,
    opacity: 0.6,
  },
  abilityStatValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  selectionSection: {
    width: 180,
  },
  warriorList: {
    flex: 1,
  },
  warriorListContent: {
    gap: Spacing.sm,
  },
  warriorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GameColors.background + "CC",
    borderRadius: BorderRadius.lg,
    padding: Spacing.sm,
    borderWidth: 2,
    borderColor: "transparent",
  },
  warriorCardSelected: {
    borderWidth: 3,
  },
  warriorCardCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: Spacing.sm,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  warriorCardInfo: {
    flex: 1,
  },
  warriorCardName: {
    fontSize: 12,
    fontWeight: "700",
    color: GameColors.neutralText,
  },
  warriorCardType: {
    fontSize: 10,
    color: GameColors.neutralText,
    opacity: 0.6,
    textTransform: "uppercase",
  },
  buttonContainer: {
    paddingTop: Spacing.md,
  },
  battleButton: {
    height: 56,
  },
});
