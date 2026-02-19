import type { Meta, StoryObj } from "@storybook/react";
import { FormField } from "./FormField";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";

const meta: Meta<typeof FormField> = {
  title: "UI/Admin/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: { default: "admin" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const categoryOptions = [
  { value: "massage", label: "Massage" },
  { value: "soin", label: "Soin" },
  { value: "rituel", label: "Rituel" },
];

export const WithInput: Story = {
  args: {
    label: "Nom du service",
    required: true,
    children: <Input placeholder="Ex: Massage Abhyanga" />,
  },
};

export const WithHint: Story = {
  args: {
    label: "Slug",
    hint: "Identifiant unique pour l'URL (genere automatiquement)",
    children: <Input placeholder="massage-abhyanga" />,
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    required: true,
    error: "Ce champ est obligatoire",
    children: <Input type="email" placeholder="email@exemple.com" error />,
  },
};

export const WithSelect: Story = {
  args: {
    label: "Categorie",
    children: <Select options={categoryOptions} placeholder="Selectionner..." defaultValue="" />,
  },
};

export const WithTextarea: Story = {
  args: {
    label: "Description",
    hint: "Maximum 500 caracteres",
    children: <Textarea rows={4} placeholder="Decrivez le service..." />,
  },
};

export const CompleteForm: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <FormField label="Nom" required>
        <Input placeholder="Nom du service" />
      </FormField>
      <FormField label="Categorie">
        <Select options={categoryOptions} placeholder="Selectionner..." defaultValue="" />
      </FormField>
      <FormField label="Description" hint="Courte description pour les cartes">
        <Textarea rows={3} placeholder="Description..." />
      </FormField>
      <FormField label="Prix" error="Le prix doit etre superieur a 0">
        <Input type="number" placeholder="75" error />
      </FormField>
    </div>
  ),
};
