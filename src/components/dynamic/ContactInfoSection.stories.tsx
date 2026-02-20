import type { Meta, StoryObj } from "@storybook/react";
import { ContactInfoSection } from "./ContactInfoSection";

const meta: Meta<typeof ContactInfoSection> = {
  title: "Front/Dynamic/ContactInfoSection",
  component: ContactInfoSection,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: {
      title: "Informations pratiques",
      address: {
        street: "10 rue du Calme",
        city: "75011 Paris",
      },
      phone: "06 12 34 56 78",
      email: "contact@helene-massage.fr",
      hours: [
        { days: "Lundi - Vendredi", hours: "10h - 20h" },
        { days: "Samedi", hours: "10h - 18h" },
      ],
    },
  },
};

export const Minimal: Story = {
  args: {
    content: {
      title: "Contact",
      phone: "06 00 00 00 00",
      email: "hello@example.com",
    },
  },
};
