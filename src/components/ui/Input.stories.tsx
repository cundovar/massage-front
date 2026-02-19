import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "UI/Front/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "tel", "password", "number"],
    },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Entrez du texte...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "email@exemple.com",
  },
};

export const Phone: Story = {
  args: {
    type: "tel",
    placeholder: "06 12 34 56 78",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Champ desactive",
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[320px] space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Votre nom <span className="text-red-500">*</span>
      </label>
      <Input placeholder="Jean Dupont" required />
    </div>
  ),
};
