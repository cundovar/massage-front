import type { StorybookConfig } from "@storybook/nextjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: [],
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
