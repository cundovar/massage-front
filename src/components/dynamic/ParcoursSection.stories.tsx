import type { Meta, StoryObj } from "@storybook/react";
import { ParcoursSection } from "./ParcoursSection";

const meta: Meta<typeof ParcoursSection> = {
  title: "Front/Dynamic/ParcoursSection",
  component: ParcoursSection,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: {
      image: null,
      paragraphs: [
        "Apres plusieurs annees de pratique, j'ai affine une approche centree sur l'ecoute.",
        "Chaque seance est adaptee au besoin du moment.",
      ],
    },
  },
};

export const LongText: Story = {
  args: {
    content: {
      image: null,
      paragraphs: [
        "Mon parcours commence par les techniques traditionnelles puis evolue vers une approche globale.",
        "Je combine precision du geste et attention a la respiration.",
        "L'objectif est de retrouver un etat d'equilibre durable.",
      ],
    },
  },
};
