import type { Meta, StoryObj } from "@storybook/react";
import { FormSection } from "./FormSection";
import { Input } from "./Input";
import { FormField } from "./FormField";

const meta: Meta<typeof FormSection> = {
  title: "UI/Admin/FormSection",
  component: FormSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: { default: "admin" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Informations generales",
    description: "Configuration principale du service",
    children: (
      <FormField label="Nom du service">
        <Input placeholder="Massage Abhyanga" />
      </FormField>
    ),
  },
};

export const MultipleFields: Story = {
  render: () => (
    <FormSection title="Contact" description="Coordonnees visibles sur le site public">
      <FormField label="Telephone">
        <Input placeholder="06 12 34 56 78" />
      </FormField>
      <FormField label="Email">
        <Input type="email" placeholder="contact@exemple.com" />
      </FormField>
    </FormSection>
  ),
};
