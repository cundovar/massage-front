import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
  title: "Front/Layout/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialNavItems: [
      { slug: "home", title: "Accueil", path: "/" },
      { slug: "soins", title: "Carte & tarifs", path: "/soins" },
      { slug: "entreprise", title: "Entreprise", path: "/entreprise" },
      { slug: "about", title: "A propos", path: "/a-propos" },
      { slug: "contact", title: "Contact", path: "/contact" },
    ],
  },
};

export const OnContactPage: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/contact",
      },
    },
  },
  args: {
    initialNavItems: [
      { slug: "home", title: "Accueil", path: "/" },
      { slug: "soins", title: "Carte & tarifs", path: "/soins" },
      { slug: "entreprise", title: "Entreprise", path: "/entreprise" },
      { slug: "about", title: "A propos", path: "/a-propos" },
      { slug: "contact", title: "Contact", path: "/contact" },
    ],
  },
};
