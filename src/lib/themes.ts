export type ThemePreset = "ayurveda" | "spa-luxe" | "nature" | "zen" | "energique";

export interface ThemeColors {
  primaryStart: string;
  primaryEnd: string;
  textPrimary: string;
  textSecondary: string;
  background: string;
  backgroundAlt: string;
  cardBg: string;
  cardBorder: string;
}

export interface ThemeConfig {
  name: string;
  description: string;
  colors: ThemeColors;
  dark: ThemeColors;
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
  footer: {
    bg: string;
    text: string;
    textMuted: string;
    border: string;
    linkHover: string;
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
    dark: {
      primaryStart: "#FFCE67",
      primaryEnd: "#F67E54",
      textPrimary: "#FAFAF9",
      textSecondary: "#A8A29E",
      background: "#1C1917",
      backgroundAlt: "#292524",
      cardBg: "#292524",
      cardBorder: "#44403C",
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
    footer: {
      bg: "#1C1917",
      text: "#FFFFFF",
      textMuted: "#A8A29E",
      border: "#292524",
      linkHover: "#FFCE67",
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
    dark: {
      primaryStart: "#D4A574",
      primaryEnd: "#C4956A",
      textPrimary: "#FAFAF9",
      textSecondary: "#A8A29E",
      background: "#1C1917",
      backgroundAlt: "#292524",
      cardBg: "#292524",
      cardBorder: "#44403C",
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
    footer: {
      bg: "#292524",
      text: "#FAFAF9",
      textMuted: "#A8A29E",
      border: "#44403C",
      linkHover: "#D4A574",
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
    dark: {
      primaryStart: "#34D399",
      primaryEnd: "#10B981",
      textPrimary: "#ECFDF5",
      textSecondary: "#A7F3D0",
      background: "#022C22",
      backgroundAlt: "#064E3B",
      cardBg: "#064E3B",
      cardBorder: "#047857",
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
    footer: {
      bg: "#064E3B",
      text: "#ECFDF5",
      textMuted: "#A7F3D0",
      border: "#047857",
      linkHover: "#34D399",
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
    dark: {
      primaryStart: "#A8A29E",
      primaryEnd: "#78716C",
      textPrimary: "#FAFAF9",
      textSecondary: "#A8A29E",
      background: "#1C1917",
      backgroundAlt: "#292524",
      cardBg: "#292524",
      cardBorder: "#44403C",
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
    footer: {
      bg: "#FAFAF9",
      text: "#1C1917",
      textMuted: "#78716C",
      border: "#E7E5E4",
      linkHover: "#57534E",
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
    dark: {
      primaryStart: "#FB923C",
      primaryEnd: "#F97316",
      textPrimary: "#FFF7ED",
      textSecondary: "#FDBA74",
      background: "#431407",
      backgroundAlt: "#7C2D12",
      cardBg: "#7C2D12",
      cardBorder: "#9A3412",
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
    footer: {
      bg: "#7C2D12",
      text: "#FFF7ED",
      textMuted: "#FDBA74",
      border: "#9A3412",
      linkHover: "#FB923C",
    },
  },
};

export function generateThemeCSS(theme: ThemeConfig, customAccentColor?: string): string {
  const primaryStart = customAccentColor || theme.colors.primaryStart;
  const primaryEnd = theme.colors.primaryEnd;
  const darkPrimaryStart = customAccentColor || theme.dark.primaryStart;
  const darkPrimaryEnd = theme.dark.primaryEnd;

  return `
    :root, [data-theme="light"] {
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

      --footer-bg: ${theme.footer.bg};
      --footer-text: ${theme.footer.text};
      --footer-text-muted: ${theme.footer.textMuted};
      --footer-border: ${theme.footer.border};
      --footer-link-hover: ${theme.footer.linkHover};
    }

    [data-theme="dark"] {
      --primary-start: ${darkPrimaryStart};
      --primary-end: ${darkPrimaryEnd};
      --gradient-primary: linear-gradient(135deg, ${darkPrimaryStart} 0%, ${darkPrimaryEnd} 100%);

      --text-primary: ${theme.dark.textPrimary};
      --text-secondary: ${theme.dark.textSecondary};

      --background: ${theme.dark.background};
      --background-alt: ${theme.dark.backgroundAlt};

      --card-bg: ${theme.dark.cardBg};
      --card-border: ${theme.dark.cardBorder};

      --color-primary-start: ${darkPrimaryStart};
      --color-primary-end: ${darkPrimaryEnd};
      --color-text-primary: ${theme.dark.textPrimary};
      --color-text-secondary: ${theme.dark.textSecondary};
      --color-background: ${theme.dark.background};
      --color-background-alt: ${theme.dark.backgroundAlt};
    }
  `;
}
