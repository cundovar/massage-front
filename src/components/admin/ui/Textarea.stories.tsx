import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Admin/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "admin" },
  },
  argTypes: {
    rows: { control: { type: "number", min: 2, max: 10 } },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows: 4,
    placeholder: "Decrire le service...",
  },
};

export const Error: Story = {
  args: {
    rows: 4,
    placeholder: "Description invalide",
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    rows: 4,
    placeholder: "Champ desactive",
    disabled: true,
  },
};
