import type { StorybookConfig } from "@storybook/nextjs";
import path from "node:path";

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  typescript: {
    check: false,
    reactDocgen: "react-docgen-typescript",
  },
  webpackFinal: async (cfg) => {
    if (cfg.resolve) {
      cfg.resolve.alias = {
        ...cfg.resolve.alias,
        "@": path.resolve(__dirname, "../src"),
      };
    }
    return cfg;
  },
  staticDirs: ["../public"],
};

export default config;
