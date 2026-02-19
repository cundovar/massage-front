import type { Meta, StoryObj } from "@storybook/react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "UI/Admin/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "admin" },
  },
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    label: { control: "text" },
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Activer", checked: false } };
export const Checked: Story = { args: { label: "Activer", checked: true } };
export const Disabled: Story = { args: { label: "Indisponible", disabled: true } };
