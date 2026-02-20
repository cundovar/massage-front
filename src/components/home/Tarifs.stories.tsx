import type { Meta, StoryObj } from "@storybook/react";
import { Tarifs } from "./Tarifs";

const meta: Meta<typeof Tarifs> = {
  title: "Front/Home/Tarifs",
  component: Tarifs,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: {
      title: "Tarifs",
      subtitle: "Choisissez le format adapte a vos besoins.",
      offers: [
        {
          title: "Abhyanga",
          description: "Soin enveloppant du corps entier.",
          prices: ["1h · 80EUR", "1h30 · 110EUR"],
        },
        {
          title: "Kobido",
          description: "Massage visage tonifiant et relaxant.",
          prices: ["45min · 70EUR"],
        },
      ],
    },
  },
};

export const SingleOffer: Story = {
  args: {
    content: {
      title: "Tarif unique",
      subtitle: "Format decouverte",
      offers: [
        {
          title: "Session decouverte",
          description: "Une premiere seance pour definir vos besoins.",
          prices: ["45min · 60EUR"],
        },
      ],
    },
  },
};
