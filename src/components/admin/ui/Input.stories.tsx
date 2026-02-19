import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Admin/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "admin" },
  },
  argTypes: {
    type: { control: "select", options: ["text", "email", "number", "password", "tel"] },
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { placeholder: "Saisir une valeur" } };
export const Error: Story = { args: { placeholder: "Champ invalide", error: true } };
export const Disabled: Story = { args: { placeholder: "Desactive", disabled: true } };
