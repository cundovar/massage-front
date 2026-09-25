import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { RichText } from "@/components/dynamic/RichText";
import { RichTextEditor } from "./RichTextEditor";

const meta: Meta<typeof RichTextEditor> = {
  title: "UI/Admin/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: { default: "admin" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function Playground({ initial, multiline }: { initial: string; multiline?: boolean }) {
  const [value, setValue] = useState(initial);

  return (
    <div className="max-w-xl space-y-6">
      <RichTextEditor
        value={value}
        onChange={setValue}
        multiline={multiline}
        placeholder="Écrivez votre texte..."
        ariaLabel="Texte du bloc"
      />
      <div className="rounded-lg border border-stone-200 bg-[var(--background)] p-4">
        <p className="mb-2 text-xs font-medium text-stone-500">Rendu sur le site</p>
        <p className="text-lg leading-loose text-[var(--text-secondary)]">
          <RichText value={value} />
        </p>
      </div>
      <pre className="overflow-x-auto rounded bg-stone-100 p-2 text-xs text-stone-600">{value || "(vide)"}</pre>
    </div>
  );
}

export const Titre: Story = {
  render: () => (
    <Playground initial={'Une <strong>pause</strong> pour <span data-color="accent">vous recentrer</span>'} />
  ),
};

export const Paragraphe: Story = {
  render: () => (
    <Playground
      multiline
      initial={
        'Massage <em>ayurvédique</em> traditionnel.<br>Un moment <span data-color="gold">de douceur</span> et de <u>lâcher-prise</u>.'
      }
    />
  ),
};

export const Vide: Story = {
  render: () => <Playground initial="" />,
};
