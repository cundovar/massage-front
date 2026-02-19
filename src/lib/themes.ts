export type ThemePreset = "ayurveda" | "spa-luxe" | "nature" | "zen" | "energique";

export interface ThemeConfig {
  name: string;
  description: string;
  colors: {
    primaryStart: string;
    primaryEnd: string;
    textPrimary: string;
    textSecondary: string;
    background: string;
    backgroundAlt: string;
    cardBg: string;
    cardBorder: string;
  };
  typography: {
    fontHeading: string;
  };
  buttons: {
    bg: string;
    text: string;
    border?: string;
    radius: string;
  };
  cards: {
    radius: string;
  };
}

export const THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  ayurveda: {
    name: "Ayurveda",
    description: "Tons dores, chaleureux, tradition indienne",
    colors: {
      primaryStart: "#FFCE67",
      primaryEnd: "#F67E54",
      textPrimary: "#1A1A1A",
      textSecondary: "#525252",
      background: "#FDF8F3",
      backgroundAlt: "#FFFFFF",
      cardBg: "#FFFFFF",
      cardBorder: "#E7E5E4",
    },
    typography: {
      fontHeading: "DM Serif Display",
    },
    buttons: {
      bg: "linear-gradient(135deg, #FFCE67, #F67E54)",
      text: "#FFFFFF",
      radius: "9999px",
    },
    cards: {
      radius: "1rem",
    },
  },
  "spa-luxe": {
    name: "Spa Luxe",
    description: "Elegant, haut de gamme, beige et or",
    colors: {
      primaryStart: "#D4A574",
      primaryEnd: "#C4956A",
      textPrimary: "#292524",
      textSecondary: "#57534E",
      background: "#FAFAF9",
      backgroundAlt: "#F5F5F4",
      cardBg: "#FFFFFF",
      cardBorder: "#E7E5E4",
    },
    typography: {
      fontHeading: "Playfair Display",
    },
    buttons: {
      bg: "#292524",
      text: "#FFFFFF",
      radius: "0.375rem",
    },
    cards: {
      radius: "0.5rem",
    },
  },
  nature: {
    name: "Nature",
    description: "Bio, eco-responsable, vert et organique",
    colors: {
      primaryStart: "#059669",
      primaryEnd: "#047857",
      textPrimary: "#1A1A1A",
      textSecondary: "#4B5563",
      background: "#F0FDF4",
      backgroundAlt: "#FFFFFF",
      cardBg: "#FFFFFF",
      cardBorder: "#D1FAE5",
    },
    typography: {
      fontHeading: "DM Serif Display",
    },
    buttons: {
      bg: "#059669",
      text: "#FFFFFF",
      radius: "0.75rem",
    },
    cards: {
      radius: "1.5rem",
    },
  },
  zen: {
    name: "Zen",
    description: "Minimaliste, calme, gris et blanc",
    colors: {
      primaryStart: "#78716C",
      primaryEnd: "#57534E",
      textPrimary: "#1C1917",
      textSecondary: "#78716C",
      background: "#FFFFFF",
      backgroundAlt: "#FAFAF9",
      cardBg: "#FFFFFF",
      cardBorder: "#E7E5E4",
    },
    typography: {
      fontHeading: "Inter",
    },
    buttons: {
      bg: "transparent",
      text: "#1C1917",
      border: "#1C1917",
      radius: "0",
    },
    cards: {
      radius: "0",
    },
  },
  energique: {
    name: "Energique",
    description: "Dynamique, sportif, orange et chaleur",
    colors: {
      primaryStart: "#EA580C",
      primaryEnd: "#DC2626",
      textPrimary: "#1A1A1A",
      textSecondary: "#525252",
      background: "#FFFBEB",
      backgroundAlt: "#FEF3C7",
      cardBg: "#FFFFFF",
      cardBorder: "#FED7AA",
    },
    typography: {
      fontHeading: "DM Serif Display",
    },
    buttons: {
      bg: "linear-gradient(135deg, #EA580C, #DC2626)",
      text: "#FFFFFF",
      radius: "0.5rem",
    },
    cards: {
      radius: "0.75rem",
    },
  },
};

export function generateThemeCSS(theme: ThemeConfig, customAccentColor?: string): string {
  const primaryStart = customAccentColor || theme.colors.primaryStart;
  const primaryEnd = theme.colors.primaryEnd;

  return `
    :root {
      --primary-start: ${primaryStart};
      --primary-end: ${primaryEnd};
      --gradient-primary: linear-gradient(135deg, ${primaryStart} 0%, ${primaryEnd} 100%);

      --text-primary: ${theme.colors.textPrimary};
      --text-secondary: ${theme.colors.textSecondary};

      --background: ${theme.colors.background};
      --background-alt: ${theme.colors.backgroundAlt};

      --card-bg: ${theme.colors.cardBg};
      --card-border: ${theme.colors.cardBorder};
      --card-radius: ${theme.cards.radius};

      --btn-bg: ${theme.buttons.bg};
      --btn-text: ${theme.buttons.text};
      --btn-border: ${theme.buttons.border || "transparent"};
      --btn-radius: ${theme.buttons.radius};

      --font-heading: "${theme.typography.fontHeading}", serif;

      --color-primary-start: ${primaryStart};
      --color-primary-end: ${primaryEnd};
      --color-text-primary: ${theme.colors.textPrimary};
      --color-text-secondary: ${theme.colors.textSecondary};
      --color-background: ${theme.colors.background};
      --color-background-alt: ${theme.colors.backgroundAlt};
    }
  `;
}
