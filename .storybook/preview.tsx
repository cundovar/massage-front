import type { Preview } from "@storybook/react";
import { THEME_PRESETS, generateThemeCSS, type ThemePreset } from "../src/lib/themes";
import "../src/app/globals.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Preset de theme du site",
      defaultValue: "ayurveda",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "ayurveda", title: "Ayurveda (defaut)" },
          { value: "spa-luxe", title: "Spa Luxe" },
          { value: "nature", title: "Nature" },
          { value: "zen", title: "Zen" },
          { value: "energique", title: "Energique" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#ffffff" },
        { name: "gray", value: "#fafafa" },
        { name: "dark", value: "#1a1a1a" },
        { name: "admin", value: "#faf8f5" },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: "Mobile", styles: { width: "375px", height: "667px" } },
        tablet: { name: "Tablet", styles: { width: "768px", height: "1024px" } },
        desktop: { name: "Desktop", styles: { width: "1280px", height: "800px" } },
      },
    },
  },
  decorators: [
    (Story, context) => {
      const themeName = context.globals.theme as ThemePreset;
      const theme = THEME_PRESETS[themeName] || THEME_PRESETS.ayurveda;
      const themeCSS = generateThemeCSS(theme);

      return (
        <>
          <style>{themeCSS}</style>
          <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            <Story />
          </div>
        </>
      );
    },
  ],
  tags: ["autodocs"],
};

export default preview;
