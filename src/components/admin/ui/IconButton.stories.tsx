import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";

const TrashIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0h8m-1-2a1 1 0 00-1-1h-4a1 1 0 00-1 1l-1 2h8l-1-2z" />
  </svg>
);

const DotsIcon = (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6h.01M12 12h.01M12 18h.01" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: "UI/Admin/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "admin" },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "danger", "ghost"] },
    size: { control: "select", options: ["sm", "md"] },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: DotsIcon,
    label: "Options",
  },
};

export const Danger: Story = {
  args: {
    icon: TrashIcon,
    label: "Supprimer",
    variant: "danger",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton icon={DotsIcon} label="Small" size="sm" />
      <IconButton icon={DotsIcon} label="Medium" size="md" />
    </div>
  ),
};
