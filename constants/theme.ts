import { Platform } from "react-native";

const tintColorLight = "#9d4edd";
const tintColorDark = "#c77dff";

export const Colors = {
  light: {
    text: "#1a0f2e",
    buttonText: "#FFFFFF",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    link: "#9d4edd",
    backgroundRoot: "#FFFFFF", // Elevation 0
    backgroundDefault: "#F2F2F2", // Elevation 1
    backgroundSecondary: "#E6E6E6", // Elevation 2
    backgroundTertiary: "#D9D9D9", // Elevation 3
  },
  dark: {
    text: "#e0e1dd",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    link: "#c77dff",
    backgroundRoot: "#1a0f2e", // Elevation 0
    backgroundDefault: "#2a1f3e", // Elevation 1
    backgroundSecondary: "#3a2f4e", // Elevation 2
    backgroundTertiary: "#4a3f5e", // Elevation 3
  },
};

export const GameColors = {
  background: "#1a0f2e",
  primaryAccent: "#9d4edd",
  secondaryAccent: "#4361ee",
  orbGlow: "#c77dff",
  success: "#06ffa5",
  danger: "#ff006e",
  neutralText: "#e0e1dd",
  pillarInactive: "#3c3f51",
  pillarTarget: "#ffd60a",
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
