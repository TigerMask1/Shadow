import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

import { GameColors } from "@/constants/theme";

interface JoystickProps {
  onMove: (x: number, y: number) => void;
  size?: number;
}

export function Joystick({ onMove, size = 120 }: JoystickProps) {
  const thumbSize = size * 0.42;
  const maxDistance = (size - thumbSize) / 2;

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const handleMove = (x: number, y: number) => {
    onMove(x, y);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const distance = Math.sqrt(e.translationX ** 2 + e.translationY ** 2);
      if (distance < maxDistance) {
        translateX.value = e.translationX;
        translateY.value = e.translationY;
        runOnJS(handleMove)(
          e.translationX / maxDistance,
          e.translationY / maxDistance
        );
      } else {
        const angle = Math.atan2(e.translationY, e.translationX);
        translateX.value = Math.cos(angle) * maxDistance;
        translateY.value = Math.sin(angle) * maxDistance;
        runOnJS(handleMove)(Math.cos(angle), Math.sin(angle));
      }
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(handleMove)(0, 0);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <View
        style={[
          styles.container,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
            },
            thumbStyle,
          ]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GameColors.background + "80",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: GameColors.primaryAccent + "40",
  },
  thumb: {
    backgroundColor: GameColors.primaryAccent,
    shadowColor: GameColors.primaryAccent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
});
