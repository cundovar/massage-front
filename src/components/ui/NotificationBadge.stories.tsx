import type { Meta, StoryObj } from "@storybook/react";
import { NotificationBadge } from "./NotificationBadge";

const meta: Meta<typeof NotificationBadge> = {
  title: "UI/Front/NotificationBadge",
  component: NotificationBadge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    count: { control: { type: "number", min: 0, max: 999 } },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { count: 3 },
};

export const SingleDigit: Story = {
  args: { count: 5 },
};

export const DoubleDigit: Story = {
  args: { count: 42 },
};

export const TripleDigit: Story = {
  args: { count: 128 },
};

export const InContext: Story = {
  render: () => (
    <button className="relative p-2">
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span className="absolute -right-1 -top-1">
        <NotificationBadge count={3} />
      </span>
    </button>
  ),
};
