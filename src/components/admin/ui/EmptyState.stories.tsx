import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";
import { Button } from "./Button";

const meta: Meta<typeof EmptyState> = {
  title: "UI/Admin/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: { default: "admin" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Aucun service",
    description: "Commencez par creer votre premier service.",
  },
};

export const WithAction: Story = {
  args: {
    title: "Aucune reservation",
    description: "Les nouvelles reservations apparaitront ici.",
    action: <Button variant="primary">Rafraichir</Button>,
  },
};

export const WithIcon: Story = {
  args: {
    icon: (
      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: "Mediatheque vide",
    description: "Uploadez des images pour les utiliser sur votre site.",
    action: <Button variant="primary">Uploader une image</Button>,
  },
};
