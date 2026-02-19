import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "UI/Front/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="font-serif text-xl">Titre de la carte</h3>
        <p className="mt-2 text-gray-600">Contenu de la carte avec du texte descriptif.</p>
      </div>
    ),
  },
};

export const ServiceCard: Story = {
  args: {
    className: "max-w-sm space-y-3",
    children: (
      <>
        <span className="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-700">60 min</span>
        <h3 className="font-serif text-xl">Massage Abhyanga</h3>
        <p className="text-gray-600">Massage ayurvedique a l&apos;huile chaude...</p>
        <p className="font-semibold text-orange-600">75 EUR</p>
      </>
    ),
  },
};
