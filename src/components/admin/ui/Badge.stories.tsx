import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Admin/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "admin" },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "success", "warning", "danger", "info"] },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "Brouillon" } };
export const Success: Story = { args: { variant: "success", children: "Publie" } };
export const Warning: Story = { args: { variant: "warning", children: "En attente" } };
export const Danger: Story = { args: { variant: "danger", children: "Erreur" } };
export const Info: Story = { args: { variant: "info", children: "Nouveau" } };
