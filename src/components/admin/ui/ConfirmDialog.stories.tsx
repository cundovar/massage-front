import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "./ConfirmDialog";
import { Button } from "./Button";

const meta: Meta<typeof ConfirmDialog> = {
  title: "UI/Admin/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    backgrounds: { default: "admin" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ConfirmDialogDemo({ variant = "danger" }: { variant?: "danger" | "warning" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant={variant === "danger" ? "danger" : "secondary"} onClick={() => setOpen(true)}>
        Ouvrir la confirmation
      </Button>
      <ConfirmDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title="Confirmer l'action"
        message="Cette action ne pourra pas etre annulee."
        variant={variant}
      />
    </>
  );
}

export const Danger: Story = {
  render: () => <ConfirmDialogDemo variant="danger" />,
};

export const Warning: Story = {
  render: () => <ConfirmDialogDemo variant="warning" />,
};
