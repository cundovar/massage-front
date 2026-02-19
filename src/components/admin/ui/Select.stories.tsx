import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const options = [
  { value: "massage", label: "Massage" },
  { value: "soin", label: "Soin" },
  { value: "rituel", label: "Rituel" },
];

const meta: Meta<typeof Select> = {
  title: "UI/Admin/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "admin" },
  },
  argTypes: {
    disabled: { control: "boolean" },
    error: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options,
    placeholder: "Selectionner une categorie",
    defaultValue: "",
  },
};

export const WithValue: Story = {
  args: {
    options,
    defaultValue: "massage",
  },
};

export const Error: Story = {
  args: {
    options,
    placeholder: "Selectionner une categorie",
    defaultValue: "",
    error: true,
  },
};
