import type { Meta, StoryObj } from "@storybook/react";
import { FALLBACK_SETTINGS } from "@/lib/defaultContent";
import type { FooterStyle, PublicSettings } from "@/types/settings";
import { Footer } from "./Footer";

function withFooterStyle(style: FooterStyle, backgroundColor = ""): PublicSettings {
  return { ...FALLBACK_SETTINGS, footer: { ...FALLBACK_SETTINGS.footer, style, backgroundColor } };
}

const meta: Meta<typeof Footer> = {
  title: "Front/Layout/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: "var(--background)", paddingTop: "2rem" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clair: Story = { args: { initialSettings: withFooterStyle("light") } };

export const CouleurDuTheme: Story = { args: { initialSettings: withFooterStyle("theme") } };

export const Sombre: Story = { args: { initialSettings: withFooterStyle("dark") } };

export const Transparent: Story = { args: { initialSettings: withFooterStyle("transparent") } };

export const CouleurClaire: Story = { args: { initialSettings: withFooterStyle("custom", "#E9D5B7") } };

export const CouleurFoncee: Story = { args: { initialSettings: withFooterStyle("custom", "#3F4A3C") } };
