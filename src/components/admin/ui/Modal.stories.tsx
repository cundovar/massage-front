import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "./Button";

const meta: Meta<typeof Modal> = {
  title: "UI/Admin/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function ModalDemo({ size = "md" }: { size?: "sm" | "md" | "lg" | "xl" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Ouvrir la modale</Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size={size} title="Titre de la modale">
        <p className="mb-6 text-gray-600">Contenu de la modale. Vous pouvez mettre n&apos;importe quel contenu ici.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={() => setIsOpen(false)}>
            Confirmer
          </Button>
        </div>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const Small: Story = {
  render: () => <ModalDemo size="sm" />,
};

export const Large: Story = {
  render: () => <ModalDemo size="lg" />,
};

export const ExtraLarge: Story = {
  render: () => <ModalDemo size="xl" />,
};
