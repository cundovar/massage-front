import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Front/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Bouton de base pour les actions sur le site public.",
      },
    },
  },
  argTypes: {
    children: { control: "text" },
    className: { control: "text" },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Bouton",
  },
};

export const Gradient: Story = {
  args: {
    children: "Reserver",
    className: "bg-gradient-primary text-white",
  },
};

export const WithLift: Story = {
  args: {
    children: "Prendre rendez-vous",
    className: "bg-gradient-primary px-8 py-4 text-white button-lift",
  },
};

export const Disabled: Story = {
  args: {
    children: "Indisponible",
    disabled: true,
    className: "opacity-50 cursor-not-allowed",
  },
};

export const FullWidth: Story = {
  args: {
    children: "Envoyer",
    className: "w-full bg-gradient-primary text-white",
  },
  parameters: {
    layout: "padded",
  },
};
