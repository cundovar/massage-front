import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import type { PageSection } from "@/lib/api-admin";
import { BLOCK_CATALOG, getBlockDefinition } from "./block-catalog";
import { BlockEditor } from "./BlockEditor";
import { LivePreview } from "./LivePreview";

function Playground({ blockType }: { blockType: string }) {
  const definition = getBlockDefinition(blockType) ?? BLOCK_CATALOG[0];
  const [section, setSection] = useState<PageSection>({
    key: `${definition.type}-story`,
    type: definition.type,
    title: null,
    content: JSON.parse(JSON.stringify(definition.defaultContent)) as Record<string, unknown>,
    sortOrder: 0,
    visible: true,
    updatedAt: new Date().toISOString(),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
        <BlockEditor
          section={section}
          definition={definition}
          token="storybook"
          onUpdate={(updates) => setSection((current) => ({ ...current, ...updates }))}
        />
      </div>
      <div className="min-w-0">
        <LivePreview sections={[section]} activeSection={section.key} onSelectSection={() => undefined} />
      </div>
    </div>
  );
}

const meta: Meta<typeof Playground> = {
  title: "Admin/PageBuilder/BlockEditor",
  component: Playground,
  parameters: { layout: "padded", backgrounds: { default: "admin" } },
  argTypes: {
    blockType: {
      control: "select",
      options: BLOCK_CATALOG.map((block) => block.type),
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Editeur: Story = {
  args: { blockType: "hero-home" },
  render: (args) => <Playground key={args.blockType} blockType={args.blockType} />,
};
