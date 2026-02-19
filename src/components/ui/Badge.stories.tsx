import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Front/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Duration: Story = {
  args: {
    children: "60 min",
  },
};

export const Category: Story = {
  args: {
    children: "Ayurveda",
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="flex gap-2">
      <Badge>Relaxant</Badge>
      <Badge>60 min</Badge>
      <Badge>Huile chaude</Badge>
    </div>
  ),
};
