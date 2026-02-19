import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "UI/Admin/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: { default: "admin" },
  },
  argTypes: {
    padding: { control: "select", options: ["none", "sm", "md", "lg"] },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-lg font-semibold text-stone-900">Titre</h3>
        <p className="mt-2 text-sm text-stone-600">Contenu de carte admin.</p>
      </div>
    ),
  },
};

export const SmallPadding: Story = {
  args: {
    padding: "sm",
    children: <p className="text-sm text-stone-700">Padding compact.</p>,
  },
};

export const LargePadding: Story = {
  args: {
    padding: "lg",
    children: <p className="text-sm text-stone-700">Padding confortable pour sections denses.</p>,
  },
};
