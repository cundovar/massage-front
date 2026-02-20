import type { Meta, StoryObj } from "@storybook/react";
import { FormationsSection } from "./FormationsSection";

const meta: Meta<typeof FormationsSection> = {
  title: "Front/Dynamic/FormationsSection",
  component: FormationsSection,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: {
      images: [],
      items: [
        { year: "2022", title: "Kobido traditionnel" },
        { year: "2024", title: "Reflexologie plantaire" },
        { year: "2025", title: "Massage ayurvedique avance" },
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    content: {
      images: [],
      items: [],
    },
  },
};
