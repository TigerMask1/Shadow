import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "@/screens/HomeScreen";
import MatchmakingScreen from "@/screens/MatchmakingScreen";
import GameScreen from "@/screens/GameScreen";
import GameOverScreen from "@/screens/GameOverScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { getCommonScreenOptions } from "@/navigation/screenOptions";

export type RootStackParamList = {
  Home: undefined;
  Matchmaking: undefined;
  Game: undefined;
  GameOver: {
    result: "deposit" | "elimination" | "eliminated";
    survivalTime: number;
    eliminations: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...getCommonScreenOptions({ theme, isDark }),
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Shadow Orb" />,
          headerTransparent: true,
          headerBlurEffect: "dark",
        }}
      />
      <Stack.Screen
        name="Matchmaking"
        component={MatchmakingScreen}
        options={{
          headerTitle: "Finding Players",
          headerTransparent: true,
          headerBlurEffect: "dark",
        }}
      />
      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="GameOver"
        component={GameOverScreen}
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
    </Stack.Navigator>
  );
}
