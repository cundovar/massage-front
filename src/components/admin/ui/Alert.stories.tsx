import type { Meta, StoryObj } from "@storybook/react";
import { Alert } from "./Alert";

const meta: Meta<typeof Alert> = {
  title: "UI/Admin/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: { default: "admin" },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["success", "error", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: "success",
    children: "Les modifications ont ete enregistrees avec succes.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "Une erreur est survenue lors de la sauvegarde.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Attention : cette action est irreversible.",
  },
};

export const Info: Story = {
  args: {
    variant: "info",
    children: "Les nouvelles reservations apparaitront ici.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Alert variant="success">Succes : operation terminee.</Alert>
      <Alert variant="error">Erreur : echec de la connexion.</Alert>
      <Alert variant="warning">Attention : donnees non sauvegardees.</Alert>
      <Alert variant="info">Info : mise a jour disponible.</Alert>
    </div>
  ),
};
